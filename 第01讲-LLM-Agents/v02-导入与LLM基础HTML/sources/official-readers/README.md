# 官方来源离线核读档案

2026-10-19制作完成6个HTML，并已接入各对应课件页面的N来源入口。每页包含官方原文链接、资料性质/版本、本课采用的简短事实、页码和核读档案链接。

`mapping.json`的值相对于课件根目录。官方URL保留在各HTML中；N来源先打开本地核读档案。

页面使用内嵌CSS、系统字体、可选择HTML文字和内嵌data favicon，无外部图片、脚本或字体。资料为核读要点，未复制整篇官方文章。RPEval档案已删除额外的arXiv摘要链接，保留核读所用v1 PDF官方入口。

主审于2026-10-19实际从6页N来源分别打开6个reader，再实际点击34个本地课件页/核读依据链接，共40条操作记录；6个reader的顶部与底部截图均已视觉阅读。实测记录见[official-readers-iab.json](../../qa/independent-review/official-readers-iab.json)，相应截图保存在同一审阅目录的`official-*-top.png`和`official-*-bottom.png`。本分支依据主审的实际检查更新此状态，没有重复进行UI操作。

官方外链的访问限制另行记录：Salesforce页面在当前浏览器显示Access Denied；arXiv PDF出现空视口或IAB超时；Claude的Fin/Box页面在此次浏览器检查中未等到正文，AWS/Zep正文可读。本地reader及本地依据链接的实测结果，不作为这些官方外链已经通过的证明。外部来源访问过程保存在审阅目录的外链记录与`controls-after/external-*.png`中；本轮内容核读依据仍分别保留在各reader所链接的档案内。

详细生成记录及当前6个HTML的SHA256见`creation-record.json`；其中生成阶段的检查描述保留原记录，以上段落记录整合后的实际测试结果。
