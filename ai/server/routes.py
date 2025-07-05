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
