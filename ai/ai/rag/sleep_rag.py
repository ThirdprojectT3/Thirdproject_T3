from langchain_community.vectorstores import FAISS
from langchain.chains import RetrievalQA
from ai import config
import os
from .doc_to_vector import load_doc, save_doc

VECTOR_PATH = "ai/vectorstores/sleep_rag"
if not os.path.exists(VECTOR_PATH):
    docs = load_doc("data/sleep_performance.pdf")
    save_doc(docs, output_path=VECTOR_PATH)

sleep_vectorstore = FAISS.load_local(VECTOR_PATH, config.embedding, allow_dangerous_deserialization=True)
sleep_rqa = RetrievalQA.from_chain_type(llm=config.llm, retriever=sleep_vectorstore.as_retriever(), return_source_documents=True)

def query_sleep_rag(query: str) -> str:
    return sleep_rqa.invoke(query)["result"].strip()