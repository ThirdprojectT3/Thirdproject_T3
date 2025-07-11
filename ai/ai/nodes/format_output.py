from ..schema import GenState
def format_output(state: GenState) -> dict:
    output = {
        "todolists": state.get("todo_tips", []),
        "diet": state.get("diet", []),
        "cheering": state.get("cheering", "")
    }
    state["output"] = output
    return state