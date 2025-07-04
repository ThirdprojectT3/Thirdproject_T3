from dotenv import load_dotenv
import os
from langchain_openai import ChatOpenAI, OpenAIEmbeddings
load_dotenv()

llm = ChatOpenAI(model_name="gpt-4o", temperature=0.5)
embedding = OpenAIEmbeddings()
