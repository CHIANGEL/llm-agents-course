registry = {"get_weather": get_weather}
function = registry[call["name"]]
result = function(**call["arguments"])
