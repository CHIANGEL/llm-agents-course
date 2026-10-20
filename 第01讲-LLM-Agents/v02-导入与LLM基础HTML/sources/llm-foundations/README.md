# LLM 基础：真实逐 Token 生成记录

采集日期：2026-10-19。此目录用于保存模型输出、采集方法与核验依据。

## 当前选用记录

- 官方模型：HuggingFaceTB/SmolLM2-135M-Instruct。
- 固定 revision：`ec84f302454dcb013b57c8acd7ca9cb331981e7e`。
- 运行环境：本机 CPU，Torch 2.9.1，Transformers 4.57.3，float32。
- 选择规则：`do_sample=False`，每一步选择当前概率最高的 Token；temperature 不参与。
- 最大新增 Token：40。实际生成 10 个，其中最后一个为 `<|im_end|>`，因此以结束标记停止。
- system 内容：`You are a helpful assistant.`
- 用户请求：`Write one short formal sentence announcing that the lecture scheduled for today has been cancelled.`
- 实际输出：`The lecture scheduled for today has been cancelled.`

原课的课程通知写作提供案例对象。本次消息由本课采集脚本提交给固定版本模型，完整回复和概率均来自该次运行。未改写输出或补写 Token。模型权重保存在 `/private/tmp/mba-smollm2-cache/`；课件播放使用保存的数据，无须运行或下载模型。

## 文件

- `generation-trace.json`：完整输入与 Token ID，每一步完整前文、累积输出、选中项、前 10 候选概率、其余概率、结束标记。
- `generation-display.json`：同一记录的前 5 候选及其他概率，便于课件绘图；不重新归一化前 5 项。
- `input-chat-template.txt`：本次模型输入的完整模板文本。
- `generated-answer.txt`：原样回复。
- `model-chat-template.jinja`、`model-tokenizer_config.json`：固定模型聊天模板原件。
- `model-config.json`、`model-generation_config.json`：配置原件。
- `collect_trace.py`：可重复采集脚本，默认使用固定版本本地缓存，无付费调用。
- `provenance.json`：下载文件 SHA-256、大小、软件版本、选中尝试、脚本与轨迹 SHA-256。
- `verify_trace.py`、`verification.json`：逐步把完整前文重新送入模型、不使用生成缓存；验证选择结果、概率差异、模板、累计解码与结束位置。
- `attempts.json`：本次实际尝试记录。
- `runs/01-notice-rewrite/`：此前改写提示词的完整原始运行档案。该运行输出 `Today’s lecture is cancelled.`，8 步含结束标记，未丢弃或改造成当前记录。

## 数据口径

每一步的概率来自对完整输出词表 logits 做 softmax。`top10`、`chosen_probability` 和 `top5_remaining_probability` 均保留原数值。界面展示前 5 候选和“其他”时，五项仍使用全词表概率，不能把五项重算为 100%。概率较小时可显示“<0.01%”，不将非零值写成 0。

空格是 Token 字符串的一部分；例如 ` lecture` 带前导空格。正文显示输出时直接拼合解码结果；候选标签如需以可见空格符标记，应明确图例。句号和结束标记为不同的生成步骤。

独立完整前文复算与首次带缓存生成在浮点概率上存在微小差异，逐步差异实值保存在 verification.json；选中 Token 全部一致。课件使用原始生成轨迹，不混用两次计算的概率。

## 官方来源

- https://huggingface.co/HuggingFaceTB/SmolLM2-135M-Instruct/tree/ec84f302454dcb013b57c8acd7ca9cb331981e7e
- https://huggingface.co/docs/transformers/en/chat_templating
- https://huggingface.co/docs/transformers/en/main_classes/text_generation
