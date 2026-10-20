from pathlib import Path
import json,html
root=Path(__file__).resolve().parents[2]
P=json.loads((root/'sources/prompting-r2/prompts.json').read_text())
for d in P:
 out=[];prev=0
 for line in d['lines']:
  if prev and line['line']>prev+1:out.append('')
  out.append(line['text']);prev=line['line']
 d['prompt']='\n'.join(out)
(root/'sources/prompting-r2/prompts.json').write_text(json.dumps(P,ensure_ascii=False,indent=2)+'\n')
titles=['Prompting：先交代任务，再选择方法','四大要点：让模型知道你要什么','给Example：把想要的样子给模型看','让大模型帮你写Prompt','三个核心，接上四类策略','问清问题：先追问，再给建议','苏格拉底式提问：原始Prompt','学习：四种需要，四种方法','双层解释：从直觉到准确理解','反向拆解：从成品找到可复用的做法','反向拆解：原始Prompt','横纵分析：来路、差异与未来','横纵分析：原始Prompt的分析任务','横纵分析：证据要求与报告结构','事实核查：事实成立，推论就成立吗？','事实核查：原始Prompt','学习之后，开始寻找解法','专家会诊：让互补视角相互质疑','专家会诊：原始Prompt','第一性原理：从事实、目标和约束重推','跨领域借解：迁移机制，而非照搬做法','跨领域借解：原始Prompt','有了解法，再判断选哪一个','双向钢人：把两边的理由都说充分','双向钢人论证：原始Prompt','最小实验：用行动取得新的判断依据','用最小实验替代空想：原始Prompt','决策小结：条件比较与现实反馈','Prompting小结：任务清楚，方法合适','从Prompting到Agent：把要求接到操作']
times=[45,120,90,120,35,70,90,50,115,50,80,65,90,60,50,100,65,50,100,100,50,80,50,50,80,50,80,35,50,30]
assert sum(times)==2100
intro=[
'LLM根据输入继续生成。Prompting要把任务、材料和处理方式交代清楚。',
'Who you are / Who I am / Objective / Example，分别回答四个问题。',
'“清楚、专业、有逻辑”不如一个具体样例。给文件，也说明要参考什么。',
'先给任务初稿、背景和示例，让模型检查，再产出完整Prompt。',
'四大要点把任务说清；示例说明标准；模型可以继续改进这份指令。',
'嘴上问的问题，未必就是真正要解决的问题。先补上下文，再给建议。',
'每次只问一个问题，根据回答调整；信息够用就停止。',
'问题问清楚后，先辨认自己缺的是概念、做法、全貌，还是可靠依据。',
'类比听懂之后，还要讲清机制；用两层解释建立准确理解。',
'看到一个优秀成品，先问它解决了什么问题，再看为什么有效。',
'保留服务对象、结构、关键选择、完成标准与迁移范围。',
'纵向看它怎样走到今天；横向看它与其他对象有什么区别。',
'先把发展过程与当前差异放在一起，再判断可能的未来路径。',
'分析之后，结论要能追溯到资料，并按固定结构组织。',
'对事实找依据，对推论查逻辑，对价值判断辨认取舍。',
'先拆分说法、核查事实，再检查事实能否支持当前结论。',
'学习补足理解和依据；接下来从不同角度找到可行路径。',
'复杂问题常常需要不同专业视角；关键在相互质疑之后的综合。',
'同一模型按三种互补视角分别分析，再比较共同事实与不同假设。',
'当方案不断增加补丁，先分清基本事实与未经验证的惯例。',
'本领域的解法遇到瓶颈时，先抽象问题，再到其他领域寻找相似结构。',
'借用解决机制，同时检查迁移条件与失效条件。',
'专家会诊、第一性原理和跨领域借解帮助找到方案；决策要再比较和验证。',
'钢人论证：先把双方观点都表述成最有力的版本，再判断取舍。',
'充分比较两边之后，只追问最可能改变结论的一个问题。',
'有些不确定性需要现实反馈。先验证最可能改变决定的假设。',
'行动前写清投入、指标、继续与停止条件，行动后取得新信息。',
'双方理由都成立时，比较成立条件；缺少决定性信息时，设计最小验证。',
'先把任务交代清楚，再根据当前需要选择处理方法。',
'写清要求以后，下一步是组织查询、计算、文件操作及结果反馈。'
]
notes=['LLM根据当前输入继续生成。Prompting先把角色、背景、目标和参考样例交代清楚，再选择处理问题的方法。后面的四类策略依次回答：问题是什么、需要学什么、怎样找到解法、有了方案怎样选择。', 'Who you are说明模型承担的角色；Who I am提供使用者背景；Objective明确要完成的事；Example提供具体参照。目标和必要约束写清楚，具体做法可以根据任务调整。', '一个具体样例能把抽象要求变成可见标准。这页参考课件把聊天消息与连续输入左右对应，同时用颜色区分角色、边界和续写位置。给样例时，说清要沿用哪些特征。', '先给出任务初稿，写明目标模型、背景和参考示例。让模型检查缺失信息、歧义和冲突，必要时追问，最后给出可直接用于目标任务的完整Prompt。', '四大要点明确任务，Example说明标准，让模型写Prompt帮助完善指令。问题模糊时先澄清；缺少理解时先学习；需要方案时寻找解法；需要选择时比较和验证。', '苏格拉底式提问先补足上下文。模型每次只问一个问题，根据回答更新判断，再决定下一问。6问是上限；信息已经足够时停止追问。', '先区分事实、解释、价值判断和目标，再检查关键词、默认前提与证据。每个问题都应有可能改变结论。结束时形成一个准确、具体、可以行动的新问题，确认后再给建议。', '学习有四种不同需要：概念、做法、全貌、依据。双层解释帮助理解概念，反向拆解提炼做法，横纵分析建立系统认识，事实核查检验说法。', '生活化的例子帮助建立直觉，但记住类比还不等于理解机制。专业层补足术语、机制和适用边界，再把两层说法一一对应，找出容易混淆的地方。', '继续看前面的聊天模板页：它服务没有技术基础的学员，消息与输入文本左右对应，角色标记与续写位置突出关键关系。反向拆解把这些选择提炼成可复用的方法。', '先说成品解决什么问题，再分析服务对象、结构、关键选择和完成标准。最后区分可迁移规律与案例特有细节，把可复用规律变成操作清单。', '纵向看早期选择、重要转折与今天的能力，横向用统一维度比较其他对象。结合深度研究功能检索资料，分析过去怎样形成今天的差异，再判断未来路径及其前提。', '纵向分析解释发展过程，横向分析解释今天的差异。把两条轴合起来，判断过去形成的能力和约束怎样影响未来，以及各条路径的前提和预警信号。', '重要结论就近标注来源与日期，分开事实、推断与观点。遇到冲突信息时并列呈现。报告从核心结论进入时间线和横向比较，再展开分析、未来判断和待确认问题。', '事实、推论与价值判断需要分别处理。事实有可靠来源，并不自动意味着推论成立；还要检查假设、因果关系、其他解释和结论成立的条件。', '事实核查保留已证实、基本成立但需收窄、存在争议、证据不足、明显错误五种结果。之后继续检查推理链，说明哪些事实可信、哪些需要修正，以及结论可以相信到什么程度。', '学习补足了概念、做法、全貌和依据。接下来寻找解法：专家会诊补足视角，第一性原理回到基本条件，跨领域借解寻找相通机制。', '每种专业视角都分析问题定义、推荐路径、容易忽略的风险，以及会改变判断的证据。相互质疑后，分清共同事实、真正分歧和分歧背后的假设，再综合方案。', '这些视角由同一模型生成，比较的是不同分析路径。互补性比身份数量更重要。综合方案需要写明适用条件、最大风险、退出条件和第一步行动。', '当方案不断增加补丁，先检查哪些约束来自基本事实，哪些只是习惯性接受的假设。从事实、目标和资源约束重新推导路径，再写明成立前提与验证第一步。', '第一性原理帮助回到基本条件，跨领域借解进一步扩大寻找范围。去掉行业术语，抽象核心矛盾，到相距较远的领域寻找结构相似的问题，最后把机制翻译回当前条件。', '跨领域借解依次完成抽象问题、寻找相似结构、解释解决机制和检查迁移条件。选择值得借用的机制后，提出适合当前处境的方案，并设计低成本、可逆的验证。', '不同视角、基本条件和其他领域都可能提供解法。找到多个方案以后，还需要处理取舍：先比较双方最有力的理由和成立条件，再用行动取得缺少的关键信息。', '钢人论证把两个方向都表述成最有力的版本，用相同维度比较理由、条件、收益、风险和反对意见。比较的重点是真正的分歧，以及可能改变结论的变量。', '充分表达双方理由以后，只追问一个最可能改变结论的问题。新的回答提供关键条件，再据此给出明确判断、理由、适用条件与下一步行动。', '有些不确定性需要现实反馈。先找出最需要验证的三个假设，再选最可能改变最终结论的一个。验证应低成本、可逆，行动前写好指标和继续或停止的条件。', '最小实验需要明确做什么、投入多少时间和资源、观察什么指标、什么结果支持继续或提醒停止，以及结束后能够获得什么新信息。', '钢人论证找出决定选择的条件，最小实验补充这些条件的现实依据。新信息回到判断中，帮助更新方案和下一步行动。', '三个核心负责把任务交代清楚；四类策略负责选择处理方式。先问清问题，再学习和核查，接着找到解法，最后比较条件并取得反馈。', 'Prompting说明要查询什么以及怎样回答。查询纽约天气还需要工具实际取得信息。Agent组织工具执行，把返回结果放回模型输入，模型再据此生成回答。']
rawmap={21:1,23:2,25:3,27:4,28:4,30:5,33:6,34:7,36:8,39:9,41:10}
methodmap={20:1,21:1,23:2,24:3,25:3,26:4,27:4,28:4,29:5,30:5,32:6,33:6,34:7,35:8,36:8,38:9,39:9,40:10,41:10}
coreprompt='你是一位讲授生成式AI的教师，擅长向非技术学员解释机制。\n\n我要为MBA学员讲LLM Agents。学员没有编程和深度学习基础。\n\n请用3小时讲清LLM怎样生成、Prompting怎样交代任务、Agents怎样组织执行，含10分钟休息。\n\n参考提供的原课程课件：沿用版式和措辞，配图解释关系，先总览、再展开、最后总结。'
metaprompt='我准备用【目标模型】完成下面的任务。\n任务初稿：【粘贴初稿】\n背景、目标和参考示例：【补充信息】\n\n请先 critique, review and improve：\n1. 找出缺失信息、歧义和冲突；\n2. 信息不足时先向我提问；\n3. 再给出一份可直接使用的完整Prompt。\n\n保留我的目标和必要约束，不要自行改变任务。'
pages=[];materials={};files={}
for i,title in enumerate(titles):
 page=i+15;author=page+5;method=methodmap.get(page);sources=[{'id':'PROMPT_R2' if page>=20 else 'TEACHER','locator':('PDF前四部分；'+P[method-1]['title']) if method else '三项核心与四类策略'}]
 on=[intro[i]]
 if method:on+=[P[method-1]['explanation']]
 text=intro[i]+'\n\n'+(P[method-1]['prompt'] if method else notes[i])
 if page==16:text+='\n\n'+coreprompt
 if page==17:text+='\n\n参考这页课件，沿用蓝色页眉、字号和图文比例。像图中那样把消息与输入文本一一对应；每页先说明要讲什么，再用图解释关系，最后归纳。'
 if page==18:text+='\n\n'+metaprompt+'\n\n教师心得原句：you are GPT 5.6，下面是我的 prompt，please critique, review and improve。还要说明optimize for which model。'
 pages.append({'page':author,'renderer':301+i,'section':'Prompting','show_sources':False,'type':'summary' if page in [19,42,43] else 'overview' if page in [15,22,31,37] else 'bridge' if page==44 else 'content','title':title,'seconds':times[i],'on_slide':on,'talk':notes[i],'sources':sources})
 materials[str(author)]=text
 files[str(author)]=[]
meta={'pages':pages,'materials':materials,'files':files,'sources':{'PROMPT_R2':{'title':'Prompting技巧：前四部分10个原始Prompt与说明','path':str(root/'sources/prompting-r2/prompts.json'),'href':'sources/prompting-r2/reader.html','target':'_self'}}}
(root/'src/prompting-r2.json').write_text(json.dumps(meta,ensure_ascii=False,indent=2)+'\n')
(root/'src/prompting-r2-data.js').write_text('window.MBA_PROMPTING_R2 = '+json.dumps({'prompts':P,'titles':titles,'intro':intro,'coreprompt':coreprompt,'metaprompt':metaprompt},ensure_ascii=False)+';\n')
body='<h1>Prompting：三个核心与十种策略</h1><p><a id="deck-back" href="../../index.html#p=15&s=1">返回课件</a></p><nav>'+''.join(f'<a href="#prompt-{p["id"]}">{p["group"]} · {p["title"]}</a> ' for p in P)+'</nav>'
body+='<h2>三个核心</h2><p>四大要点：Who you are / Who I am / Objective / Example。给出参考样例，并明确要参考的特征。让模型检查、改进并写出完整Prompt。</p><pre>'+html.escape(coreprompt)+'</pre><h3>让模型帮你写Prompt</h3><pre>'+html.escape(metaprompt)+'</pre>'
for p in P:
 body+=f'<section id="prompt-{p["id"]}"><h2>{p["group"]} · {p["title"]}</h2><p>{p["explanation"]}</p><pre>{html.escape(p["prompt"])}</pre></section>'
reader='''<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Prompting原始提示词与讲解</title><style>@font-face{font-family:mba;src:url('../../assets/msyh.ttc')}body{max-width:1100px;margin:40px auto;padding:0 26px;color:#002060;font:22px/1.7 mba,sans-serif}h1{font-size:34px}h2{font-size:29px}a{color:#0059ab}nav a{display:inline-block;margin:5px 15px 5px 0}section{padding-top:24px;border-top:1px solid #bbcde2;margin-top:34px}pre{font:inherit;white-space:pre-wrap;background:#f7f9fc;border-left:4px solid #0070c0;padding:22px;color:#111}section:target{scroll-margin:25px}</style></head><body>'''+body+'<script>const from=Number(new URLSearchParams(location.search).get("from"));if(Number.isInteger(from)&&from>=15&&from<=44)document.getElementById("deck-back").href="../../index.html#p="+from+"&s=1";</script></body></html>' 
(root/'sources/prompting-r2/reader.html').write_text(reader)
(root/'sources/prompting-r2/page-map.json').write_text(json.dumps({'pages':[{**p,'page':p['page']-5} for p in pages],'method_pages':{p['title']:[n for n,m in methodmap.items() if m==p['id']] for p in P},'duration_seconds':sum(times),'excluded_pdf_part':5},ensure_ascii=False,indent=2)+'\n')
print('30 Prompting pages,',sum(times),'seconds, 10 original prompts')
