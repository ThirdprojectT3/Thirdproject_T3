import os
import hashlib
from typing import List, Dict, Any, Optional
from langchain_community.document_loaders import PyPDFLoader, TextLoader
from langchain_community.document_loaders import Docx2txtLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_core.documents import Document
import logging

logger = logging.getLogger(__name__)

class DocumentProcessor:
    def __init__(self, chunk_size: int = 1000, chunk_overlap: int = 200):
        self.chunk_size = chunk_size
        self.chunk_overlap = chunk_overlap
        self.text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=chunk_size,
            chunk_overlap=chunk_overlap,
            length_function=len,
            separators=["\n\n", "\n", ".", " ", ""]
        )
        
    def load_document(self, file_path: str, metadata: Optional[Dict[str, Any]] = None) -> List[Document]:
        file_extension = os.path.splitext(file_path)[1].lower()
        
        try:
            if file_extension == '.pdf':
                loader = PyPDFLoader(file_path)
            elif file_extension in ['.txt', '.md']:
                loader = TextLoader(file_path, encoding='utf-8')
            elif file_extension == '.docx':
                loader = Docx2txtLoader(file_path)
            else:
                raise ValueError(f"지원하지 않는 파일 형식: {file_extension}")
            
            documents = loader.load()
            
            # 메타데이터 추가
            for doc in documents:
                if metadata:
                    doc.metadata.update(metadata)
                doc.metadata['file_path'] = file_path
                doc.metadata['file_type'] = file_extension
                doc.metadata['content_hash'] = self._generate_content_hash(doc.page_content)
            
            return documents
            
        except Exception as e:
            logger.error(f"문서 로딩 실패: {file_path}, 오류: {str(e)}")
            raise
    
    def split_documents(self, documents: List[Document]) -> List[Document]:
        """문서를 청크로 분할합니다."""
        try:
            chunks = self.text_splitter.split_documents(documents)
            
            # 청크에 인덱스 추가
            for i, chunk in enumerate(chunks):
                chunk.metadata['chunk_index'] = i
                chunk.metadata['chunk_size'] = len(chunk.page_content)
            
            logger.info(f"문서 분할 완료: {len(chunks)}개 청크 생성")
            return chunks
            
        except Exception as e:
            logger.error(f"문서 분할 실패: {str(e)}")
            raise
    
    def process_file(self, file_path: str, metadata: Optional[Dict[str, Any]] = None) -> List[Document]:
        """파일을 로드하고 분할합니다."""
        documents = self.load_document(file_path, metadata)
        chunks = self.split_documents(documents)
        return chunks
    
    def _generate_content_hash(self, content: str) -> str:
        """콘텐츠의 해시값을 생성합니다."""
        return hashlib.md5(content.encode()).hexdigest()