# Prompting制作约定

在现有19页后追加20–49页，新增30页，约35分钟；课程范围只推进到Prompting与Agent衔接。

使用现有标题/页眉/字体。画布1600×900，body=left48/top140，宽1504高718。白底蓝字红重点，正文34、图内30、最低28；不靠缩字号塞满。每页一图一关系，具体Prompt批注、报表、数据图、记录表、分支和反馈流程为主要配图。不能全用等宽文字卡片。

公共 `window.PROMPT_VIS` 提供 `at(x,y,w,text,cls='txt',step)`、`svg(body,step)`、`arrow(x1,y1,x2,y2,color)`、`paper(x,y,w,h,fill)`、`rule(y,x1,x2)`、`wrap(body)`。蓝色#003f98、辅助蓝#0070c0、红#c00000。新增样式在prompting.css；现成class有txt/label/h2/black/red/center/strong/p-quote/p-number/p-example/p-table/p-small。

各模块注册 `window.MBA_RENDERERS[当前页码]={steps:N,render(step){return HTML}}`；step从0起，用data-reveal或helper末参数显露元素。小节总览通常一次展示完整关系，小结2–3步，展开2–4步。回退必须还原。正文、讲者备注和完整材料均不得出现防御性文字、备课说明、学生练习或作业。来源只在元数据中记录名称与页码。

每组另交同名JSON：`{"pages":[{"page":22,"renderer":22,"source_plan_page":15,"section":"Prompting·任务交代","type":"overview|content|summary","title":"...","seconds":30,"on_slide":[...],"talk":"...","sources":[{"id":"L2","locator":"v09第009页"}]}],"materials":{"22":"本页完整Prompt、相关原文或材料"}}`。source可用L1/L2/TEACHER/PROMPT_PDF/PLAN。长模板放materials，正文仅放重点但必须可读。材料里的示例数据直接使用原值，不虚构真实调用输出或通过率。

页面安排：20全讲分层目录；21Prompting章总览；22–27任务交代（总览/用途/四件套/样例/条件与步骤/小结）；28–31澄清（总览/事实解释目标/关键追问/小结）；32–35核查（总览/依据表/结论范围/小结）；36–39比较（总览/双向钢人/共同维度/小结）；40–42验证（总览/最小验证/小结）；43–47反馈（总览/改Prompt/重试与修改/代表性任务检查/小结）；48章总结；49接Agent。

作者分工：任务和反馈由prompt_original_review；澄清核查由prompt_pdf_review；比较验证由prompt_compare_verify；根任务负责20、21、48、49和集成。各自仅写指定模块JS与JSON，不改共享文件与前19页。
