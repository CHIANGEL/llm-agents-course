// 依据本机技能的接口示例；未执行，不含实际应用状态。
var state = await sky.get_app_state({ app: "com.google.Chrome" });
nodeRepl.write(state.text);
