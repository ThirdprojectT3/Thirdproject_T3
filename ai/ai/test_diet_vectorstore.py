from doc_to_vector import load_doc, save_doc
from dotenv import load_dotenv
import os

load_dotenv() 
api_key = os.getenv("OPENAI_API_KEY")

def test_vectorization():
    data_path = "../data/Effects of Diet on Sleep Quality.pdf"
    output_path = "vectorstores/diet_rag"  # 저장 경로

    print("\n[1] 문서 로딩 중...")
    docs = load_doc(data_path)

    print(f"[2] 문서 {len(docs)}개 로드됨. 벡터화 진행 중...")
    save_doc(docs, chunk_size=500, chunk_overlap=50, output_path=output_path)
    print("[3] 벡터 DB 저장 완료!")


if __name__ == "__main__":
    test_vectorization()
    