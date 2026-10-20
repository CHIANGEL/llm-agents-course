messages = [{'role': 'system', 'content': '请用中文回答。'},
 {'role': 'user', 'content': '纽约现在天气怎么样？'},
 {'role': 'assistant',
  'tool_calls': [{'type': 'function',
                  'function': {'name': 'get_weather',
                               'arguments': {'location': 'New '
                                                         'York'}}}]},
 {'role': 'tool',
  'content': 'Current weather in New York:\n'
             'Temperature: 72°F\n'
             'Conditions: Partly cloudy'}]
