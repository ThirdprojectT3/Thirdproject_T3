from ..schema import GenState
from ..config import llm

def generate_todo(state: GenState) -> GenState:
    prompt = state["prompt"]
    goal = state.get("goal", "")
    place = state.get("place", "")
    diseases = ", ".join(state.get("diseases", []))
    sleep_summary = state["sleep_summary"]
    sleep_effect = state.get("sleep_effect", "")

    instruction = (
        f"사용자의 오늘 목표는 '{goal}'이고 운동 장소는 '{place}', 질병은 '{diseases}'이며 최근 수면 상태는 '{sleep_summary}'입니다.\n"
        f"수면 상태가 운동에 미치는 영향은 다음과 같습니다: {sleep_effect}\n"
        f"지난 7일간의 운동 기록은 다음과 같습니다:\n"
    )
    for day in state["todolists"]:
        items = ", ".join([item["todo"] for item in day["items"]])
        instruction += f"- {day['date']}: {items}\n"

    instruction += f"오늘의 사용자 프롬프트는 '{prompt}'입니다. 이를 종합해 적절한 운동을 3~4개 추천해줘. 각 운동은 한 줄로 운동 종목만 말해줘."

    response = llm.invoke(instruction).content
    todo_items = []
    for line in response.strip().split("\n"):
        if line:
            todo_items.append({"todoItem": line.strip("-• "), "tip": None})
    return {**state, "todo_items": todo_items}