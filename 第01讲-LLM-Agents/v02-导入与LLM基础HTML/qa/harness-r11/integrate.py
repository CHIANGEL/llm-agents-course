from pathlib import Path
import json,re
r=Path(__file__).resolve().parents[2]
p=r/'qa/build-data.cjs';s=p.read_text()
s=s.replace("const protocolsR10=read('src/protocols-r10.json');","const protocolsR10=read('src/protocols-r10.json');\nconst harnessR11=read('src/harness-r11.json');\nconst harnessSeconds=harnessR11.pages.reduce((sum,p)=>sum+p.seconds,0);\nObject.assign(authorMaterials,harnessR11.materials);Object.assign(addSources,harnessR11.sources);")
s=s.replace("p.page===105?[...protocolsR10.pages,p]:p.page===108?[]:[p]","p.page===105?[...protocolsR10.pages,...harnessR11.pages]:p.page>=106&&p.page<=125?[]:[p]")
s=s.replace('+15-140; // agenda','+15-140-1360+harnessSeconds; // agenda')
s=s.replace('plan.length!==177','plan.length!==175').replace('sequence must be 1–177','sequence must be 1–175')
s=s.replace("status:'Skills之后新增独立Protocols：交互对象与范围、MCP、A2A；16页正文与1页目录；原Harness中MCP页移入新章'","status:'Harness r11：总体运行、上下文、沙盒与权限、Hooks、子智能体、进度与恢复；18页正文与1页目录，全部整页显示'")
s=s.replace("revision:'2026-10-20-Protocols-r10'","revision:'2026-10-20-Harness-r11',harness_review_record:'qa/harness-r11/问题与修订记录.md'")
s=s.replace("review_record:'qa/protocols-r10/问题与修订记录.md',llm_review_record","review_record:'qa/harness-r11/问题与修订记录.md',llm_review_record")
s=s.replace("verification:{browser_checks:'qa/protocols-r10/controls.json',visual_review:'qa/protocols-r10/问题与修订记录.md',scope:'Protocols131–147、目录及130/148–152衔接；另查3/170/175/176/177；非全讲重新审阅'}","verification:{browser_checks:'qa/harness-r11/controls.json',visual_review:'qa/harness-r11/问题与修订记录.md',scope:'Harness148–166与147/167衔接；完整顺播本章，非全讲重新审阅'}")
p.write_text(s)
p=r/'src/navigation.json';d=json.loads(p.read_text());h=next(c for g in d['groups'] for c in g['children'] if c['id']=='3.5');h['from']=8501;h['to']=8518
next(a for a in d['agendas'] if a['authoring_page']==9010)['insert_before']=8501
p.write_text(json.dumps(d,ensure_ascii=False,indent=2)+'\n')
p=r/'src/playback-policy.json';d=json.loads(p.read_text());d['pages']={};d['description']='所有页面进入即完整显示；概率分布、消息与材料对照仍使用页内控件，由教师操作。';p.write_text(json.dumps(d,ensure_ascii=False,indent=2)+'\n')
p=r/'index.html';s=p.read_text();s=s.replace('</head>','<link rel="stylesheet" href="src/harness-r11.css"></head>');s=re.sub(r'<script src="src/agents-harness.js[^\"]*"></script>','<script src="src/harness-r11.js"></script>',s);p.write_text(s)
