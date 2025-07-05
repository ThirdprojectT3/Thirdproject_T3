from fastapi import APIRouter
from langserve import add_routes
from ai.graph_builder import build_graph
from ai.nodes import format_output
router = APIRouter()

# LangGraph 앱 불러오기
graph_app = build_graph()

# LangGraph 앱을 "/healthai" 경로로 등록
add_routes(
    router,
    graph_app,
    path="/healthai"
)
@router.post("/healthai/stream")
async def stream_healthai(input_data: dict):
    """기존 입력 형식을 그대로 사용하는 스트리밍 엔드포인트"""
    graph = build_graph()
    
    # 출력 정제 함수
    def refine_output(raw: dict) -> dict:
        return {
            "recommendations": {
                "todos": [{"task": x["todoItem"], "tip": x["tip"]} 
                         for x in raw.get("todo_tips", [])],
                "diet": raw.get("diet", [])
            },
            "motivation": raw.get("cheering", "")
        }

    # 스트리밍 생성기
    async def generate_stream():
        async for chunk in graph.astream(input_data):
            if "output" in chunk:
                yield f"data: {json.dumps(refine_output(chunk['output']))}\n\n"
            elif "error" in chunk:
                yield f"error: {json.dumps(chunk['error'])}\n\n"

    return StreamingResponse(
        generate_stream(),
        media_type="text/event-stream"
    )