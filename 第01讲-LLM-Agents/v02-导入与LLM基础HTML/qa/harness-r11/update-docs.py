from pathlib import Path
r=Path(__file__).resolve().parents[2];w=r.parents[1]
append='''

### 2026-10-20 最新要求：Harness重构（r11）

- Protocols之后从工具、Memory、Skills和Protocols汇总出Harness；先讲整体运行循环，再展开上下文压缩与清理、沙盒与权限、Hooks、子智能体、进度与恢复，最后回到同一张运行图。
- 第148页为章前目录，第149–166页为18页正文。原课PDF物理第155–185页中17幅配图局部复用；主要文字用可选择HTML排版，全部整页显示。
- 不搬入Hooks配置源码；子智能体明确独立上下文、结果回传、依赖与开销；沙盒范围、操作放行和人工确认分别解释。旧Harness的重复MCP与reMarkable多页交接不进入新版播放序列，旧资料保留为历史。
- 当前175页、175个播放器状态，全部页面默认全显；既有概率、消息和材料的页内控件保留。Harness第148–166页；整合第167–173页；总结第174–175页。前147页未改动内容。
- Harness参考30分钟；全讲参考266分25秒，含10分钟休息，允许分两次讲。来源档案在sources/harness-r11；实际复查范围和结果在qa/harness-r11。
'''
p=w/'AGENTS.md';s=p.read_text();s=s.replace('Protocols r10后共177页、179个播放器状态，176页全显、1页机制演示3态。','Harness r11后共175页、175个播放器状态，全部页面整页显示。').replace('其余页序见下方r10最新记录','其余页序见下方r11最新记录');p.write_text(s+append)
p=w/'00-课程规划/课程共识与制作规范.md';s=p.read_text();a=s.index('逐页规划v01初稿为89页；');b=s.index('\n\nLLM基础采用',a);s=s[:a]+'逐页规划v01初稿为89页；此前完整HTML曾为134页、387个手动分步状态。当前Harness r11共175页、175个播放器状态，所有页面整页显示，必要对照使用页内控件。参考讲授256分25秒，另保留10分钟休息，可按教师安排分两次讲。Harness第148–166页；完整页序见当前页面清单。'+s[b:];s=s.replace('Harness保留已有版本，当前页码以页面清单为准','Protocols独立讲MCP与A2A；Harness重组为运行概览、上下文、权限、Hooks、子智能体和恢复，当前页码以页面清单为准');p.write_text(s+append)
p=w/'00-课程规划/第一讲课程规划.md';s=p.read_text();a=s.index('### 3.5 Harness');b=s.index('### 3.6 外化与内化整合',a)
s=s[:a]+'''### 3.5 Harness

先把工具、Memory、Skills与Protocols接成运行系统，再说明为什么还需要上下文、权限、事件触发、分工与进度管理。每个部分先明确问题与内部关系，展开机制后归纳其作用；章末回到同一张运行图，接入外化与内化整合。

| 页码 | 内容 | 参考时间 | 讲授重点 |
| --- | --- | --- | --- |
| 148–151 | 章前目录与运行总览 | 4分30秒 | 四类组件、运行循环、五类新增安排 |
| 152–154 | 上下文 | 5分钟 | 选相关材料、把较早过程压成工作摘要、移出长输出并保留原始路径 |
| 155–156 | 沙盒与权限 | 3分40秒 | 访问范围、操作放行、具体动作的人工确认 |
| 157–159 | Hooks | 4分50秒 | 事件触发、Prettier格式整理、执行前与执行后的不同作用 |
| 160–163 | 子智能体 | 6分50秒 | 独立上下文、短报告回传、任务依赖、分工开销 |
| 164–165 | 进度与恢复 | 3分30秒 | 保存记录与文件、核对现状、确认外部动作是否已经发生 |
| 166 | 回到运行总图 | 1分40秒 | 五类安排进入运行循环，过渡到训练与模型参数 |

沙盒解释运行环境执行的访问约束，权限解释操作怎样放行；Hooks只讲触发机制和格式整理案例，不讲配置源码。子智能体的结果隔离连接前面渐进式披露，分工同时考虑依赖关系与开销。保留进度与外部操作核对，合并旧版零散日志、停止与验收页。旧reMarkable交接案例移出当前序列，其来源与旧版本保留在档案。

原课PDF物理第155–185页提供17幅局部配图，包括运行图、文件摘要、访问范围、事件触发、代理分工和跨会话恢复。主要正文使用可选择HTML，全部页面整页显示，不新增课堂任务或逐条揭示。

'''+s[b:]
# Update only current planning section, not dated version history.
a=s.index('### 2026-10-19') if '### 2026-10-19' in s else len(s)
head,history=s[:a],s[a:]
head=head.replace('177页、179个播放器状态','175页、175个播放器状态').replace('259分05秒','266分25秒').replace('177页的新页序','175页的新页序')
head=head.replace('| 226:25–249:05 | 22分40秒 | Harness | 组织材料与工具、权限、停止、恢复、日志与验收 |','| 226:25–256:25 | 30分钟 | Harness | 运行总览、上下文、沙盒权限、Hooks、子智能体、进度恢复 |').replace('| 249:05–259:05 |','| 256:25–266:25 |')
head=head.replace('| Harness | reMarkable客服交接，公开企业应用案例 | 自动处理、交接材料、人工继续的流程图 | 何时停止自动处理，怎样让下一位处理者接上工作 |','| Harness | Claude Code的文件格式整理配置 | 文件编辑成功、Hook触发、Prettier整理格式 | 固定动作按事件触发，实际程序完成处理 |')
head=head.replace('Memory r8、Skills r9和Protocols r10记录','Memory r8、Skills r9、Protocols r10和Harness r11记录');p.write_text(head+history+append)
p=w/'README.md';s=p.read_text().replace('177页、179个播放器状态','175页、175个播放器状态').replace('259分05秒','266分25秒').replace('Harness保留reMarkable案例','Harness重构为宏观运行、上下文、沙盒权限、Hooks、子智能体和进度恢复');p.write_text(s)
p=r/'README.md';s=p.read_text();a=s.index('当前为');b=s.index('\n\n## 打开与操作',a);s=s[:a]+'当前为175页、175个播放器状态，所有页面整页显示，既有页内对照控件保留。Harness r11为18页正文加1页目录，参考30分钟。全讲参考讲授256分25秒，加休息10分钟共266分25秒；教师已允许超过180分钟，可分两次讲。沿用安泰版式，文字可选择，原课配图以局部裁图复用。'+s[b:]
s=s.replace('revision=protocols-r10','revision=harness-r11').replace('| 148–168 | Harness | 22分40秒 |','| 148–166 | Harness | 30分钟 |').replace('| 169–177 |','| 167–175 |').replace('| 148–168 | 3.5','| 148–166 | 3.5').replace('| 169–175 | 3.6','| 167–173 | 3.6').replace('| 176–177 | 3.7','| 174–175 | 3.7')
s=s.replace('；reMarkable第157–159页','；Harness第158页为文件编辑后Hook自动整理格式的配置案例')
s=s.replace('- `src/schedule.json`','- `src/harness-r11.json` / `.js` / `.css`：Harness重构与17幅原课局部配图；旧`agents-harness.js`不再由入口加载。来源在`sources/harness-r11/`。\n- `src/schedule.json`')
s=s.replace('[本轮修订与复查](qa/protocols-r10/问题与修订记录.md)','[本轮修订与复查](qa/harness-r11/问题与修订记录.md)');p.write_text(s)
