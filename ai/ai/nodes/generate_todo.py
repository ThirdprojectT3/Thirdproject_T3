from ..schema import GenState
from ..config import llm
from .time_check import timeit

@timeit
def generate_todo(state: GenState) -> GenState:
    prompt = state["prompt"]
    goal = state.get("goal", "")
    place = state.get("place", "")
    diseases = ", ".join(state.get("diseases", []))
    sleep_summary = state["sleep_summary"]
    sleep_effect = state.get("sleep_effect", "")

    instruction = (
        f"사용자의 오늘 목표는 '{goal}'이고 운동 장소는 '{place}'입니다."
    )
    if place == "쉬기":
        instruction += (
            f"**운동 강도는 매우 가볍게, 활동적인 휴식에 적절한 스트레칭이나 가벼운 동작(예: 목 스트레칭, 전신 스트레칭, 요가 자세 등)만 포함해주세요. "
            f"운동 이름 외에 설명이나 팁은 포함하지 마세요."
        )
    else:
        instruction += (
            f"오늘의 사용자 프롬프트는 '{prompt}'입니다." 
            f"운동 장소별 가능한 운동 예시: 헬스장(벤치프레스, 데드리프트), 집(맨몸 스쿼트, 푸쉬업, 플랭크, 홈 요가), 크로스핏(와드, 박스점프). "
            f"**오직 '{place}'에서 가능한 운동만을 추천해야 합니다.** 절대 다른 장소에서만 가능한 운동은 포함하지 마세요."
        )
    instruction += (
        f"질병은 '{diseases}'이며 최근 수면 상태는 '{sleep_summary}'입니다.\n"
        f"수면 상태가 운동에 미치는 영향은 다음과 같습니다: {sleep_effect}\n"
        f"지난 7일간의 운동 기록은 다음과 같습니다:\n"
    )

    for day in state["todolists"]:
        items = ", ".join([item["todo"] for item in day["items"]])
        instruction += f"- {day['date']}: {items}\n"

    instruction +=(
        f"\n이를 종합해 오늘 사용자에게 적절한 운동을 **반드시 3개 이상, 최대 4개까지** 추천해줘.\n"
        f"각 운동은 다음 형식으로 출력해:\n"
        f"운동 이름 - 세트 수 x 반복 횟수 또는 시간\n"
        f"예시:스쿼트 - 3세트 x 15회\n"
        f"예시:플랭크 - 3세트 x 30초 유지\n"
        f"절대 설명이나 부가적인 말은 하지 말고, 반드시 위 형식으로 출력해. "
    )

    response = llm.invoke(instruction).content
    todo_items = []
    for line in response.strip().split("\n"):
        if line:
            todo_items.append({"todoItem": line.strip("-• "), "tip": None})
    return {**state, "todo_items": todo_items}