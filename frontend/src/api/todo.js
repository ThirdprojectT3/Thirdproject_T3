import axios from "./axios";

// 할 일 추가
export const postTodo = (todoData) => axios.post("/todos", todoData);


// 월별 투두 불러오기
export const fetchTodosByMonth = (userId, ym) =>
  axios.get(`/todos/month/${userId}`, { params: { ym } });

// 할 일 삭제
export const deleteTodo = (todoItemId) =>
  axios.delete(`/todos/${todoItemId}`);

// 할 일 완료 상태 토글(PATCH)
export const patchTodo = (todoItemId, todoData) =>
  axios.patch(`/todos/${todoItemId}`, todoData);