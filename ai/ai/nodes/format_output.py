from ..schema import GenState

def format_output(state: GenState) -> dict:
    return {
        "todolists": state["todo_tips"],
        "diet": state["diet"],
        "cheering": state["cheering"]
    }