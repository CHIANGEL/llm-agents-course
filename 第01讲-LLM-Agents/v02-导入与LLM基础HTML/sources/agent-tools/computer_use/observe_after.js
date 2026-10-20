// 点击后重新读取界面；未执行，不预先填写成功结果。
var after = await sky.get_app_state({ app: "com.google.Chrome" });
nodeRepl.write(after.text);
