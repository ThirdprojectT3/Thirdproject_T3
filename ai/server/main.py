import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from fastapi import FastAPI
from server.routes import router

app = FastAPI(
    title="Health AI API",
    description="LangGraph + LangServe 기반 맞춤 운동/식단 추천 API",
    version="1.0.0"
)

app.include_router(router)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("server.main:app", host="0.0.0.0", port=8003, reload=True)
