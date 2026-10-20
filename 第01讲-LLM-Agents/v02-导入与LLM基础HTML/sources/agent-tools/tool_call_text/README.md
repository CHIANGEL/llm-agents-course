# 工具调用：文本、解析与本地执行

## 材料性质

- **真实运行**：固定Qwen2.5模板的展开、JSON解析、函数注册与分发、读取本地文件、历史追加，以及上屏代码片段的核验。
- **课堂拟写**：assistant生成的调用文本，以及使用结果后生成的自然语言答案。没有下载或运行模型权重。
- **固定示例数据**：纽约72°F、Partly cloudy来自MCP官方文档，通过本地weather_fixture.json回放，没有查询当前天气。

本例说明程序怎样使用模型的输出，不测试模型是否真的会选对工具。使用了一个工具、一个调用；实际系统可以有多轮或多工具。

## 先看完整记录

- [第一轮消息](data/01_messages.py)、[工具说明](data/02_tools.py)。
- [第一次完整模型输入](data/03_round1_complete.txt)：三个part文件逐字拼接后等于它。
- [拟写调用](data/04_assistant_call_illustrative.txt)、[解析结果](data/05_parsed_call.json)、[真实本地函数返回](data/06_tool_result.txt)。
- [追加后的完整消息列表](data/07_messages_after_tool.py)。
- [第二次完整模型输入](data/08_round2_complete.txt)：包含原system/tools/user、assistant调用、工具返回和最后assistant前缀。
- [拟写最终回答](data/09_assistant_answer_illustrative.txt)、[包含最终回答的完整历史](data/10_final_messages.json)。

上屏分段不改变原文；同一份较长system与工具说明在第二轮仍完整保留，课件只用已展示片段的引用说明，不能误说这些内容被省掉了。

## 怎样重跑

在本目录执行`python3 prepare_demo.py`。程序复用学期已有的`.runtime/lecture1-python`中的Jinja2，无须新建全局环境、下载模型或填写API key。

[prepare_demo.py](prepare_demo.py)使用归档模板及与其所需Transformers行为一致的JSON序列化，生成文本与JSON，不渲染图片。[verification.json](data/verification.json)记录版本、模板SHA、分段拼接、消息角色、执行次数和实际核验范围。

一次独立回放中，只解析时执行0次工具，进入函数调用后执行1次。完整脚本还单独复验上屏代码，因此整个脚本合计执行本地函数2次；[事件文件](data/execution_events.json)分别保存两个回放，不混淆计数。

## 必须保留的解释

Qwen模板把role=tool编码成user段中的tool_response，这仍是工具返回，不能当成真人消息。调用标签有自己的Token ID，但该配置未将其标为special；闭合tool_call标签不等于默认EOS。模型输入、模型输出、应用代码和工具返回要分别标清。

来源与固定revision见[source/origin.json](source/origin.json)。模板配置及LICENSE已归档；更详细格式核验见[研究记录](../../research/工具调用文本模板核验.md)。
