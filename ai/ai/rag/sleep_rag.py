from langchain_community.vectorstores import FAISS
from langchain.chains import RetrievalQA
from ai import config

sleep_vectorstore = FAISS.load_local("ai/vectorstores/sleep_rag", config.embedding, allow_dangerous_deserialization=True)
sleep_rqa = RetrievalQA.from_chain_type(llm=config.llm, retriever=sleep_vectorstore.as_retriever(), return_source_documents=True)

def query_sleep_rag(query: str) -> str:
    return sleep_rqa.invoke(query)["result"].strip()