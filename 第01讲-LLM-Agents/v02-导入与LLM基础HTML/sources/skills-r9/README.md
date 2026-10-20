# Agent Skills：渐进式披露演示 v01

入口：[打开HTML课件](index.html)。20页，28个主展示状态，可离线打开。

沿用Agent Memory v09的视觉和操作方式，用第3讲已有的公开`jupyter-notebook`包演示一次完整使用过程：

完整Skill包 → 输入中的Skill目录 → 读取SKILL.md → 读取参考文件 → 执行脚本 → 检查生成文件 → 回答用户。

## 课堂安排

| 页码 | 内容 |
| --- | --- |
| 1—4 | 任务、完整12文件包，以及正文、参考、脚本和模板分别存了什么 |
| 5—7 | 客户端组装输入；基础指令、权限、Skill目录、项目、环境、用户请求与工具定义 |
| 8—11 | 模型选择Skill，读取入口，再按正文指引读取教学参考 |
| 12—14 | 执行脚本；程序读取模板、写出Notebook，工具先返回文件位置 |
| 15—18 | 读取检查要求与实际产物，查看7个单元，回答哪些已经完成、哪些仍待补充 |
| 19—20 | 回看输入如何逐步增加，以及Skill与工具各自的作用 |

任务明确要求创建Notebook骨架、保留模板内容。产物不是已完成的“列表与平均值”教程；仅首个标题按任务改写，其余单元保持上游模板，代码单元尚未执行。

## 操作

- 方向键或空格：逐步前进、后退；Page Down / Page Up：整页翻页。
- `G`：跳转页面；`N`：本页备注与来源；`M`：完整材料；`F`：全屏。
- 第2页可逐个查看包内12个文件；第17页可逐个查看Notebook的7个单元。
- 消息演示保留已有上下文，新条目高亮；每个条目可展开，并可查看连贯的完整请求和消息列表。

## 文件

- [逐页内容与讲者备注](逐页内容与讲者备注.md)
- [案例与请求数据](case/data.json)、[连贯完整消息列表](case/messages/complete.json)
- [真实Skill包](case/workspace/.agents/skills/jupyter-notebook/SKILL.md)、[包文件清单与SHA](case/package-manifest.json)
- [实际生成的Notebook](case/workspace/output/jupyter-notebook/python-lists-and-mean.ipynb)
- [案例材料说明](case/材料说明.md)、[源码审计](research/audit.md)
- [制作清单](manifest.json)、[检查记录](qa/验收记录.md)

## 版本与材料来源

Codex客户端固定到`openai/codex@21c16161191ff965031d1ac41fe9046011610743`；公开Skill包固定到`openai/skills@49f948faa9258a0c61caceaf225e179651397431`。包内12文件原样保存。

本例使用本地host Skill的隐式选择路径：用户未点名Skill，模型根据目录决定读取。普通Responses HTTP请求的分支条件和其他加载路径见来源区。请求中的`input`、顶层`tools`与模型内部Chat Template分开说明。

用户请求、assistant选择和回答为教学拟写。脚本执行与文件读取已在本版`case/workspace`完成；原始输出保存在`case/execution`。课堂路径统一表示为`/workspace/course`。无需运行模型或连接外部服务即可演示。

## 构建与检查

`python3 src/build.py`生成独立HTML及配套数据。检查包括逐步翻页、完整材料弹窗、包文件和Notebook单元查看、角色与调用顺序、路径与返回内容一致性。主线程逐页看图验收，详细记录见`qa/`。制作检查不代表教师逐页确认。

此版本独立保存。Agent Memory v09、第3讲v16及更早材料保留。
