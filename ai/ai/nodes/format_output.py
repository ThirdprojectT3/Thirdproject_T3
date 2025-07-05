from ..schema import GenState
from pprint import pprint
def format_output(state: GenState) -> dict:
    pprint(state["goal"])
    return {
        "todolists": state.get("todo_tips", []),
        "diet": state.get("diet", []),
        "cheering": state.get("cheering", "")
    }