"""Execute the archived model's exact Jinja template; no model generation."""
from pathlib import Path
import hashlib
import json
import sys

D = Path(__file__).resolve().parent
lecture = D.parents[2]
semester = lecture.parent
sys.path.insert(0, str(semester / '.runtime/lecture1-python'))
from jinja2 import Template

for name in ['data', 'prompts', 'candidates', 'slides', 'tool_results', 'qa']:
    (D / name).mkdir(exist_ok=True)

config_path = lecture / 'materials/smollm2_tokenizer_config.json'
config = json.loads(config_path.read_text())
archived = json.loads((lecture / 'materials/chat_template_demo.json').read_text())
assert hashlib.sha256(config_path.read_bytes()).hexdigest() == archived['config_sha256']
assert config['chat_template'] == archived['template']
assert config['added_tokens_decoder']['1']['content'] == '<|im_start|>'
assert config['added_tokens_decoder']['2']['content'] == '<|im_end|>'
history = [dict(role='system', content='只给结果。')]
turns = [('3人，每人20元？', '60元。'), ('5人呢？', '100元。'), ('预算80元，差多少？', '还差20元。')]
titles = ['多轮聊天：第一次提问', '多轮聊天：接着问人数', '多轮聊天：再问预算']
explanations = ['应用先放入system指令，再加入用户问题。', '上一轮回答作为assistant消息，与追问一起传入。', '模型收到完整历史，才知道这次仍按5人计算。']
cases = []
for i, ((question, answer), title, explanation) in enumerate(zip(turns, titles, explanations), 1):
    history.append(dict(role='user', content=question))
    messages = [dict(m) for m in history]
    rendered = Template(config['chat_template']).render(messages=messages, add_generation_prompt=True)
    assert rendered.endswith('<|im_start|>assistant\n')
    assert rendered.count('<|im_start|>') == len(messages) + 1
    assert rendered.count('<|im_end|>') == len(messages)
    code_lines = ['messages = [']
    for m in messages:
        code_lines += [f"  dict(role='{m['role']}',", f"    content='{m['content']}'),"]
    code_lines += [']']
    code = '\n'.join(code_lines)
    ns = {}
    exec(code, {}, ns)
    assert ns['messages'] == messages
    case = dict(id=f'chat_{i:02}', title=title, explanation=explanation,
                browser_messages=[m for m in messages if m['role'] != 'system'],
                messages=messages, python_code=code, template_text=rendered,
                subsequent_illustrative_answer=answer, status='draft_for_root')
    cases.append(case)
    (D / 'data' / f'chat_{i:02}_messages.py').write_text(code + '\n')
    (D / 'data' / f'chat_{i:02}_template.txt').write_text(rendered)
    history.append(dict(role='assistant', content=answer))

verification = dict(date='2026-09-16', model=archived['model'], revision=archived['revision'],
                    config_sha256=archived['config_sha256'], method='Jinja2 execution of archived tokenizer_config.json chat_template',
                    no_model_generation=True, special_token_ids={'<|im_start|>': 1, '<|im_end|>': 2},
                    line_counts=[len(c['template_text'].splitlines()) for c in cases],
                    message_counts=[len(c['messages']) for c in cases],
                    arithmetic={'3 * 20': 60, '5 * 20': 100, '100 - 80': 20},
                    exact_python_list_roundtrip=True)
assert verification['line_counts'] == [5, 9, 13]
(D / 'verification.json').write_text(json.dumps(verification, ensure_ascii=False, indent=2))
(D / 'data/cases.json').write_text(json.dumps(cases, ensure_ascii=False, indent=2))
out = ['# 聊天全过程：三轮完整快照草案',
       '每页均在新一轮回答开始前取快照：左为网页端，中央为完整Python消息列表，右为真实模板执行后的完整文本。右栏最后一行必须为<|im_start|>assistant，后有换行；不把生成答案当作模板输入。每页底部单独以“随后生成（课堂拟写）”展示该轮答案及入库动作。',
       '共用说明：模板采用SmolLM2；已实际执行模板，回复为课堂拟写。实际模型还有其他模板；这里使用同一固定模板。']
for c in cases:
    ui = '\n'.join(('用户：' if m['role'] == 'user' else '助手：') + m['content'] for m in c['browser_messages'])
    out += [f"## {c['id']}｜{c['title']}", c['explanation'],
            '### 左：网页聊天\n' + ui + '\n正在生成……',
            '### 中：Python messages\n```python\n' + c['python_code'] + '\n```',
            '### 右：Chat Template文本\n```text\n' + c['template_text'] + '```',
            '### 底部\n随后生成（课堂拟写）：' + c['subsequent_illustrative_answer'] + '\n应用将这条回复记为assistant，下一轮一起传入。',
            '### 图解\n三个竖列顶端依次用蓝色细箭头连接；用户消息在左栏对应中栏user和右栏user。右栏末尾assistant前缀用红色，后接红色光标示意下一Token开始位置。新加入的用户行用红色；既有历史保留深蓝。所有代码完整，无省略号。']
(D / 'content_draft.md').write_text('\n\n'.join(out))
print('Verified 3 complete request snapshots; template lines 5, 9, 13; legal Python code round-trips.')
