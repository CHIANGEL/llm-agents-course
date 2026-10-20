"""Apply r25's cumulative traces and shorter three-level Skill example."""
from pathlib import Path
import json, shutil, subprocess, zipfile, hashlib

ROOT = Path(__file__).resolve().parents[2]
def read(f): return json.loads((ROOT/f).read_text())
def write(f,v): (ROOT/f).write_text(json.dumps(v,ensure_ascii=False,indent=2)+'\n')
def jsdata(f):
    s=(ROOT/f).read_text()
    return json.loads(s[s.index('=')+1:].strip().rstrip(';'))
def replace(f,old,new):
    p=ROOT/f;s=p.read_text()
    assert old in s, (f,old[:90])
    p.write_text(s.replace(old,new))

BASE=ROOT/'sources/memory-skills-r25'
WORK=BASE/'case'
PKG=WORK/'.agents/skills/procurement-review'
BASE.mkdir(parents=True,exist_ok=True)
shutil.copytree(ROOT/'sources/skills-r16/case/.agents/skills/procurement-review',PKG,dirs_exist_ok=True)
m=jsdata('src/memory-r8-data.js')
d=jsdata('src/skills-r9-data.js')

# Keep the source documents complete, including scope and conditions.
for name,key in [('document-a.md','budget'),('document-b.md','security')]:
    (BASE/name).write_text(m['files'][key]['text'])

skill="""---
name: procurement-review
description: 起草或更新软件采购评审要点；适用于试点采购与正式部署，需要核对采购条件、费用范围、交付和待确认事项时使用。
---
# 采购评审

## 确认本次任务
确认采购阶段、人数、使用期限和预算上限。
当前条件与历史记录不一致时，采用用户对本次任务的最新说明。
缺失条件列入待确认事项，不自行补出报价、审批结果或验收结论。

## 选择评审方法
- 正式部署：读取 references/rollout-review.md，按其中的链接核对费用范围。
- 小范围试点：读取 references/pilot-review.md。
只读取本次任务需要的分支。

## 起草并保存
按参考文件的结构起草评审要点，写入 review-input.json。
写入成功后，向用户说明文件位置、主要内容和待确认事项。

## 需要HTML版式时
用 scripts/render_review.py 将 review-input.json 填入 assets/review-template.html：
python3 .agents/skills/procurement-review/scripts/render_review.py --input review-input.json --output output/procurement-review.html
再读取 references/quality-checklist.md，检查并交付HTML文件。
"""
rollout="""# 正式部署：采购评审要点

## 先固定本次范围
列明正式部署的人数、使用期限和预算上限。
历史试点的金额、期限和人数单列为背景，不作为本次采购条件。

## 按四部分起草
1. 采购条件：人员范围、期限、预算上限。
2. 费用范围：先读 [费用口径](cost-scope.md)，再列出需要供应商报清的项目。
3. 交付与管理：依据当前项目要求，核对企业账号、权限、日志和数据处理。
4. 待确认事项：尚未获得的报价、上线日期、验收标准。

## 写入文件
将以上内容写入 review-input.json。
采购阶段、人数、期限与预算分别写入 conditions 下的 phase、people、term_months、budget_cap_cny。
其余三部分分别使用 cost_scope、requirements、pending 数组。
每个要点包含 text（内容）和 source（依据或待确认原因）。
写入成功后告知用户文件位置、主要内容及待确认事项。
"""
(PKG/'SKILL.md').write_text(skill)
(PKG/'references/rollout-review.md').write_text(rollout)
pilot=(PKG/'references/pilot-review.md').read_text().replace('生成文件前使用 cost-scope.md 核对费用项目，再按 SKILL.md 检查交付。','读取 cost-scope.md 核对费用项目，按 SKILL.md 起草并保存；需要HTML版式时再调用生成脚本。')
(PKG/'references/pilot-review.md').write_text(pilot)
for f in d['files']: f['text']=(PKG/f['path']).read_text()
d['files'][0]['purpose']='技能包的说明书目录：适用任务、方法分支、保存步骤与资源入口。'
d['files'][1]['purpose']='正式部署的评审结构；费用范围继续指向cost-scope.md。'

# Reuse the local, archived Codex instruction structure, adapting only the skill catalog.
original=read('sources/skills-r9/original-case/requests/initial.json')
texts=[c.get('text','') for i in original['input'] for c in i.get('content',[]) if isinstance(c,dict)]
instructions=next(t for t in texts if '<skills_instructions>' in t)
start=instructions.index('### Available skills')
end=instructions.index('### How to use skills')
instructions=instructions[:start]+"""### Available skills
- procurement-review: 起草或更新软件采购评审要点；适用于试点采购与正式部署，需要核对采购条件、费用范围、交付和待确认事项时使用。 (file: r0/procurement-review/SKILL.md)
"""+instructions[end:]
instructions=instructions.replace('/workspace/course/.agents/skills','/workspace/procurement/.agents/skills')
def item(label,origin,text,role='developer',excerpt=None,caption=''):
    return dict(label=label,origin=origin,text=text,excerpt=excerpt or text,caption=caption,raw={'role':role,'content':text})
items={}
items['base']=item('基础指令','客户端准备',m['items']['base']['text'],excerpt=m['items']['base']['text'],caption='与Memory案例相同的基础指令，先进入模型输入。')
project=m['items']['project']['text']+'\n\n# 项目账户与数据要求\n'+m['files']['security']['text']
items['project']=item('项目说明与操作范围','客户端准备',project,caption='项目说明提供工作范围、账户与数据要求。')
items['catalog']=item('Skills使用说明与目录','客户端提供',instructions,excerpt="""## Skills
Skill是保存在SKILL.md中的一组本地指令。

可用技能
名称：procurement-review
用途：起草或更新软件采购评审要点，核对条件、费用、交付与待确认事项。
入口：/workspace/procurement/.agents/skills/procurement-review/SKILL.md

使用方式
1. 根据用户点名或任务与用途的匹配，选择Skill。
2. 先完整读取SKILL.md，再按其中的指引处理任务。
3. 参考文件的相对路径，以SKILL.md所在目录为起点。
4. 继续读取本次需要的参考；有适用脚本、模板时，按指导使用。
5. 按需展开文件，不把无关资源全部加载到输入中。""",caption='目录和使用规则已进入输入；技能包正文仍保存在文件中。')
items['user']=d['items']['user']

operations=[]
def read_pair(call_id,result_id,path,caption):
    cmd='cat .agents/skills/procurement-review/'+path
    result=subprocess.run(cmd,shell=True,cwd=WORK,capture_output=True,text=True,check=True)
    operations.append(dict(operation='read',command=cmd,exit_code=result.returncode,stdout=result.stdout))
    call=dict(d['items'][call_id]); call.update(origin='模型生成 工具调用',caption=caption)
    ret=dict(d['items'][result_id]);ret.update(text=result.stdout,excerpt=result.stdout,caption=caption)
    ret['raw']={'type':'function_call_output','call_id':call_id,'output':result.stdout}
    items[call_id]=call;items[result_id]=ret
read_pair('call_skill','result_skill','SKILL.md','第一层：从目录进入SKILL.md，找到正式部署分支。')
read_pair('call_reference','result_reference','references/rollout-review.md','第二层：取得评审结构，费用范围继续指向cost-scope.md。')
read_pair('call_cost','result_cost','references/cost-scope.md','第三层：读到具体费用项目与比较规则。')

draft=read('sources/skills-r16/case/review-input.json')
for row in draft['requirements']:
    row['source']=row['source'].replace('security-requirements.md：','当前输入中的项目账户与数据要求：')
draft_text=json.dumps(draft,ensure_ascii=False,indent=2)+'\n'
cmd="python3 - <<'PY'\nfrom pathlib import Path\nPath('review-input.json').write_text("+repr(draft_text)+", encoding='utf-8')\nprint('已写入：review-input.json')\nPY"
result=subprocess.run(cmd,shell=True,cwd=WORK,capture_output=True,text=True,check=True)
assert json.loads((WORK/'review-input.json').read_text())==draft
operations.append(dict(operation='write',command=cmd,exit_code=result.returncode,stdout=result.stdout,sha256=hashlib.sha256((WORK/'review-input.json').read_bytes()).hexdigest()))
items['call_prepare']=dict(d['items']['call_prepare'])
items['call_prepare'].update(label='模型：写入review-input.json',origin='模型生成 工具调用',text=cmd,caption='模型生成写文件的工具调用；具体内容来自当前条件和三层参考。')
items['call_prepare']['raw']={'type':'function_call','name':'exec_command','call_id':'call_prepare','arguments':json.dumps({'cmd':cmd},ensure_ascii=False)}
items['result_prepare']=dict(d['items']['result_prepare'])
items['result_prepare'].update(text=result.stdout,excerpt=result.stdout,caption='工具已将本次评审初稿保存到文件。')
items['result_prepare']['raw']={'type':'function_call_output','call_id':'call_prepare','output':result.stdout}
answer='已写好 review-input.json。\n\n评审要点按300人正式部署、使用期限一年、预算上限30万元组织，包含采购条件、费用范围、交付与管理、待确认事项四部分。\n\n供应商完整报价、正式上线日期和验收标准仍需确认。'
items['answer']=item('模型：告知用户已写好','模型生成 回答',answer,'assistant',caption='依据工具的保存结果，向用户说明文件位置与主要内容。')
d['items']=items
d['order']=list(items)
d['groups']={'initial':['base','project','catalog','user'],'skill':['call_skill','result_skill'],'reference':['call_reference','result_reference'],'cost':['call_cost','result_cost'],'prepare':['call_prepare','result_prepare'],'answer':['answer']}
d['end']={k:v[-1] for k,v in d['groups'].items()}
d['stages']={'initial':'客户端组装当前输入。','skill':'第一层：目录 → SKILL.md','reference':'第二层：SKILL.md → 正式部署方法','cost':'第三层：正式部署方法 → 费用口径','prepare':'模型生成工具调用，写入本次评审初稿。','answer':'工具保存成功后，模型回答用户。'}
d.pop('artifact',None);d['command']=cmd
(ROOT/'src/skills-r9-data.js').write_text('window.SKILLS_R9 = '+json.dumps(d,ensure_ascii=False)+';\n')
write('sources/memory-skills-r25/message-sequence.json',d)
write('sources/memory-skills-r25/execution.json',operations)
with zipfile.ZipFile(BASE/'procurement-review-skill.zip','w',zipfile.ZIP_DEFLATED) as z:
    for p in sorted(PKG.rglob('*')):
        if p.is_file() and '__pycache__' not in p.parts:z.write(p,Path('procurement-review')/p.relative_to(PKG))

# Labels and stage cutoffs.
n=read('src/navigation.json')
labels={'工具调用':'工具调用 Tool Use','Memory':'记忆 Memory','Skills':'技能 Skills','Protocols':'协议 Protocols'}
for g in n['groups']:
    for c in g['children']: c['title']=labels.get(c['title'],c['title'])
for a in n['agendas']:
    for k in ['previous','next']: a[k]=labels.get(a[k],a[k])
write('src/navigation.json',n)
replace('src/memory-r8.js','const ids=D.views.followup;','const ids=D.views[view];')
replace('src/skills-r9.js','${D.order.map(k=>','${cumulative(view).map(k=>')

# The document page precedes the existing library comparison in the same insertion pass.
r=read('src/memory-review-r14.json')
doc={'page':25001,'renderer':25001,'navigation':'3.3','section':'Memory','type':'explanation','title':'先看材料：两份文档分别记录了什么？','seconds':90,'show_sources':False,'sources':[{'id':'MEMORY_REVIEW_R14','locator':'已有采购案例的完整预算与安全要求文件'}],'on_slide':['文档A：企业知识库试点预算','文档B：企业知识库安全与账户要求',m['files']['budget']['text'],m['files']['security']['text']],'talk':'先完整阅读两份材料。A说明试点的范围和预算边界；B说明同一项目的账户、权限和数据要求。下一页再看这些信息怎样保存为记忆条目或关系图。'}
r['pages'].insert(0,doc);r['insertions'].insert(0,{'page':25001,'before':7404})
r['materials']['25001']='文档A\n'+m['files']['budget']['text']+'\n文档B\n'+m['files']['security']['text']
for k in ['6203','6204']:
    for row in r['roadmaps'][k]['rows']:
        if row[0]=='一次调用全过程':row[1]='三层读取 → 写入初稿 → 回答用户'
r['roadmaps']['6204']['done']='逐层读取方法，写入评审初稿并回答用户'
write('src/memory-review-r14.json',r)

s=read('src/skills-r9.json')
removed={8911,8912,8963,8913}
s['pages']=[p for p in s['pages'] if p['page'] not in removed]
updates={
89:('Skills：把“怎样做”保存成可复用的方法','Skills把程序性记忆中的“怎样做”整理成按任务调用的技能包。先认识完整包，再看三层读取、写入初稿与回答，最后讨论合成、评估与维护。'),
8960:('先看文件夹：采购评审包怎样组织？','Skill Package像一个软件包。SKILL.md是最先阅读的说明书目录；references保存具体信息和方法，scripts保存可复用、可调用的代码，assets保存模板、图片等素材。采购评审包分别对应评审方法与费用口径、生成与检查脚本、一页HTML模板。'),
8904:('SKILL.md：何时使用，怎样完成','文件开头给出名称与用途，正文给出任务条件、评审分支和保存步骤。正式部署沿rollout-review.md继续读取费用口径，写入review-input.json后告知用户。需要HTML版式时，使用脚本与模板。'),
8906:('完整技能包：入口、方法与资源','目录帮助选择，SKILL.md给出步骤与资源入口，references保存具体做法，scripts与assets支持固定操作和版式。'),
8907:('一次Skill调用：三层读取，再写入初稿','从目录选择Skill。读SKILL.md，再读rollout-review.md，再读cost-scope.md；模型生成工具调用，将评审初稿写入review-input.json，工具返回成功后告知用户。'),
8908:('首次输入：基础指令、项目说明与Skills目录','与Memory的Codex CLI案例相同，客户端先组装基础指令、项目说明、Skills使用规则与目录，最后是用户的起草任务。技能包正文仍需通过工具读取。'),
8909:('第一次读取：从目录进入SKILL.md','模型生成工具调用，读取SKILL.md。工具返回技能正文，正式部署分支指向references/rollout-review.md。'),
8910:('第二次读取：找到正式部署的评审方法','沿SKILL.md读取正式部署方法，取得四部分评审结构。费用范围一节继续链接cost-scope.md。'),
8961:('第三次读取：评审方法继续指向费用口径','沿rollout-review.md中的链接读取cost-scope.md，取得订阅、配置、迁移、培训、支持等费用的核对与比较规则。'),
8962:('写入初稿：把评审要点保存到文件','根据当前条件和三层方法组织评审要点。模型生成写入review-input.json的工具调用，工具保存文件并返回结果。'),
8914:('回答用户：评审初稿已经写好','工具返回保存成功后，模型告知review-input.json的位置、四部分内容和待确认事项。'),
8915:('渐进式披露：三层读取，各自补充什么？','第一层SKILL.md选择工作分支；第二层rollout-review.md规定评审结构；第三层cost-scope.md补充具体费用规则。随后生成写文件的工具调用，保存初稿并回答用户。'),
8925:('Skills小结：组织方法、调用方法、检验方法','完整技能包保存入口、方法和资源；调用时按任务逐层读取，工具完成读写；自己的Skill需要用代表性任务评估并持续维护。')
}
stagepages={8908:'initial',8909:'skill',8910:'reference',8961:'cost',8962:'prepare',8914:'answer'}
for p in s['pages']:
    k=p['page']
    if k in updates:
        p['title'],body=updates[k];p['talk']=body;p['on_slide']=[p['title'],body];s['materials'][str(k)]=body
    if k in stagepages:
        stage=stagepages[k];ids=d['order'][:d['order'].index(d['end'][stage])+1]
        s['materials'][str(k)]+='\n\n'+'\n\n'.join('【'+items[i]['label']+'】\n'+items[i]['text'] for i in ids)
    elif k in [8903,8904,8905,8906]:
        s['materials'][str(k)]='\n\n'.join('【'+f['path']+'】\n'+f['text'] for f in d['files'])
for key in ['materials','files']:
    s[key]={k:v for k,v in s[key].items() if int(k) not in removed}
for k in s['files']:
    s['files'][k]=[{'label':'本次评审初稿 review-input.json','href':'sources/memory-skills-r25/case/review-input.json'},{'label':'采购评审Skill完整文件包','href':'sources/memory-skills-r25/procurement-review-skill.zip'}]
write('src/skills-r9.json',s)
print(json.dumps({'skills_pages':len(s['pages']),'trace_blocks':len(d['order']),'operations':len(operations),'new_document_page':25001},ensure_ascii=False))
