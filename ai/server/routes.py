from fastapi import APIRouter
from langserve import add_routes
from ai.graph_builder import build_graph
from fastapi.responses import StreamingResponse
from typing import AsyncIterator
import json

router = APIRouter()

# 1. 기존 동기식 엔드포인트 유지
# graph_app = build_graph()
# add_routes(
#     router,
#     graph_app,
#     path="/healthai"
# )

@router.post("/healthai/invoke")
async def custom_invoke(input_data: dict):
    graph = build_graph()
    result = await graph.ainvoke(input_data["input"])
    return result.get("output", {"error": "No output generated"})

# 2. 스트리밍 엔드포인트 추가
@router.post("/healthai/stream")
async def stream_healthai(input_data: dict):
    """기존 입력 형식을 그대로 사용하는 스트리밍 엔드포인트"""
    graph = build_graph()
    
    # 출력 정제 함수
    def refine_output(raw: dict) -> dict:
        final_data = raw.get("output", {})
        return {
            "recommendations": {
                "todos": [{"task": x["todoItem"], "tip": x["tip"]} 
                         for x in final_data.get("todolists", [])],
                "diet": final_data.get("diet", [])
            },
            "motivation": final_data.get("cheering", "")
        }

    # 스트리밍 생성기
    async def generate_stream():
        print("Streaming started") 
        async for chunk in graph.astream(input_data["input"]):
            print("Chunk received:", chunk)
            if "output" in chunk:
                yield f"data: {json.dumps(refine_output(chunk['output']))}\n\n"
            elif "error" in chunk:
                yield f"error: {json.dumps(chunk['error'])}\n\n"

    return StreamingResponse(
        generate_stream(),
        media_type="text/event-stream"
    )