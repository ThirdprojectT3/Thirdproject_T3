from langchain_community.vectorstores import FAISS
from ai import config
def get_sleep_context(sleep)->str:    
    vectorstore = FAISS.load_local(
        "ai/vectorstores/diet_rag",
        embeddings= config.embedding,
        allow_dangerous_deserialization=True
    )
    retriever = vectorstore.as_retriever()

    if isinstance(sleep, (int, float)):
        if sleep < 6:
            sleep_query = f"수면 부족({sleep}시간) 시 도움이 되는 영양소와 식단 추천"
        elif 6 <= sleep <= 8.5: 
            sleep_query = f"적정 수면({sleep}시간) 유지에 좋은 영양소 및 식단 가이드"
        else: 
            sleep_query = f"과도한 수면({sleep}시간) 시 고려할 영양소와 식단"
    else:
        sleep_query = "수면과 관련된 건강한 식단 조언"
        
    retrieved_sleep_docs = retriever.invoke(sleep_query)

    sleep_context = "\n".join([doc.page_content for doc in retrieved_sleep_docs])
    
    if not sleep_context.strip():
        sleep_context = "사용자의 수면 시간에 따른 특정 식단 가이드라인이 검색되지 않았습니다. 일반적인 건강 식단을 제안합니다."
    
    return sleep_context