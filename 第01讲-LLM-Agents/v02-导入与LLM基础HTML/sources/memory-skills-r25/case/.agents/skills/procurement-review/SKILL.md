---
name: procurement-review
description: 起草或更新软件采购评审要点；适用于试点采购与正式部署，需要核对采购条件、费用范围、交付和待确认事项时使用。
---
# 采购评审

## 确认本次任务
确认采购阶段、人数、使用期限和预算上限。
当前条件与历史记录不一致时，采用用户对本次任务的最新说明。
缺失条件列入待确认事项，不自行补出报价、审批结果或验收结论。

## 选择评审方法
- 正式部署：读取 references/rollout-review.md，按其中的链接核对费用范围。
- 小范围试点：读取 references/pilot-review.md。
只读取本次任务需要的分支。

## 起草并保存
按参考文件的结构起草评审要点，写入 review-input.json。
写入成功后，向用户说明文件位置、主要内容和待确认事项。

## 需要HTML版式时
用 scripts/render_review.py 将 review-input.json 填入 assets/review-template.html：
python3 .agents/skills/procurement-review/scripts/render_review.py --input review-input.json --output output/procurement-review.html
再读取 references/quality-checklist.md，检查并交付HTML文件。
