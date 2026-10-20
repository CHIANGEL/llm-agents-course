"""Recover the first-step full-vocabulary scores from the pinned local model."""
from pathlib import Path
import json, hashlib
from datetime import datetime, timezone
import torch, transformers
from transformers import AutoModelForCausalLM, AutoTokenizer
from transformers.generation.logits_process import TemperatureLogitsWarper, TopKLogitsWarper, TopPLogitsWarper

out=Path(__file__).resolve().parent
deck=out.parents[2]
rev='ec84f302454dcb013b57c8acd7ca9cb331981e7e'
cache=Path('/private/tmp/mba-smollm2-cache/models--HuggingFaceTB--SmolLM2-135M-Instruct/snapshots')/rev
trace=json.loads((out.parent/'generation-trace.json').read_text())
torch.set_num_threads(4)
tokenizer=AutoTokenizer.from_pretrained(cache,local_files_only=True)
model=AutoModelForCausalLM.from_pretrained(cache,local_files_only=True,dtype=torch.float32).eval()
ids=torch.tensor([trace['input_token_ids']])
with torch.inference_mode():
    result=model.generate(input_ids=ids,attention_mask=torch.ones_like(ids),do_sample=False,max_new_tokens=1,return_dict_in_generate=True,output_scores=True,pad_token_id=tokenizer.eos_token_id)
    scores=result.scores[0].cpu()
values,order=torch.sort(scores[0],descending=True,stable=True)
base=torch.softmax(scores[0].double(),-1)
delta=max(abs(float(base[x['token_id']])-x['probability']) for x in trace['steps'][0]['top10'])
print('BASELINE_DELTA',delta, 'TOP', int(order[0]), float(base[order[0]]), flush=True)
assert delta<2e-5
assert all(round(100*float(base[x['token_id']]),2)==round(100*x['probability'],2) for x in trace['steps'][0]['top10'][:5])
data={'model':trace['model'],'revision':rev,'step':1,'vocab_size':len(values),'sorted_logits':values.tolist(),'sorted_token_ids':order.tolist(),'top_labels':[tokenizer.decode([int(i)],skip_special_tokens=False,clean_up_tokenization_spaces=False) for i in order[:5]]}
(out/'distribution.json').write_text(json.dumps(data,ensure_ascii=False,separators=(',',':'))+'\n')
web={k:v for k,v in data.items() if k!='sorted_token_ids'}
(deck/'src/decoding-data.js').write_text('window.MBA_DECODING_DATA = '+json.dumps(web,ensure_ascii=False,separators=(',',':'))+';\n')
settings=[(1,0,1),(.5,0,1),(1.5,0,1),(1,3,1),(1,0,.5),(1,3,.5),(.2,0,.05),(2,0,1),(2,100,.95),(1,1,1),(.7,20,.8)]
tests=[]
for t,k,p in settings:
    x=TemperatureLogitsWarper(float(t))(ids,scores.double())
    if k: x=TopKLogitsWarper(k)(ids,x)
    if p<1: x=TopPLogitsWarper(float(p))(ids,x)
    prob=torch.softmax(x[0],-1)[order]
    tests.append({'temperature':t,'top_k':k,'top_p':p,'retained':int(torch.isfinite(x).sum()),'top5':prob[:5].tolist(),'other':float(prob[5:].sum())})
(out/'reference-cases.json').write_text(json.dumps(tests,indent=2)+'\n')
record={'created_at':datetime.now(timezone.utc).isoformat(),'model':trace['model'],'revision':rev,'transformers':transformers.__version__,'torch':torch.__version__,'device':'CPU','dtype':'float32 model inference; float64 reference transformations','baseline_max_probability_delta_vs_original_trace':delta,'scores_sha256':hashlib.sha256((out/'distribution.json').read_bytes()).hexdigest(),'order':'temperature -> top-k -> top-p -> normalize -> categorical sampling','method':'Recomputed first input only. Full 49152-dimensional logits. Reference outputs use installed Transformers logits warpers. No continuation generated for altered parameters.','official_references':['https://huggingface.co/docs/transformers/v4.57.1/en/internal/generation_utils#transformers.TemperatureLogitsWarper','https://huggingface.co/docs/transformers/v4.57.1/en/internal/generation_utils#transformers.TopKLogitsWarper','https://huggingface.co/docs/transformers/v4.57.1/en/internal/generation_utils#transformers.TopPLogitsWarper']}
(out/'provenance.json').write_text(json.dumps(record,ensure_ascii=False,indent=2)+'\n')
print(json.dumps({'vocab_size':len(values),'baseline_max_delta':delta,'reference_cases':len(tests)}))
