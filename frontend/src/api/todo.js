import axios from "./axios";

// 할 일 추가
export const postTodo = (todoData) => axios.post("/todos", todoData);


// 월별 투두 불러오기
export const fetchTodosByMonth = (ym) => {
  console.log("월별 투두 요청 전송:", ym); // 요청 전 log

  return axios
    .get(`/todos/month`, { params: { ym }, withCredentials: true })
    .then(res => {
      console.log("월별 투두 응답 데이터:", res.data); // 응답 성공 log
      return res;
    })
    .catch(err => {
      console.error("월별 투두 요청 실패:", err); // 에러 log
      throw err;
    });
};
// 할 일 삭제
export const deleteTodo = (todoItemId) =>
  axios.delete(`/todos/${todoItemId}`);

// 할 일 완료 상태 토글(PATCH)
export const patchTodo = (todoItemId, todoData) =>
  axios.patch(`/todos/${todoItemId}`, todoData);