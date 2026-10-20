tools = [dict(type="function", function=dict(
    name="get_weather",
    description="Get current weather for a location.",
    parameters=dict(
        type="object",
        properties=dict(location=dict(type="string")),
        required=["location"]
    )
))]
