from langchain_community.vectorstores import FAISS
from langchain.chains import RetrievalQA
from ai.config import llm, embedding
import os
from .doc_to_vector import load_doc, save_doc

VECTOR_PATH = "ai/vectorstores/tip_rag"
if not os.path.exists(VECTOR_PATH):
    docs = load_doc("data/workout_tips.txt")
    save_doc(docs, output_path=VECTOR_PATH)

tip_vectorstore = FAISS.load_local(VECTOR_PATH, embedding, allow_dangerous_deserialization=True)
tip_rqa = RetrievalQA.from_chain_type(llm=llm, retriever=tip_vectorstore.as_retriever(), return_source_documents=True)

async def aquery_tip_rag(query: str) -> str:
    return (await tip_rqa.ainvoke(query))["result"].strip()
# def query_tip_rag(query: str) -> str:
#     return tip_rqa.invoke(query)["result"].strip()