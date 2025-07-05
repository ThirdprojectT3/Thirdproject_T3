from ..schema import GenState
from ..config import llm
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from ..rag.diet_rag import get_sleep_context
import re

def generate_diet(state: GenState) -> GenState:
    user_id = state.get("user_id", "정보 없음")
    goal = state.get("goal", "건강 유지")
    diseases = state.get("diseases", [])
    records = state.get("records", [])

    record_summary = ""
    if isinstance(records, list) and records:
        record_summary = "\n".join(
            [
                f"{r.get('date', '날짜 없음')}: 체중 {r.get('weight', '정보 없음')}kg, 체지방률 {r.get('fat', '정보 없음')}%, 수면 {r.get('sleep', '정보 없음')}시간" 
                for r in records
            ]
        )
    else:
        record_summary = "최근 7일간의 건강 기록이 없습니다."

    sleep = "정보 없음"
    if isinstance(records, list) and records:
        latest_record = max(records, key=lambda r: r.get("date", ""))
        sleep = latest_record.get("sleep", "정보 없음")

    diseases_str = ", ".join(diseases) if diseases else "없음"
    
    #diet_rag.py => RAG 검색
    sleep_context = get_sleep_context(sleep)
    
    prompt_template = ChatPromptTemplate.from_messages(
        [
            ("system", """당신은 개인 맞춤형 영양사 AI입니다. 다음 사용자의 건강 목표, 질병 이력, 수면시간을 바탕으로 아침, 점심, 저녁 식단을 구체적으로 제안해주세요.
                        각 식단 메뉴가 포함하는 주요 영양소 및 성분과 그 이유, 그리고 목표 달성과 질병 관리에 어떻게 도움이 되는지 구체적으로 설명해주세요. 
                        식단은 건강하며 균형 잡히고, 특히 사용자의 목표 달성과 질병 관리에 도움이 되며, 수면 상태를 고려한 내용이어야 합니다. 응답은 반드시 [응답 형식]에 맞춰주세요."""),
            ("user", """
            ---
            [사용자 정보]
            사용자 ID: {user_id}
            건강 목표: {goal}
            현재 앓고 있는 질병: {diseases}
            수면 시간: {sleep}시간
            최근 7일 기록:{record_summary}

            [수면 관련 가이드라인 (RAG 검색 결과)]
            {sleep_context}
            ---

            [요청]
            위 정보를 종합하여 아침, 점심, 저녁 식단 예시를 구체적으로 제안해주세요. 각 식단에는 메뉴와 간단한 설명을 포함해주세요.
            식단은 사용자의 {goal}라는 목표와 {diseases} 질병 관리에 도움이 되어야 합니다.

            [응답 형식]
            아침: [아침 식단 메뉴와 양(gram 수 혹은 개수)및 목표와 질병관리에 어떻게 도움이 되는지 한줄로 말해주세요.]
            점심: [점심 식단 메뉴와 양(gram 수 혹은 개수) 및 목표와 질병관리에 어떻게 도움이 되는지 한줄로 말해주세요.]
            저녁: [저녁 식단 메뉴와 양(gram 수 혹은 개수) 및 목표와 질병관리에 어떻게 도움이 되는지 한줄로 말해주세요.]
            """)
        ]
    )
    chain = prompt_template | llm | StrOutputParser()

    prompt_data = {
        "user_id": user_id,
        "goal": goal,
        "diseases": diseases_str,
        "sleep": sleep,
        "record_summary":record_summary,
        "sleep_context": sleep_context
    }

    response = chain.invoke(prompt_data).strip()
    match = re.search(r"아침:(.*?)(점심:|저녁:|$)", response, re.DOTALL)
    breakfast = match.group(1).strip() if match else ""

    match = re.search(r"점심:(.*?)(저녁:|$)", response, re.DOTALL)
    lunch = match.group(1).strip() if match else ""

    match = re.search(r"저녁:(.*)", response, re.DOTALL)
    dinner = match.group(1).strip() if match else ""

    diet = [
        {"breakfast": breakfast},
        {"lunch": lunch},
        {"dinner": dinner},
    ]

    return {**state, "diet": diet}