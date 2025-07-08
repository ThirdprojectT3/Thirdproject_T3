from ..schema import GenState
from ..config import llm
from .time_check import timeit

@timeit
def generate_cheering(state: GenState) -> GenState:
    todolists = state["todolists"]
    total = sum(len(day["items"]) for day in todolists)
    done = sum(item["complete"] for day in todolists for item in day["items"])
    rate = done / total if total else 0
    goal = state.get("goal", "운동")
    today_todo = state["todo_tips"][0]["todoItem"] if state.get("todo_tips") else "운동"

    prompt = (
        f"지난 7일간의 운동 수행률은 {round(rate * 100)}%입니다. 사용자의 목표는 '{goal}'이고 오늘 추천된 운동은 '{today_todo}'입니다.\n"
        "이 정보를 바탕으로 동기부여가 되는 응원 메시지를 한 문장으로 작성해주세요."
    )
    msg = llm.invoke(prompt).content.strip()
    return {**state, "cheering": msg}