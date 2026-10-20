# MCP 与模型消息：离线课堂示例

协议版本固定为 **2026-07-28**。目录为新建材料，没有修改继承课件。

- 天气工具和返回文本来自官方规范示例，不是当前天气。
- 提示、用户请求、assistant调用及回答均为课堂拟写。
- 本地实际执行了schema映射、JSON转换及固定Qwen模板展开。
- 没有调用LLM、MCP服务器或真实天气API。

`data/` 按01—11保存完整过程。模型侧消息、MCP消息分别存文件；`case_provenance.json`说明来源和改动。`pages_suggestions.json`含11页逐步建议，章节编号待主线程统一。

`source/`保存官方2026-07-28的JSON/TypeScript schema及原LICENSE，固定提交与SHA见`origin.json`。

```bash
python3 build_demo.py
python3 validate_demo.py
```

生成脚本复用课程已有Jinja运行时和已归档Qwen模板。验证脚本仅用Python标准库，只读现有文件；检查本例结构与对应关系，不等于完整MCP集成测试。

详细事实与边界见 `../../research/Protocols-MCP核验.md`。
