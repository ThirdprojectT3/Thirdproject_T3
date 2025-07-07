import axios from "./axios";

// 할 일 추가
export const postTodo = (todoData) => {
  const token = sessionStorage.getItem('jwtToken');
  return axios.post("/todos", todoData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// 월별 투두 불러오기
export const fetchTodosByMonth = (userId, ym) => {
  const token = sessionStorage.getItem('jwtToken');
  return axios.get(`/todos/month/${userId}`, {
    params: { ym },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// 할 일 삭제
export const deleteTodo = (todoItemId) => {
  const token = sessionStorage.getItem('jwtToken');
  return axios.delete(`/todos/${todoItemId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// 할 일 완료 상태 토글(PATCH)
export const patchTodo = (todoItemId, todoData) => {
  const token = sessionStorage.getItem('jwtToken');
  return axios.patch(`/todos/${todoItemId}`, todoData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};