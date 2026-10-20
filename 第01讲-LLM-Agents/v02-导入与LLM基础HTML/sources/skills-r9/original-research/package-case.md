# Jupyter Notebook真实技能包：案例材料与检查

核查日期：2026-10-14。案例使用公开包的固定归档，不读取本机私人记忆，不修改全局技能。已重读《教师措辞与版式习惯.md》《课件固定规范.md》，并查看已确认样张002。

## 案例任务

> 请为“Python列表与平均值”创建一个教学用的Jupyter Notebook骨架，先保留模板内容，并说明后续要补哪些内容。

请求不点名技能。主例可由客户端提供技能名称、用途、入口路径，模型按任务匹配`jupyter-notebook`，再发起普通文件读取。此处只负责包、命令及结果；具体客户端提示词、role和请求结构由同一固定Codex源码审计确定，不沿用第3讲旧例的教学system或Qwen模板。

本例的产物是骨架。脚本不会因为标题写着“Python列表与平均值”，就自动把模板中的正弦示例改成列表教程。保留这一点，学生更容易分清文字指引、脚本执行和实际产物。

## 来源与本地路径

- 来源：`https://github.com/openai/skills`
- 固定commit：`49f948faa9258a0c61caceaf225e179651397431`
- 上游目录：`skills/.curated/jupyter-notebook/`
- 历史归档来源：第3讲`v16-Skills完整案例/examples/skill_demo/workspace/skills/jupyter-notebook/`
- 新包位置：`case/workspace/.agents/skills/jupyter-notebook/`
- 原始来源清单：`research/upstream-package-source-manifest.json`
- 当前校验清单：`case/package-manifest.json`
- 12文件逐个核对SHA-256，复制前后、执行前后均与归档一致。Apache-2.0许可证随包保留。

入口中的默认安装路径为`$CODEX_HOME/skills`。本例包放在案例工作区`.agents/skills`，执行命令使用这里实际发现的路径，不设置或更改`CODEX_HOME`。上游包原文不改，路径适配由案例调用完成。

## 本次采用的最短流程

1. 模型先看到名称、用途与入口路径，尚未收到12个文件的全文。
2. 读取`SKILL.md`。正文说明如何选择tutorial、哪里有脚本、该参考哪些文件。
3. 读取`references/tutorial-patterns.md`。据此知道骨架之后应补学习目标、小代码、练习、答案与常见错误。
4. 运行`new_notebook.py --kind tutorial`。脚本读取`assets/tutorial-template.ipynb`，改首标题并保存文件。
5. 读取产物，确认7个模板单元和首标题，再回答创建结果与待补内容。

`quality-checklist.md`的真实读取结果也已保存，供主线程决定是否加入交付检查一步。没有直接编辑Notebook JSON，本例无需打开`notebook-structure.md`。没有实验任务，无需打开实验参考与实验模板。

## 真实执行

工作目录：本版本`case/workspace/`。

```bash
python3 .agents/skills/jupyter-notebook/scripts/new_notebook.py \
  --kind tutorial \
  --title 'Python列表与平均值' \
  --out output/jupyter-notebook/python-lists-and-mean.ipynb
```

原脚本只使用Python标准库。执行前已阅读全文：它根据自身位置定位模板，解析Notebook JSON，修改首标题，拒绝未经`--force`的覆盖，再写出文件。此次没有使用`--force`。

- 运行时间：2026-10-14T08:50:54Z。
- 退出码：0。
- `case/execution/scaffold.execution.json`记录命令、工作目录、起止时间与产物SHA。
- 原始stdout：`case/execution/scaffold.stdout.txt`，含真实绝对产物路径。
- 原始stderr：`case/execution/scaffold.stderr.txt`，为空。
- 产物：`case/workspace/output/jupyter-notebook/python-lists-and-mean.ipynb`
- SHA-256：`09ca247b03d6649c326fafc384cfb2e2df6135c2ce18cc3bc67cee9f2ebd183f`

实际检查得到7个单元。相较教程模板，唯一变化是首单元第一行成为`# Tutorial: Python列表与平均值`。其余内容与metadata全部相同。没有执行Notebook内的代码单元；不能把骨架创建说成完整教程已写成或已运行。

## 文件读取记录

`case/execution/`中包含四份真实`cat`结果及独立执行JSON：

| 记录前缀 | 读取对象 |
| --- | --- |
| `skill-read` | `SKILL.md` |
| `reference-read` | `references/tutorial-patterns.md` |
| `checklist-read` | `references/quality-checklist.md` |
| `notebook-read` | 生成的Notebook全文 |

另有`notebook-check.stdout.txt`，是标准库读取产物后打印单元数、首标题与第4单元；该检查不执行代码单元。所有读取记录在`read-events.json`中汇总。

这些是本地材料核验的真实输出，可填入教学调用的返回内容。教学中的用户请求、模型何时选择工具、模型答复仍为案例编排，不把它们称为一次真实模型会话或API日志。此说明放材料备注，不在正文反复强调。

## 12个文件分别做什么

| 文件 | 用途 | 本例使用方式 |
| --- | --- | --- |
| `SKILL.md` | 名称、用途、操作步骤、资源路径 | 名称用途先提供；正文随后读取 |
| `references/tutorial-patterns.md` | 教程的目标、步骤、练习等结构 | 作为工具结果进入对话 |
| `references/experiment-patterns.md` | 实验与探索的组织方法 | 不读取 |
| `references/notebook-structure.md` | Notebook JSON与安全编辑 | 不读取 |
| `references/quality-checklist.md` | 运行、状态、输出等检查项 | 已有可采用的读取记录 |
| `scripts/new_notebook.py` | 生成骨架 | 外部执行；源码不必进入模型输入 |
| `assets/tutorial-template.ipynb` | 7单元教程模板 | 由Python脚本读取 |
| `assets/experiment-template.ipynb` | 实验模板 | 不使用 |
| `agents/openai.yaml` | 显示名称、简介、图标、默认请求 | 界面配置；不作为技能正文加载 |
| `assets/jupyter-small.svg` | 小图标 | 界面资源 |
| `assets/jupyter.png` | 大图标 | 界面资源 |
| `LICENSE.txt` | Apache-2.0许可证 | 保留许可文本 |

`agents/openai.yaml`不是另一位Agent。模板虽被脚本使用，也不因此自动成为模型输入。若后来发起`cat`读取产物，工具返回的产物JSON才进入后续请求。

## 适合课堂的原文与解释

所有摘录在`case/package-excerpts.json`，每段附原文件路径和连续行号。全文留在完整材料区。

- 入口元数据：`name`、`description`。解释为“客户端先告诉模型，这里有一个创建Notebook的技能。”
- 入口Decision tree：教学任务选择`tutorial`；探索任务选择`experiment`。
- 入口Reference map：列出四种参考的路径和用途，说明模型可以按当前任务继续读取。
- 教程参考第5—9行：目标、目录、小步代码、练习、错误与拓展。中文解释分步显示，不把五条英文与完整翻译塞在一页。
- 脚本`load_template`：实际打开模板并`json.load`；这是程序读取文件。
- 脚本`load_template`与`update_title`两行：创建动作明确，不把程序执行说成模型又生成了模板。
- 界面配置6行：用于解释技能包也可以有模型不需要阅读的资源。

## 可用的结束回答

`case/final-answer.illustrative.txt`：

> 已创建 output/jupyter-notebook/python-lists-and-mean.ipynb，共7个模板单元，首标题为“Python列表与平均值”。
>
> 后续需要补充：学习对象与目标、列表和平均值的小代码例子、练习与参考答案，以及常见错误。当前保留的是模板示例，列表教程正文还没有填入。

本例说明：先给技能简介，匹配任务后读入口，再按需要读参考或运行脚本。技能包没有作为一个整体自动灌入模型输入。
