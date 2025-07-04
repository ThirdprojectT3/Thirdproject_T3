from langgraph.graph import StateGraph
from ai.schema import GenState
from langchain_core.runnables import Runnable

from ai.nodes import (
    analyze_sleep,
    generate_todo,
    search_tip,
    generate_diet,
    generate_cheering,
    format_output,
)

def tip_exists(state: GenState) -> str:
    tips = state.get("todo_tips", [])
    if not tips or any("죄송" in t["tip"] or len(t["tip"]) < 30 for t in tips):
        return "no"
    return "yes"

def build_graph() -> Runnable:
    graph = StateGraph(GenState)

    graph.add_node("수면분석", analyze_sleep.analyze_sleep)
    graph.add_node("TODO생성", generate_todo.generate_todo)
    graph.add_node("TIP탐색", search_tip.search_tip_from_db)
    graph.add_node("TIP생성", search_tip.generate_tip_from_gpt)
    graph.add_node("식단생성", generate_diet.generate_diet)
    graph.add_node("멘트생성", generate_cheering.generate_cheering)
    graph.add_node("출력포맷", format_output.format_output)

    graph.set_entry_point("수면분석")
    graph.add_edge("수면분석", "TODO생성")
    graph.add_edge("TODO생성", "TIP탐색")
    graph.add_conditional_edges("TIP탐색", tip_exists, {
        "yes": "식단생성",
        "no": "TIP생성"
    })
    graph.add_edge("TIP생성", "식단생성")
    graph.add_edge("식단생성", "멘트생성")
    graph.add_edge("멘트생성", "출력포맷")
    graph.set_finish_point("출력포맷")

    return graph.compile()
