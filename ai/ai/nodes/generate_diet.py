from ..schema import GenState
from ..config import llm
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from ..rag.diet_rag import get_sleep_context
import re
from .time_check import timeit

@timeit
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
            ("system", """당신은 개인 맞춤형 영양사 AI입니다. 아래 사용자 정보를 참고하여 아침, 점심, 저녁 식단을 제안해주세요.
                          각 끼니는 다음 형식을 따라야 합니다:
                        - 음식명 (양): 탄수화물 g / 단백질 g / 지방 g
                        - (총 2~4개 항목)
                        - 마지막 줄에는 해당 식단이 건강 목표와 질병 관리에 어떻게 도움이 되는지 한 문장으로 설명해주세요."""),
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
            위 정보를 바탕으로 아래 형식에 맞춰 구체적인 식단을 제안해주세요.

            [응답 형식]
            아침:
            - 스크램블 에그 (2개): 탄수화물 2g / 단백질 12g / 지방 10g
            - 귀리 (30g): 탄수화물 20g / 단백질 4g / 지방 2g
            설명: 고단백 저지방 식단으로 근력 향상에 도움이 됩니다.
            점심: 
             (동일 형식)
            저녁: 
             (동일 형식)
            """)
        ]
    ) #프롬프트 간결하게 수정

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