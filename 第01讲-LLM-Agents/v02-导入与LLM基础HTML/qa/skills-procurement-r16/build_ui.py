from pathlib import Path
import json, re, shlex

R=Path(__file__).resolve().parents[2]
B=R/"sources/skills-r16"; W=B/"case"; P=W/".agents/skills/procurement-review"
old=json.loads((R/"src/skills-r9-data.js").read_text().split("=",1)[1].strip().rstrip(";"))
ops={r["id"]:r for r in json.loads((B/"execution/operations.json").read_text())}
files=[]
purposes=[
 "名称与用途帮助匹配任务；正文给出评审分支、生成命令与检查入口。",
 "正式部署的评审顺序；继续指向费用口径文件。",
 "试点采购的方法。本次正式部署不读取这个分支。",
 "费用项目与比较规则；区分预算上限、报价和实际支出。",
 "生成后读取：核对采购条件、材料依据和最终产物。",
 "客户端展示名称、简介与默认请求。",
 "一页评审的版式与四部分结构，由生成脚本读取。",
 "读取本次初稿和模板，写出HTML文件。",
 "比对当前条件、初稿字段及生成文件的一致性。"
]
manifest=json.loads((B/"package-manifest.json").read_text())
for m,purpose in zip(manifest,purposes):
 files.append(dict(path=m["path"],text=(P/m["path"]).read_text(),purpose=purpose))

file_order=["SKILL.md","references/rollout-review.md","references/pilot-review.md","references/cost-scope.md","references/quality-checklist.md","scripts/render_review.py","scripts/check_review.py","assets/review-template.html","agents/openai.yaml"]
files.sort(key=lambda f:file_order.index(f["path"]))
items={};order=[]
def item(key,label,origin,text,excerpt=None,caption="",raw=None):
 items[key]=dict(label=label,origin=origin,text=text,excerpt=excerpt or text,caption=caption)
 if raw:items[key]["raw"]=raw
 order.append(key)
def message(key,label,text,role="assistant",**kw):
 item(key,label,{"assistant":"模型生成","user":"用户输入","developer":"客户端提供"}[role],text,raw={"role":role,"content":text},**kw)
def pair(key,op,label,caption,excerpt=None):
 r=ops[op]; cmd=shlex.join(r["argv"])
 call="call_"+key;result="result_"+key
 item(call,"模型："+label,"模型生成",cmd,
      excerpt=cmd if key!="prepare" else "写入 review-input.json\n\n"+(W/"review-input.json").read_text(),
      caption=caption,raw={"type":"function_call","name":"exec_command","call_id":call,"arguments":json.dumps({"cmd":cmd},ensure_ascii=False)})
 item(result,"工具："+{"skill":"返回技能正文","reference":"返回评审方法","cost":"返回费用口径","security":"返回账户与数据要求","prepare":"返回保存结果","create":"返回生成结果","checklist":"返回检查清单","output":"返回评审文件","validate":"返回检查结果"}[key],
      "工具返回",r["stdout"],excerpt=excerpt,caption=caption,
      raw={"type":"function_call_output","call_id":call,"output":r["stdout"]})

message("memory","当前条件：沿用Memory案例","300人正式部署，预算上限30万元，使用期限一年。\n金额使用人民币，先给结论。\n账户与数据要求保存在 security-requirements.md。\n本次条件另存为 task-conditions.json，用于核对初稿。","developer",caption="记忆提供本次采购条件和已知要求；后面的Skill提供评审方法。")
message("catalog","Skill目录：名称、用途、路径","名称：procurement-review\n用途：起草或更新软件采购评审要点；核对采购条件、费用范围、交付与待确认事项。\n入口：.agents/skills/procurement-review/SKILL.md","developer",caption="目录只提供用途与入口；文件正文还没有读入。")
message("user","用户：起草一页采购评审要点",(W/"request.txt").read_text(),"user",caption="当前任务延续前面的采购条件。")
message("intro","模型：选用采购评审Skill","我会使用采购评审Skill，按300人、一年、预算上限30万元起草评审要点，先读取方法和所需材料。",caption="模型先选中适用的Skill，再通过工具读取入口文件。")
pair("skill","read-skill","读取SKILL.md","第一级读取：取得正式部署分支、生成命令与检查入口。",
     "## 选择评审方法\n- 正式部署：读取 references/rollout-review.md，继续按其中的链接核对费用范围。\n- 小范围试点：读取 references/pilot-review.md。\n\n## 生成一页评审要点\n按照参考文件组织 review-input.json。\n运行 scripts/render_review.py。\n\n## 检查后交付\n生成后读取 references/quality-checklist.md；读回文件，再运行 scripts/check_review.py。")
pair("reference","read-rollout","读取正式部署方法","第二级读取：SKILL.md → rollout-review.md；这里又给出更细的文件入口。")
pair("cost","read-cost","继续读取费用口径","第三级读取：正式部署方法 → 费用口径。")
pair("security","read-security","读取项目已有要求","项目文件提供事实与约束；Skill参考提供可复用的方法。")
pair("prepare","write-input","写入本次评审初稿","具体人数、金额与期限写在任务初稿中，采购评审Skill本身不固定这些条件。")
pair("create","render","运行生成脚本","脚本读取review-input.json与HTML模板，生成一页评审文件。")
pair("checklist","read-checklist","读取交付检查清单","文件生成之后，再展开SKILL.md给出的检查入口。")
review=json.loads((W/"review-input.json").read_text())
plain="采购评审要点\n\n一、采购条件\n300人正式部署；使用期限一年；预算上限30万元。\n\n"
for title,k in [("二、费用范围","cost_scope"),("三、交付与管理","requirements"),("四、待确认事项","pending")]:
 plain+=title+"\n"+"\n".join("• "+i["text"] for i in review[k])+"\n\n"
pair("output","read-output","读回生成文件","把实际文件与检查清单逐项对照；预算、报价与待确认事项需要分别核对。",plain.strip())
pair("validate","check","运行一致性检查","脚本检查数值、字段和生成结果；模型继续核对材料依据及内容完整性。")
message("answer","模型：交付评审要点","已起草 output/procurement-review.html。\n\n按300人正式部署、使用期限一年、预算上限30万元组织了四部分：采购条件、费用范围、交付与管理、待确认事项。\n\n还需确认供应商完整报价、正式上线日期和验收标准。",caption="回答与文件中的内容一致，保留仍需确认的事项。")

items["result_reference"]["excerpt"]="""## 按四部分起草
1. 采购条件：人员范围、期限、预算上限。
2. 费用范围：先读 [费用口径](cost-scope.md)。
3. 交付与管理：企业账号、权限、日志和数据处理。
4. 待确认事项：报价、上线日期、验收标准。

## 写入文件
将以上内容写入 review-input.json。"""
items["result_cost"]["excerpt"]="""预算上限是支出上限，不是报价或已发生成本。

报价中需要拆开的项目：
• 软件订阅：人数、周期、版本和税费。
• 配置与迁移：一次性费用与包含工作。
• 培训与支持：服务内容、次数与期限。

统一人数和期限，再比较同一范围内的合计费用。
没有报价时，列明应核对项目。"""
items["result_checklist"]["excerpt"]="""## 交付前检查
• 人数、期限、预算上限与当前任务一致。
• 历史试点条件没有替代正式部署条件。
• 账号、权限和数据要求有材料依据。
• 未确认的报价、上线日期与验收标准单列。
• 打开HTML检查四部分内容与版式。
• 运行 check_review.py 核对字段和产物。"""
items["call_prepare"]["excerpt"]="""写入 review-input.json

采购阶段：正式部署
人数：300；期限：12个月；预算上限：300000元
费用范围：订阅、配置与迁移、培训与支持
交付与管理：团队权限、账号、日志与数据处理
待确认：供应商报价、上线日期、验收标准

每条要点保留材料依据。"""
groups={
 "initial":["memory","catalog","user"],"skill":["intro","call_skill","result_skill"],
 "reference":["call_reference","result_reference"],"cost":["call_cost","result_cost"],
 "prepare":["call_security","result_security","call_prepare","result_prepare"],
 "render":["call_create","result_create"],"verify":["call_checklist","result_checklist","call_output","result_output"],
 "validate":["call_validate","result_validate"],"answer":["answer"]}
stages={"initial":"任务条件与Skill目录进入输入。","skill":"目录 → SKILL.md","reference":"SKILL.md → 正式部署方法","cost":"正式部署方法 → 费用口径","prepare":"项目事实 + Skill方法 → 本次初稿","render":"脚本读取模板，写出文件。","verify":"另读检查清单，再读回实际产物。","validate":"按当前任务检查初稿与产物。","answer":"依据生成文件与检查结果回答。"}
artifact=(W/"output/procurement-review.html").read_text().split("<article>")[1].split("</article>")[0]
artifact=re.sub(r"<h1>.*?</h1><div class=\"subtitle\">.*?</div>","",artifact)
artifact=re.sub(r"<footer>.*?</footer>","",artifact)
data=dict(artifact=artifact,files=files,items=items,order=order,groups=groups,end={k:v[-1] for k,v in groups.items()},stages=stages,creator=old["creator"],style=old["style"],command=items["call_create"]["text"])
(R/"src/skills-r9-data.js").write_text("window.SKILLS_R9 = "+json.dumps(data,ensure_ascii=False)+";\n")
(B/"message-sequence.json").write_text(json.dumps(data,ensure_ascii=False,indent=2)+"\n")

# Chapter metadata; stable authoring IDs keep all later chapter jumps aligned.
d=json.loads((R/"src/skills-r9.json").read_text())
d["pages"]=[p for p in d["pages"] if p["page"] not in [8960,8961,8962,8963]]
updates={
7003:("采购评审Skill：把条件整理成一页评审要点","沿用Memory案例：300人、一年、预算上限30万元。先认识完整采购评审包，再观察模型怎样按任务读取和使用。"),
7004:("打开采购评审包：9个文件各有什么用？","从文件夹层级进入具体文件。查看入口、四份参考、两个脚本、HTML模板与客户端配置。"),
7005:("SKILL.md：何时使用，怎样完成","名称与用途帮助模型选中Skill；正文提供正式部署和试点分支，以及生成和检查的入口。"),
7006:("参考、脚本与模板怎样配合？","模型读参考文件组织内容；工具运行脚本，脚本读取模板并写文件。方法、程序与版式各有作用。"),
7007:("完整技能包：入口、方法与资源","回顾采购评审包，说明文件包的存在与模型已读取其内容是两回事。"),
7008:("一次Skill调用：从采购条件到评审文件","完整过程：确认当前任务，读技能正文，读正式部署方法，再读费用口径，组织初稿，生成文件，读取清单并核对产物。"),
7009:("当前输入：采购条件、用户任务与Skill目录","Memory提供当前采购条件；Skill目录提供方法的名称、用途和路径。模型还没有读取包内正文。"),
7010:("第一次读取：从目录进入SKILL.md","先选用Skill，再读取正文。当前任务选择正式部署分支，得到rollout-review.md的入口。"),
7011:("第二次读取：找到正式部署的评审方法","读取rollout-review.md，取得四部分结构；费用范围一节继续链接cost-scope.md。"),
7012:("生成文件：脚本读取初稿与模板","模型生成工具调用；生成脚本读取本次初稿与固定HTML模板，写出采购评审要点。"),
7013:("生成之后：另读检查清单，再读回产物","从SKILL.md进入quality-checklist.md，取得检查标准；接着读回实际生成的HTML文件。"),
7014:("一页采购评审要点：内容与当前任务一致","展示实际脚本生成的文件：300人、一年、预算上限30万元，以及费用范围、交付管理和待确认事项。"),
7015:("交付：说明文件内容与待确认事项","最终回复依据已生成的文件与检查结果，交代产物位置，保留供应商报价、上线日期和验收标准等待确认事项。"),
7016:("渐进式披露：沿任务逐层读取，用到时再展开","目录→SKILL.md→正式部署方法→费用口径；生成后另读检查清单。模板由程序读取，试点分支本次没有读取。"),
7022:("Skill迁移：方法相同，运行条件可能不同","场景、模型和Harness变化后重新验证。能在本机生成采购评审HTML，不代表别的应用具备相同路径、工具和Python环境。")
}
for p in d["pages"]:
 if p["renderer"] in updates:
  title,talk=updates[p["renderer"]];p.update(title=title,talk=talk,on_slide=[title,talk],sources=[{"id":"SKILLS_R16","locator":"采购评审技能包与执行记录"}])
  d["materials"][str(p["page"])]=talk
new=[
 (8960,7030,8903,"先看文件夹：采购评审包怎样组织？","先展示采购评审包的文件夹层级：SKILL.md、references、scripts、assets与agents；再打开单个文件。"),
 (8961,7031,8911,"第三次读取：评审方法继续指向费用口径","正式部署方法中的费用范围一节指向cost-scope.md。这里补充订阅、配置迁移、培训支持及比较规则。"),
 (8962,7032,8911,"组织初稿：把项目事实放进评审结构","读取前面项目的账户与数据要求；将300人、一年、30万元及对应评审要点写入review-input.json。"),
 (8963,7033,8913,"运行检查：条件、初稿与产物是否一致？","脚本逐项比对人数、期限、预算上限，并核对评审字段和生成文件；材料依据和内容完整性仍按清单检查。")
]
for aid,rend,before,title,talk in new:
 p=dict(page=aid,renderer=rend,navigation="3.3",section="Skills·技能包" if aid==8960 else "Skills·一次调用",type="explanation",title=title,seconds=90,show_sources=False,on_slide=[title,talk],talk=talk,sources=[{"id":"SKILLS_R16","locator":"采购评审技能包与执行记录"}])
 pos=next(i for i,x in enumerate(d["pages"]) if x["page"]==before);d["pages"].insert(pos,p);d["materials"][str(aid)]=talk
for p in d["pages"]:
 if 7003<=p["renderer"]<=7016 or p["renderer"] in [7030,7031,7032,7033]:
  d["materials"][str(p["page"])]+="\n\n当前任务\n"+items["user"]["text"]+"\n\n"
  view={7009:"initial",7010:"skill",7011:"reference",7031:"cost",7032:"prepare",7012:"render",7013:"verify",7033:"validate",7015:"answer"}.get(p["renderer"])
  if view:
   d["materials"][str(p["page"])]+="\n\n".join("【"+items[k]["label"]+"】\n"+items[k]["text"] for k in groups[view])
  else:d["materials"][str(p["page"])]+="\n\n".join("【"+f["path"]+"】\n"+f["text"] for f in files)
  d["files"][str(p["page"])]=[{"label":"采购评审文件","href":"sources/skills-r16/case/output/procurement-review.html"},{"label":"采购评审Skill完整文件包","href":"sources/skills-r16/procurement-review-skill.zip"}]
d["sources"]["SKILLS_R16"]={"title":"采购评审Skill：多级渐进式披露、完整文件包与本地执行记录","path":str(B/"来源与执行记录.md")}
(R/"src/skills-r9.json").write_text(json.dumps(d,ensure_ascii=False,indent=2)+"\n")
print("Skills pages:",len(d["pages"]))
