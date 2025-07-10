from dotenv import load_dotenv
from langchain_openai import ChatOpenAI, OpenAIEmbeddings
load_dotenv()
#gpt-3.5-turbo => 빠름
#gpt-4o => 느린데 답변 정확
llm = ChatOpenAI(model_name="gpt-3.5-turbo", temperature=0.5)
embedding = OpenAIEmbeddings()
