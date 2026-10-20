---
name: procurement-review
description: 起草或更新软件采购评审要点；适用于试点采购与正式部署，需要核对采购条件、费用范围、交付和待确认事项时使用。
---
# 采购评审

## 先确定本次任务
从当前请求及已读取的记忆中确认人数、使用期限、预算上限和采购阶段。
当前条件与历史记录不一致时，按用户对本次任务的最新说明处理。
缺失条件列入待确认事项，不自行补出报价、审批结果或验收结论。

## 选择评审方法
- 正式部署：读取 references/rollout-review.md，继续按其中的链接核对费用范围。
- 小范围试点：读取 references/pilot-review.md。
只读取本次任务需要的分支。

## 生成一页评审要点
按照参考文件组织 review-input.json。
运行下列命令，脚本会读取 assets/review-template.html：
python3 .agents/skills/procurement-review/scripts/render_review.py --input review-input.json --output output/procurement-review.html

## 检查后交付
生成文件后，读取 references/quality-checklist.md。
读回 output/procurement-review.html，逐项检查内容，再运行：
python3 .agents/skills/procurement-review/scripts/check_review.py --task task-conditions.json --input review-input.json --output output/procurement-review.html
检查通过后给出文件位置、主要内容和待确认事项。
脚本核对字段与生成结果；还需核对材料依据和待确认事项是否完整。
