from ..schema import GenState
from ..config import llm

def generate_diet(state: GenState) -> GenState:
    diseases = state.get("diseases", [])
    goal = state.get("goal", "")
    records = state.get("records", [])

    record_summary = "\n".join(
        [f"{r['date']}: 체중 {r['weight']}kg, 체지방률 {r['fat']}%, 수면 {r['sleep']}시간" for r in records]
    )

    prompt = (
        f"당신은 전문가 영양사입니다. 사용자의 건강 데이터를 바탕으로 식단을 구성해야 합니다.\n"
        f"- 목표: {goal}\n"
        f"- 질병: {', '.join(diseases)}\n"
        f"- 최근 7일 기록:\n{record_summary}\n\n"
        f"이 정보를 바탕으로 한국 음식으로 아침, 점심, 저녁 식단을 추천해주세요. 그리고 왜 그렇게 추천했는지도 간단히 한 줄씩 설명해주세요.\n"
        f"출력 형식:\n아침: 음식\n이유: 설명\n점심: 음식\n이유: 설명\n저녁: 음식\n이유: 설명"
    )

    result = llm.invoke(prompt).content.strip()
    lines = result.split("\n")
    diet = []
    for line in lines:
        if line.startswith("아침"):
            diet.append({"breakfast": line.split(":", 1)[-1].strip()})
        elif line.startswith("점심"):
            diet.append({"lunch": line.split(":", 1)[-1].strip()})
        elif line.startswith("저녁"):
            diet.append({"dinner": line.split(":", 1)[-1].strip()})
    return {**state, "diet": diet}