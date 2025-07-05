from langchain_community.document_loaders import PyPDFLoader, TextLoader
from langchain_community.vectorstores import FAISS
from langchain_openai import OpenAIEmbeddings  
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_core.documents import Document
from typing import List
from dotenv import load_dotenv
import os

load_dotenv()
api_key = os.getenv("OPENAI_API_KEY")

def load_doc(data_path: str)-> List[Document]:
    if not os.path.exists(data_path):
        raise FileNotFoundError(f"파일 경로가 잘못되었습니다: {data_path}")
    
    if data_path.endswith(".pdf"):
        loader = PyPDFLoader(data_path)
    elif data_path.endswith(".txt"):
        loader = TextLoader(data_path, encoding = "utf-8")
    else:
        raise ValueError("지원하지 않는 파일 형식입니다.")
    
    documents = loader.load()
    
    return documents

def save_doc(documents: List[Document], chunk_size: int, chunk_overlap: int, output_path: str)->None:
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size= chunk_size, 
        chunk_overlap= chunk_overlap,
        separators=["\n\n", "\n", ".", " ", ""]
    )
    split_docs = text_splitter.split_documents(documents)

    embedding = OpenAIEmbeddings()
    vectorstore = FAISS.from_documents(split_docs, embedding)

    os.makedirs(output_path, exist_ok=True)
    vectorstore.save_local(output_path)

