from ..schema import GenState
from ..rag.sleep_rag import query_sleep_rag
from .time_check import timeit

@timeit
def analyze_sleep(state: GenState) -> GenState:
    recent_sleep = state["records"][-1]["sleep"]
    sleep_avg = "수면 양호" if recent_sleep >= 7 else "수면 부족"
    query = f"{sleep_avg}일 때 운동에 어떠한 영향을 끼치는지 알려줘"
    effect = query_sleep_rag(query)
    return {**state, "sleep_summary": sleep_avg, "sleep_effect": effect}