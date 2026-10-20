"""Execute the real chat template and a local tool replay; no model inference.

The assistant outputs are written for teaching. Weather values are an official
MCP example fixture, not a live weather query. No generated text is evaluated
as Python. This script produces text and JSON teaching materials only.
"""
from pathlib import Path
import hashlib
import json
from pprint import pformat
import re
import sys

BASE = Path(__file__).resolve().parent
SEMESTER = BASE.parents[3]
sys.path.insert(0, str(SEMESTER / '.runtime/lecture1-python'))
from jinja2.sandbox import ImmutableSandboxedEnvironment

DATA = BASE / 'data'
DATA.mkdir(exist_ok=True)


def save(name, value):
    (DATA / name).write_text(value, encoding='utf-8')


def save_json(name, value):
    save(name, json.dumps(value, ensure_ascii=False, indent=2) + '\n')


origin = json.loads((BASE / 'source/origin.json').read_text())
config_path = BASE / 'source/tokenizer_config.json'
config_sha = hashlib.sha256(config_path.read_bytes()).hexdigest()
expected_sha = next(x['sha256'] for x in origin['files']
                    if x['name'] == 'tokenizer_config.json')
assert config_sha == expected_sha
config = json.loads(config_path.read_text())
env = ImmutableSandboxedEnvironment(trim_blocks=True, lstrip_blocks=True)
# Same JSON serialization behavior needed by this template as Transformers:
# preserve Unicode and insertion order, with no HTML escaping.
env.filters['tojson'] = lambda value, **kwargs: json.dumps(
    value, ensure_ascii=False, **kwargs)
template = env.from_string(config['chat_template'])

tools = [{
    'type': 'function',
    'function': {
        'name': 'get_weather',
        'description': 'Get current weather for a location.',
        'parameters': {
            'type': 'object',
            'properties': {'location': {'type': 'string'}},
            'required': ['location'],
        },
    },
}]
messages = [
    {'role': 'system', 'content': '请用中文回答。'},
    {'role': 'user', 'content': '纽约现在天气怎么样？'},
]
save('01_messages.py', 'messages = ' + pformat(messages, width=64,
                                             sort_dicts=False) + '\n')
save('02_tools.py', '''tools = [dict(type="function", function=dict(
    name="get_weather",
    description="Get current weather for a location.",
    parameters=dict(
        type="object",
        properties=dict(location=dict(type="string")),
        required=["location"]
    )
))]
''')
round1 = template.render(messages=messages, tools=tools,
                         add_generation_prompt=True)
save('03_round1_complete.txt', round1)
assert round1.endswith('<|im_start|>assistant\n')

# Consecutive literal excerpts, not an invented abbreviated chat template.
cut1 = round1.index('\n\nFor each function call')
cut2 = round1.index('<|im_start|>user\n')
parts = [round1[:cut1], round1[cut1:cut2], round1[cut2:]]
assert ''.join(parts) == round1
for i, part in enumerate(parts, 1):
    save(f'03_round1_part{i}.txt', part)

raw_output = ('<tool_call>\n'
              '{"name": "get_weather", "arguments": {"location": "New York"}}\n'
              '</tool_call><|im_end|>')
save('04_assistant_call_illustrative.txt', raw_output)

fixture = {
    'nature': 'Official MCP example replay; not current weather.',
    'source': 'https://modelcontextprotocol.io/specification/2025-11-25/server/tools',
    'by_location': {
        'New York': 'Current weather in New York:\n'
                    'Temperature: 72°F\n'
                    'Conditions: Partly cloudy'
    },
}
save_json('weather_fixture.json', fixture)
events = []
total_tool_executions = 0


def get_weather(location):
    # Read external data from a local fixture for a reproducible classroom replay.
    weather = json.loads((DATA / 'weather_fixture.json').read_text())
    global total_tool_executions
    total_tool_executions += 1
    events.append({'event': 'tool_executed', 'name': 'get_weather',
                   'location': location, 'read': 'weather_fixture.json'})
    return weather['by_location'][location]


registry = {'get_weather': get_weather}


def parse_call(text):
    match = re.fullmatch(r'<tool_call>\s*(.*?)\s*</tool_call><\|im_end\|>',
                         text, flags=re.S)
    if not match:
        raise ValueError('Expected exactly one complete tool-call block')
    call = json.loads(match.group(1))
    if not isinstance(call, dict) or set(call) != {'name', 'arguments'}:
        raise ValueError('Invalid call fields')
    if call['name'] not in registry:
        raise ValueError('Unknown tool name')
    arguments = call['arguments']
    if (not isinstance(arguments, dict) or set(arguments) != {'location'}
            or not isinstance(arguments['location'], str)):
        raise ValueError('Expected one string location')
    return call


# Merely obtaining and parsing the text has no effect on the tool.
call = parse_call(raw_output)
save_json('05_parsed_call.json', call)
assert events == []
without_dispatch = len(events)

# The application, not the model text, invokes a registered Python function.
function = registry[call['name']]
result = function(**call['arguments'])
assert len(events) == 1
main_replay_events = list(events)
save('06_tool_result.txt', result)
assistant_message = {'role': 'assistant', 'tool_calls': [
    {'type': 'function', 'function': call}
]}
tool_message = {'role': 'tool', 'content': result}
messages2 = messages + [assistant_message, tool_message]
save_json('07_messages_after_tool.json', messages2)
save('07_messages_after_tool.py', 'messages = ' + pformat(
    messages2, width=64, sort_dicts=False) + '\n')
save('07_assistant_message.py', '''assistant_message = dict(
    role="assistant",
    tool_calls=[dict(
        type="function",
        function=dict(
            name="get_weather",
            arguments=dict(location="New York")
        )
    )]
)
''')
save('07_tool_message.py', 'tool_message = ' + pformat(
    tool_message, width=64, sort_dicts=False) + '\n')

round2 = template.render(messages=messages2, tools=tools,
                         add_generation_prompt=True)
save('08_round2_complete.txt', round2)
prefix = round1.removesuffix('<|im_start|>assistant\n')
assert round2.startswith(prefix)
tail = round2[len(prefix):]
cut_tool = tail.index('<|im_start|>user\n<tool_response>')
assistant_part = tail[:cut_tool]
tool_part = tail[cut_tool:].removesuffix('<|im_start|>assistant\n')
assert prefix + assistant_part + tool_part + '<|im_start|>assistant\n' == round2
save('08_round2_part1_unchanged.txt', prefix)
save('08_round2_part2_assistant.txt', assistant_part)
save('08_round2_part3_tool.txt', tool_part)
save('08_round2_part4_prefix.txt', '<|im_start|>assistant\n')
save('08_round2_new_tail.txt', tail)
assert '<|im_start|>tool' not in round2
assert '<tool_response>\n' + result + '\n</tool_response>' in round2

final_answer = '纽约气温72°F，局部多云。'
save('09_assistant_answer_illustrative.txt', final_answer + '<|im_end|>')
final_messages = messages2 + [{'role': 'assistant', 'content': final_answer}]
save_json('10_final_messages.json', final_messages)

save('parse_snippet.py', '''payload = raw_output.split("<tool_call>", 1)[1]
payload = payload.split("</tool_call>", 1)[0]
call = json.loads(payload)
''')
save('dispatch_snippet.py', '''registry = {"get_weather": get_weather}
function = registry[call["name"]]
result = function(**call["arguments"])
''')
save('append_snippet.py', '''messages.append(assistant_message)
messages.append(tool_message)
''')

# Check the exact teaching snippets against the fully checked replay.
scope = {'raw_output': raw_output, 'json': json, 'get_weather': get_weather}
exec((DATA / 'parse_snippet.py').read_text(), scope)
assert scope['call'] == call
events.clear()
exec((DATA / 'dispatch_snippet.py').read_text(), scope)
assert scope['result'] == result and len(events) == 1
append_scope = {'messages': list(messages),
                'assistant_message': assistant_message,
                'tool_message': tool_message}
exec((DATA / 'append_snippet.py').read_text(), append_scope)
assert append_scope['messages'] == messages2
for filename, variable, expected in [
    ('01_messages.py', 'messages', messages),
    ('02_tools.py', 'tools', tools),
    ('07_assistant_message.py', 'assistant_message', assistant_message),
    ('07_tool_message.py', 'tool_message', tool_message),
    ('07_messages_after_tool.py', 'messages', messages2),
]:
    python_scope = {}
    exec((DATA / filename).read_text(), python_scope)
    assert python_scope[variable] == expected

unknown_rejected = False
try:
    parse_call(raw_output.replace('get_weather', 'unknown_function'))
except ValueError:
    unknown_rejected = True
assert unknown_rejected and len(events) == 1

verification = {
    'date': '2026-09-30', 'model_template': origin['model'],
    'revision': origin['revision'], 'config_sha256': config_sha,
    'method': 'Exact archived Jinja template, matching tojson behavior; no tokenization or model inference',
    'model_inference_run': False, 'live_weather_query': False,
    'template_actually_executed': True, 'parser_and_dispatch_executed': True,
    'weather_value_source': fixture['source'],
    'round1_parts_concatenate_exactly': ''.join(parts) == round1,
    'round2_parts_concatenate_exactly': prefix + assistant_part + tool_part + '<|im_start|>assistant\n' == round2,
    'round1_message_roles': [m['role'] for m in messages],
    'round2_message_roles': [m['role'] for m in messages2],
    'role_tool_serialized_as_user_tool_response': True,
    'tool_executions_without_dispatch': without_dispatch,
    'tool_executions_with_dispatch': len(events),
    'count_scope': '0 versus 1 within each isolated replay; the script runs the full replay and shown snippets separately',
    'main_replay_tool_executions': len(main_replay_events),
    'snippet_replay_tool_executions': len(events),
    'whole_script_tool_executions': total_tool_executions,
    'unknown_tool_rejected_without_execution': unknown_rejected,
    'shown_snippets_executed': ['parse', 'dispatch', 'append'],
    'shown_python_data_roundtrip': True,
    'special_tokens': {'im_start': 151644, 'im_end': 151645},
    'tool_call_tags_are_marked_special_in_config': False,
    'claims_scope': 'Replay verifies serialization and program execution, not model tool-use success rate.',
}
save_json('execution_events.json', {'main_replay': main_replay_events,
                                   'snippet_replay': events})
save_json('verification.json', verification)
inventory = [{'path': p.name, 'sha256': hashlib.sha256(p.read_bytes()).hexdigest()}
             for p in sorted(DATA.iterdir()) if p.is_file() and p.name != 'artifact_sha256.json']
save_json('artifact_sha256.json', inventory)
print(json.dumps(verification, ensure_ascii=False, indent=2))
