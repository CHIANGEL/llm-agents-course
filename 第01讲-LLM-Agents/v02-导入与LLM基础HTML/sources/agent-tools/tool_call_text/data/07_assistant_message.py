assistant_message = dict(
    role="assistant",
    tool_calls=[dict(
        type="function",
        function=dict(
            name="get_weather",
            arguments=dict(location="New York")
        )
    )]
)
