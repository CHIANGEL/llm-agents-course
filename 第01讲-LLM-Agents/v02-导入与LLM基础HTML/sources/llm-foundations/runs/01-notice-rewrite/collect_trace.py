"""Collect unmodified CPU greedy-generation traces from a pinned official model."""
from pathlib import Path
import hashlib, json, platform, sys, time
from datetime import datetime, timezone
import torch, transformers
from transformers import AutoModelForCausalLM, AutoTokenizer

OUT = Path(__file__).resolve().parent
REPO = 'HuggingFaceTB/SmolLM2-135M-Instruct'
REV = 'ec84f302454dcb013b57c8acd7ca9cb331981e7e'
CACHE = Path('/private/tmp/mba-smollm2-cache')
MODEL = CACHE / ('models--' + REPO.replace('/', '--')) / 'snapshots' / REV
MAX_NEW_TOKENS = 40

def dump(name, value):
    (OUT/name).write_text(json.dumps(value, ensure_ascii=False, indent=2)+'\n')

def sha(path): return hashlib.sha256(path.read_bytes()).hexdigest()

def main():
    torch.set_num_threads(4)
    torch.manual_seed(0)
    tokenizer = AutoTokenizer.from_pretrained(MODEL, local_files_only=True)
    model = AutoModelForCausalLM.from_pretrained(MODEL, local_files_only=True, dtype=torch.float32).eval().to('cpu')
    cases = [
        "Rewrite this notice in one short formal sentence: Today’s lecture is cancelled.",
        "Rewrite this notice in one short formal sentence: Today's lecture is cancelled.",
        "Write one formal sentence to announce that today's lecture is cancelled. Return only the sentence.",
    ]
    attempts=[]
    chosen=None
    for i, prompt in enumerate(cases,1):
        messages=[{'role':'system','content':'You are a helpful assistant.'},{'role':'user','content':prompt}]
        template=tokenizer.apply_chat_template(messages, tokenize=False, add_generation_prompt=True)
        inputs=tokenizer(template, return_tensors='pt', add_special_tokens=False)
        tic=time.time()
        with torch.inference_mode():
            result=model.generate(**inputs,do_sample=False,max_new_tokens=MAX_NEW_TOKENS,return_dict_in_generate=True,output_scores=True,pad_token_id=tokenizer.eos_token_id)
        generated=result.sequences[0, inputs['input_ids'].shape[1]:].tolist()
        answer=tokenizer.decode(generated,skip_special_tokens=True,clean_up_tokenization_spaces=False)
        eos=bool(generated and generated[-1]==tokenizer.eos_token_id)
        attempt={'attempt':i,'messages':messages,'template':template,'generated_token_ids':generated,'answer':answer,'steps':len(generated),'eos':eos,'seconds':round(time.time()-tic,3)}
        attempts.append(attempt)
        dump('attempts.json',attempts)
        print(json.dumps(attempt,ensure_ascii=False),flush=True)
        if eos:
            chosen=(attempt,inputs,result); break
    if chosen is None: chosen=(attempt,inputs,result)
    attempt,inputs,result=chosen
    generated=attempt['generated_token_ids']
    input_ids=inputs['input_ids'][0].tolist()
    records=[]
    for index,(token_id,score) in enumerate(zip(generated,result.scores),1):
        probs=torch.softmax(score[0].float(),dim=-1)
        values,ids=torch.topk(probs,10)
        before=generated[:index-1]; after=generated[:index]
        decoded_before=tokenizer.decode(before,skip_special_tokens=True,clean_up_tokenization_spaces=False)
        decoded_after=tokenizer.decode(after,skip_special_tokens=True,clean_up_tokenization_spaces=False)
        tops=[{'rank':j+1,'token_id':int(t),'token_text':tokenizer.decode([int(t)],skip_special_tokens=False,clean_up_tokenization_spaces=False),'token_raw':tokenizer.convert_ids_to_tokens(int(t)),'probability':float(p)} for j,(p,t) in enumerate(zip(values.tolist(),ids.tolist()))]
        assert token_id==tops[0]['token_id'], 'Greedy-selected token must be top-1'
        records.append({'step':index,'input_token_ids':input_ids+before,'input_text':tokenizer.decode(input_ids+before,skip_special_tokens=False,clean_up_tokenization_spaces=False),'generated_before':decoded_before,'generated_after':decoded_after,'incremental_text':decoded_after[len(decoded_before):] if decoded_after.startswith(decoded_before) else None,'chosen_token_id':token_id,'chosen_token_text':tokenizer.decode([token_id],skip_special_tokens=False,clean_up_tokenization_spaces=False),'chosen_token_raw':tokenizer.convert_ids_to_tokens(token_id),'chosen_probability':float(probs[token_id]),'top10':tops,'top10_remaining_probability':float(1-values.sum()),'top5_remaining_probability':float(1-values[:5].sum()),'eos':token_id==tokenizer.eos_token_id})
    trace={'model':REPO,'revision':REV,'generation':{'do_sample':False,'max_new_tokens':MAX_NEW_TOKENS,'selection':'greedy argmax','temperature_applied':False,'device':'cpu','dtype':'float32'},'messages':attempt['messages'],'chat_template_text':attempt['template'],'input_token_ids':input_ids,'vocab_size':model.config.vocab_size,'tokenizer_length':len(tokenizer),'eos_token_id':tokenizer.eos_token_id,'eos_token_text':tokenizer.eos_token,'generated_token_ids':generated,'output_text':attempt['answer'],'stop_reason':'eos_token' if attempt['eos'] else 'max_new_tokens','steps':records}
    dump('generation-trace.json',trace)
    (OUT/'input-chat-template.txt').write_text(attempt['template'])
    (OUT/'generated-answer.txt').write_text(attempt['answer']+'\n')
    (OUT/'model-chat-template.jinja').write_text(tokenizer.chat_template)
    hashes={p.name:{'bytes':p.stat().st_size,'sha256':sha(p)} for p in MODEL.iterdir() if p.is_file()}
    dump('provenance.json',{'collected_at_utc':datetime.now(timezone.utc).isoformat(),'model':REPO,'revision':REV,'official_model_url':f'https://huggingface.co/{REPO}/tree/{REV}','model_cache':str(MODEL),'downloaded_files':hashes,'python':sys.version,'torch':torch.__version__,'transformers':transformers.__version__,'platform':platform.platform(),'method':'Official pinned model, CPU float32, greedy model.generate; full softmax over model output vocabulary for each returned generation score. No probability editing or answer editing.','original_course_connection':'Formal cancellation notice; chat-template structure reuses the same SmolLM2 family and pinned revision as original lecture.','selected_attempt':attempt['attempt'],'all_attempts_file':'attempts.json','output_steps':len(records),'stop_reason':trace['stop_reason'],'temperature_applied':False,'script_sha256':sha(Path(__file__)),'trace_sha256':sha(OUT/'generation-trace.json')})
    print('TRACE_SAVED',len(records),trace['stop_reason'],flush=True)
if __name__=='__main__': main()
