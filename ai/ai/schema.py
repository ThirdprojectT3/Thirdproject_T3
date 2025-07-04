from typing import TypedDict, List, Optional

class GenState(TypedDict):
    goal: str
    diseases: List[str]
    records: List[dict]
    todolists: List[dict]
    prompt: str
    place: str
    sleep_summary: Optional[str]
    sleep_effect: Optional[str]
    todo_items: Optional[List[dict]]
    todo_tips: Optional[List[dict]]
    diet: Optional[List[dict]]
    cheering: Optional[str]