# 最终源码与案例一致性复核

复核日期：2026-10-14。

复核版本：20页 Skill HTML 课件，`openai/codex@21c16161191ff965031d1ac41fe9046011610743`，公开 jupyter-notebook 包 `openai/skills@49f948faa9258a0c61caceaf225e179651397431`。

## 结论

源码、材料与消息结构检查通过。已逐页读完20页正文、动态演示说明、关键预览和备注；未发现主线机制错误。共33项数据一致性检查通过。本复核不代替主线程的浏览器操作与视觉检查。

曾发现一处错误来源路径：`core/src/skills/render.rs` 在该版本不存在。已向主线程报告，主线程已改成实际存在的 `ext/skills/src/catalog_prompt.rs`，并重新构建。最终所有课件中 Codex 源码链接的仓库相对路径都能在固定 checkout 中找到。

## 逐项核对

1. 首次请求与 `research/initial-input.proposed.json` 完全相同，四条消息依次为基础 developer、权限＋Skills developer、项目＋环境 user、当前用户请求 user。
2. developer 中的目录与 `skills-instructions.filled.txt` 完全相同。目录为 HostAliases 分支，r0 已定义，指向 `/workspace/course/.agents/skills`。完整调用参数使用展开后的路径。
3. 权限为 workspace-write、never、restricted；环境中唯一写路径与教学 cwd 一致。没有误留 Memory 示例的 read-only 条件或 Memory 正文。
4. 后续每一个请求保留相同的三条基础上下文；请求 input 与 requestIds 指定的连续条目逐一相同，磁盘 `case/requests/` 与内嵌数据相同。
5. 五个工具调用各有唯一、正确匹配的 call_id，返回紧接对应调用，均使用 Responses 的 function_call／function_call_output；未混入 Chat Completions 的 tool_calls 或 role=tool。
6. 五个调用参数都符合本例 exec_command schema；workdir 一致。工具定义位于顶层 tools，未混入 input，未声称有独立的本地 Skill 调用函数。
7. Skill 正文、tutorial-patterns、quality-checklist 三个工具返回与包内文件逐字一致。模型输入包含全文，课堂预览明确写为节选或中文概要。
8. Notebook 工具返回与本地读取记录逐字一致，可解析为与实际产物相同的 JSON。七个单元及首个标题正确，其他内容保留模板。
9. 连贯完整消息列表与展示顺序一致；初次上下文不随新工具结果消失，也没有因准备材料区而自动把整个包放进模型输入。
10. 程序执行模板脚本与模型阅读模板内容已区分。脚本返回文件位置，之后通过读取产物，Notebook 内容才进入下一次请求。
11. 教学选择、调用顺序和示例回答，与真实包文件和实际脚本执行记录的性质分别在展开区说明；没有伪称实际模型轨迹。
12. 初始目录页没有声称“客户端从未读取正文”；说明的是“首次提供给模型的目录”和“尚未装入模型输入”。显式点名的客户端注入、其他来源的 skills.list/read 在来源记录中保留，没有混入主线。

## 最终文件摘要

本次只读复核时的文件：

- `case/data.json` SHA-256：`64b7872088d20e7a7086d50182be00ff99b436bec97f46a5fef5d1edfe2e92b1`
- `slides.json` SHA-256：`5cea1a480a61120cb2690361999c4ccb4e251babad6741017d705e33f6ae04e1`
- `index.html` SHA-256：`c259f24b76dbcf2ff1256263f2ed897a41e4bd989901801fba49cd5ad6675a7d`

如后续只修视觉 CSS，数据结论仍可复用；如修改调用、返回、目录或输入组装，应重新执行对应一致性检查。
