"""Independently replay every complete prefix without generation cache."""
from pathlib import Path
import json, hashlib
import torch
from transformers import AutoModelForCausalLM, AutoTokenizer
P=Path(__file__).resolve().parent
trace=json.loads((P/'generation-trace.json').read_text())
model_path=Path('/private/tmp/mba-smollm2-cache') / ('models--'+trace['model'].replace('/','--')) / 'snapshots' / trace['revision']
torch.set_num_threads(4)
tokenizer=AutoTokenizer.from_pretrained(model_path,local_files_only=True)
model=AutoModelForCausalLM.from_pretrained(model_path,local_files_only=True,dtype=torch.float32).eval().to('cpu')
checks=[]
for step in trace['steps']:
    inputs=torch.tensor([step['input_token_ids']],dtype=torch.long)
    with torch.inference_mode(): scores=model(input_ids=inputs,use_cache=False).logits[0,-1,:].float()
    probs=torch.softmax(scores,dim=-1)
    chosen=int(torch.argmax(probs))
    probability=float(probs[chosen])
    delta=abs(probability-step['chosen_probability'])
    assert chosen==step['chosen_token_id']
    assert delta<0.00001,delta
    assert 0<=step['top10_remaining_probability']<=1
    assert abs(sum(c['probability'] for c in step['top10'])+step['top10_remaining_probability']-1)<0.000001
    assert step['input_text']==tokenizer.decode(step['input_token_ids'],skip_special_tokens=False,clean_up_tokenization_spaces=False)
    checks.append({'step':step['step'],'chosen_id_matches':True,'chosen_probability_difference':delta,'top10_plus_remaining_equals_one':True,'prefix_text_matches_token_ids':True})
assert trace['steps'][-1]['eos']
assert not any(s['eos'] for s in trace['steps'][:-1])
assert trace['output_text']==tokenizer.decode(trace['generated_token_ids'],skip_special_tokens=True,clean_up_tokenization_spaces=False)
assert trace['chat_template_text']==tokenizer.apply_chat_template(trace['messages'],tokenize=False,add_generation_prompt=True)
(P/'verification.json').write_text(json.dumps({'method':'Recompute each full prefix through model.forward(use_cache=False), independent from cached generation scores','status':'passed','trace_sha256':hashlib.sha256((P/'generation-trace.json').read_bytes()).hexdigest(),'steps':checks,'eos_only_at_last_step':True,'template_matches_messages':True,'final_decode_matches_output':True},ensure_ascii=False,indent=2)+'\n')
print('PASS',len(checks),'maximum probability difference',max(c['chosen_probability_difference'] for c in checks))
