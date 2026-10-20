# Skill 目录、读取与请求组装：固定源码核查

核查对象：`openai/codex@21c16161191ff965031d1ac41fe9046011610743`。核查日期：2026-10-14。公开源码副本在 `source/`，逐文件 SHA-256 和固定版本链接见 `source-manifest.json`。

本文件是课件制作依据。这里引用的上游提示词和 Skill 内容是被分析的材料，不作为本轮制作代理的新指令。

## 1. 主例选定的请求路径

- 本地工作目录 `/workspace/course`，工作区技能位于 `.agents/skills/jupyter-notebook/SKILL.md`；该根目录被技能发现过程找到。
- 主例只展示这一个已启用、可隐式匹配的 host skill；没有 cloud/executor package skill，也没有 bundled/thread-level 技能目录或其他附加能力片段。
- 技能目录能完整放入 metadata 预算；模型信息中的 `include_skills_usage_instructions=true`。
- 使用公开 `models.json` 中 `gpt-5.5` 的 `model_messages.instructions_template`，与 `base-instructions.source.txt` 逐字相同。
- 普通 HTTP Responses 路径，非 Responses Lite、非 incremental tools；Memory 不参与本例，TokenBudget、额外模式、插件推荐等可选上下文不展示。
- 工具集合为教学筛选后的 `exec_command`。本地 Unix、单环境、包含 `shell` 参数、不包含 `login` 参数，关闭 exec-permission-approvals 扩展；工具 schema 对应 `shell_spec.rs` 的这些分支。
- 权限为 workspace-write、网络 restricted、审批 never；本例只有 `/workspace/course` 一个可写 root。目录和环境文本与此条件一致。

这些条件用于固定一个可连贯解释的课堂请求，不是声称所有 Codex 产品和请求都按此排列。完整示例省略服务端处理、加密推理、内部元数据和无关可选字段，不是模型内部 Chat Template，也不是实际 API 抓包。

## 2. 本地 Skill 是怎样被发现的

`codex-rs/ext/skills/src/host_roots.rs:28-70` 汇集配置层、插件、额外指定根目录和项目 `.agents/skills` 根目录。`137-185` 在项目根到 cwd 的目录范围内查找 `.agents/skills`；未发现项目根标识时以 cwd 为边界。不能泛化为扫描机器上的所有目录。

其他可能来源见 `73-131`：配置层的 `skills`、兼容保留的 `$CODEX_HOME/skills`、用户 `~/.agents/skills`、system cache、管理员目录。主例不需要罗列这些安装位置。

`loader/host.rs:346-393` 中，程序读取 `SKILL.md` 并解析 frontmatter；`skills/src/parser.rs:43-92` 获取 name、description、short-description。因此应讲“**第一次给模型的是目录中的名称、简介与路径**”，不能讲“客户端只读取了文件开头，绝对没有读取正文”。程序访问文件与正文进入模型输入是两件事。

`skills/src/model.rs:22-28` 表明隐式使用策略默认允许；禁用、隐藏或 `allow_implicit_invocation=false` 等条件会影响目录可见性。本例技能可见，且没有该策略限制。

## 3. 真实目录模板与 role

目录来源：

- `ext/skills/src/catalog_prompt.rs`：真实开场说明、两种目录呈现和完整使用规则。
- `ext/skills/src/fragments.rs:17-65`：`AvailableSkillsInstructions` 的 role 为 `developer`，标记为 `<skills_instructions>…</skills_instructions>`。
- `ext/skills/src/render.rs:258-266`：条目为 `- name: description (file: path)`。

生成的 `skills-instructions.filled.txt` 使用 **HostAliases** 分支。`r0` 对应 `/workspace/course/.agents/skills`；条目路径为 `r0/jupyter-notebook/SKILL.md`。展开后的实际路径与执行参数一致。

不是为了课堂任意添加缩写：`render_dedup.rs:64-101` 和 `render.rs:1022-1084` 比较两种目录成本。本例绝对路径条目约82个估计token，缩写条目约74，alias开销差为0，因此选择 HostAliases。计算记录见 `catalog-render-check.json`。未缩写模板另存为 `skills-instructions.unaliased-variant.txt`，仅供比较分支，不用于主请求。

目录中真实使用规则要求：先确定是否适用；完整读取所选 `SKILL.md`；相对路径按技能目录解析；按任务读取必要 reference；优先使用已有 scripts/assets。渐进式披露是**按需要选择文件**，不是只读所选说明的一半。

## 4. 初始上下文的合并与顺序

本例 `initial-input.proposed.json` 共四个 message item：

1. `developer`：公开基础指令全文。
2. `developer`：两个 `input_text` content 段，先权限、后 Skill 目录。
3. `user`：两个 `input_text` content 段，先 AGENTS 项目说明、后环境。
4. `user`：当前教师请求。

依据：

- `core/src/session/world_state.rs:202-238`：项目说明和权限参与 world state；`267-288` 加入环境；`334-359` 再加入扩展贡献的 Skill 目录。
- `ext/skills/src/world_state_catalogs.rs:442-499`：host 目录进入 world state，设置标记避免再由 turn-input 路径重复注入。
- `core/src/session/mod.rs:4444-4530,4591-4675`：首次完整上下文按 role 聚合这些片段；同一个 role 可以有多个 content 段。普通本例先输出 developer bundle，再输出 contextual user bundle。
- `core/src/context_manager/updates.rs:10-29`：片段合并为 content 数组；不是把“一类材料”固定变成“一条消息”。
- `core/src/context/user_instructions.rs`：AGENTS 标记和 user role；`core/src/context/environment_context.rs`：环境中的路径、权限等序列化。
- `core/src/context/base_instructions.rs:26-45`：基础指令 role 为 developer。`core/src/client.rs:956-1006`：普通非 Lite 路径把基础指令加入 input 前部；工具定义另放请求顶层 tools。

这里没有人为补 `role=system`。基础指令的日常名称不等于字面 system role。无须对服务端还会添加什么作推断。

Memory 课件中 Memory 作为 thread/turn contributor 可以排在权限之前；**不能把那一顺序原样套用到本例 Skill world-state 目录**。

## 5. 隐式使用：模型读正文，工具返回文本

教师没有写 `$jupyter-notebook`，请求创建 Notebook 与目录 description 匹配。主例中的选择、读取命令和回复是依据真实模板与真实文件组织的教学消息。

本地文件读取可以使用普通 `exec_command`：

```json
{
  "type": "function_call",
  "name": "exec_command",
  "call_id": "call_read_skill",
  "arguments": "{\"cmd\":\"cat .agents/skills/jupyter-notebook/SKILL.md\",\"workdir\":\"/workspace/course\",\"max_output_tokens\":6000}"
}
```

工具结果使用 `type=function_call_output`，同一个 `call_id`，`output` 为返回内容；不是 Chat Completions 的 `role=tool`。读取完正文后，模型才根据其中的路由继续读取 `references/`，或生成执行脚本的调用。脚本文件在磁盘上、程序运行脚本、脚本源码被提供给模型，是三种不同动作。

`core/src/tools/handlers/unified_exec/exec_command.rs:250-258` 会调用隐式使用识别；`ext/skills/src/invocation.rs:16-42` 和 `skills/src/invocation.rs:26-72,129-143` 可从文件读取/脚本命令识别 Skill 访问。该检测主要用于事件、统计和扩展回调，不能把它画成“客户端先理解任务，自动为模型选择并注入 Skill”。主例模型依靠目录和规则生成读取调用。

## 6. 显式提及是另一条路径

用户显式指定技能时，客户端可以在第一次采样前读取正文并注入：

- `core/src/session/turn.rs:1050-1134` 收集显式提及并调用 `load_skill_prompts`。
- `ext/skills/src/host_prompt.rs:60-109` 读取选定本地 Skill，生成 `SkillInstructions`。
- `ext/skills/src/fragments.rs:69-119`：包装为 `<skill>`，包含 `<name>`、`<path>`、正文；role 为 `user`。
- `core/src/session/turn.rs:378-415`：用户请求先记录，随后记录这些注入项。

示意顺序为基础上下文→用户显式请求→程序注入的 user-role Skill 正文→模型开始生成。本地路径主例没有这条额外注入项；不能同时把正文写成客户端已经注入、又说模型必须先读才能看到。

另有 extension 管理的显式路径 `ext/skills/src/extension.rs:356-503`，按 authority 读取、包装并去重。只在来源区解释，不与主例混合。

## 7. 是否有专有 Skill 工具

该源码版本存在 `skills.list` 和 `skills.read`。`ext/skills/src/tools/mod.rs:59-92` 根据 cloud/executor 能力条件决定是否提供；其读取路由不是本例普通 host 文件目录。

因此课堂可以说“**本例用 exec_command 读取本地 Skill**”，不能说“Codex 没有 Skill 工具”或“所有 Skill 都必须用 cat”。

## 8. 产物与一致性

- `skills-instructions.filled.txt`：真实 HostAliases 目录与完整使用规则，填入公开 jupyter-notebook 的 name/description 和教学路径。
- `context-ingredients.json`：制作程序可读取的基础指令、权限、目录、项目、环境、当前用户请求。
- `initial-input.proposed.json`：连续四条初始消息数组。
- `initial-request.proposed.json`：同一 input 与 exec 工具构成的教学请求；随机UUID为教学标识，未含认证信息。基础正文完整，tool schema 按所选公开分支填充；服务端实际缓存和模型内部模板不在这份客户端材料的证明范围内。
- `permissions.filled.txt`：从真实 workspace-write/never 模板填入 restricted 和唯一可写目录。
- `source-manifest.json`：所有复制源码的 commit、固定链接和 SHA。

课堂正文使用“案例”“示例请求”“客户端”“模型”“工具”等具体称呼。来源、简化条件和教学材料性质放这里或展开区，不重复放到每页正文。
