from ..schema import GenState
from ..rag.tip_rag import query_tip_rag
from ..config import llm
from .time_check import timeit

@timeit
def search_tip_from_db(state: GenState) -> GenState:
    found_tips = []
    for todo in state["todo_items"]:
        query = f"{todo['todoItem']} 운동의 올바른 수행 팁을 알려줘"
        tip = query_tip_rag(query)
        found_tips.append({"todoItem": todo["todoItem"], "tip": tip})
        print("tip db 검색")
    return {**state, "todo_tips": found_tips}

@timeit
def generate_tip_from_gpt(state: GenState) -> GenState:
    new_tips = []
    for todo in state["todo_items"]:
        prompt = f"'{todo['todoItem']}' 운동을 안전하고 효과적으로 수행하기 위한 팁을 한국어로 3~5줄로 알려줘."
        tip = llm.invoke(prompt).content.strip()
        new_tips.append({"todoItem": todo["todoItem"], "tip": tip})
    return {**state, "todo_tips": new_tips}