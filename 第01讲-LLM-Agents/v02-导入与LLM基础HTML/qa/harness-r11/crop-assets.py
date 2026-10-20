from pathlib import Path
from PIL import Image
import json, hashlib
root=Path(__file__).resolve().parents[2]
items={
'components':(155,(50,490,1640,700)),
'runloop':(156,(55,375,1640,915)),
'context':(160,(170,330,1500,842)),
'compaction':(161,(90,380,1600,840)),
'clearing':(162,(40,400,1630,795)),
'sandbox':(164,(215,375,1495,855)),
'confirmation':(166,(65,385,1625,795)),
'hooks':(176,(105,325,1570,810)),
'formatter':(177,(45,410,1625,725)),
'hook-timing':(178,(90,385,1610,735)),
'subagents':(180,(30,380,1645,885)),
'subagent-context':(182,(40,385,1625,870)),
'dependency':(183,(90,365,1605,815)),
'delegation':(184,(45,365,1635,870)),
'progress':(171,(35,355,1645,835)),
'resume':(173,(65,425,1635,745)),
'externalization':(185,(100,450,1610,785))}
assets=root/'assets/harness-r11';assets.mkdir(exist_ok=True)
records=[]
for name,(p,b) in items.items():
    im=Image.open(root/f'qa/harness-r11/pdf/high-{p}.jpg')
    scale=im.width/1672
    box=tuple(round(v*scale) for v in b)
    result=im.crop(box)
    out=assets/(name+'.png');result.save(out,optimize=True)
    records.append({'asset':str(out.relative_to(root)),'pdf_page':p,'reference_1672px_crop':b,'pixel_size':result.size,'sha256':hashlib.sha256(out.read_bytes()).hexdigest()})
(root/'sources/harness-r11/source-map.json').write_text(json.dumps({'source_pdf':'第03讲-Agent Externalization与Internalization.pdf','page_numbering':'PDF physical pages; editable PPT slide = PDF page - 14','render_width':2600,'method':'PDF rendering then rectangular figure crops; native HTML for main text','assets':records},ensure_ascii=False,indent=2)+'\n')
print(len(records),'figures')
