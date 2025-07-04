from langchain.vectorstores import FAISS
from langchain.chains import RetrievalQA
from ai.config import llm, embedding

tip_vectorstore = FAISS.load_local("ai/vectorstores/tip_rag", embedding, allow_dangerous_deserialization=True)
tip_rqa = RetrievalQA.from_chain_type(llm=llm, retriever=tip_vectorstore.as_retriever(), return_source_documents=True)

def query_tip_rag(query: str) -> str:
    return tip_rqa.invoke(query)["result"].strip()