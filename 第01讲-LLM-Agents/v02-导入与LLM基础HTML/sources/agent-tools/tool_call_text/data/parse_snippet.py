payload = raw_output.split("<tool_call>", 1)[1]
payload = payload.split("</tool_call>", 1)[0]
call = json.loads(payload)
