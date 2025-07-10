from ..schema import GenState
from ..rag.tip_rag import aquery_tip_rag
from ..config import llm
from .time_check import timeit
import asyncio

@timeit
async def search_tip_from_db(state: GenState) -> GenState:
    place = state.get("place", "")
    if "쉬기" == place:
        return {**state, "todo_tips": [], "_no_tips": state["todo_items"] }
    
    found_tips = []
    no_tips = []
    rag_tasks = []
    
    for todo in state["todo_items"]:
        query = f"{todo['todoItem']} 운동의 올바른 수행 팁을 알려줘 ex) 1. ~~~ 2. ~~~ 3. ~~~"
        rag_tasks.append((todo, aquery_tip_rag(query)))
    
    results = await asyncio.gather(*[task for _, task in rag_tasks])

    for i, (todo, _) in enumerate(rag_tasks):
        tip = results[i]
        if "죄송" in tip or "없습니다" in tip or len(tip) < 30:
            no_tips.append({"todoItem": todo["todoItem"]})            
        found_tips.append({"todoItem": todo["todoItem"], "tip": tip})

    print("tip db 검색")

    return {**state, "todo_tips": found_tips, "_no_tips": no_tips}

@timeit
async def generate_tip_from_gpt(state: GenState) -> GenState:
    new_tips = []
    no_tips = state.get("_no_tips", [])
    print("GPT 팁 생성 시작: ", no_tips)

    gpt_tasks = []
    for todo in no_tips:
        prompt = f"'{todo['todoItem']}' 운동을 안전하고 효과적으로 수행하기 위한 팁을 한국어로 3~5줄로 알려줘. ex) 1. ~~~ 2.~~~ 3. ~~~"
        gpt_tasks.append((todo, llm.ainvoke(prompt)))

    results = await asyncio.gather(*[task for _, task in gpt_tasks])

    for i, (todo, _) in enumerate(gpt_tasks):
        tip = results[i].content.strip()
        new_tips.append({"todoItem": todo["todoItem"], "tip": tip})

    existing_tips = state.get("todo_tips", [])
    no_tip_items = {todo["todoItem"] for todo in no_tips}

    filtered_existing = [
        tip for tip in existing_tips if tip["todoItem"] not in no_tip_items
    ]
    combined_tips = filtered_existing + new_tips
    
    #임시 필드 제거
    state.pop("_no_tips", None)

    return {**state, "todo_tips": combined_tips}