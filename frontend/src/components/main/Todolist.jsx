import React, { useState } from "react";
import { postTodo, deleteTodo, patchTodo } from "../../api/todo";
import "./Todolist.css";

const TodoList = ({ selectedDate, triggerErrToast, triggerToast, monthTodos, onTodoAdded }) => {
  const [newTodo, setNewTodo] = useState("");

  const getDateString = (dateObj) => {
    return `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, "0")}-${String(dateObj.getDate()).padStart(2, "0")}`;
  };

  const todos = monthTodos.filter(todo => todo.date === getDateString(selectedDate));

  const handleAddTodo = async () => {
    if (newTodo.trim() === "") {
      if (triggerErrToast) triggerErrToast("공백은 등록할 수 없습니다.");
      setNewTodo("");
      return;
    }

    const todoData = {
      todoitem: newTodo,
      complete: false,
      date: getDateString(selectedDate),
    };

    console.log("백엔드로 전송되는 todoData:", todoData);

    try {
      await postTodo(todoData);
      setNewTodo("");
      if (onTodoAdded) onTodoAdded();
      if (triggerToast) triggerToast("등록 성공!");
    } catch {
      if (triggerErrToast) {
        triggerErrToast("할 일 추가 실패");
      }
    }
  };

  // 삭제 핸들러
  const handleDeleteTodo = async (todoItemId) => {
    try {
      await deleteTodo(todoItemId);
      if (onTodoAdded) onTodoAdded(); // 삭제 후 목록 갱신
      if (triggerToast) triggerToast("삭제 성공!");
    } catch {
      if (triggerErrToast) triggerErrToast("삭제 실패");
    }
  };

  // 체크박스 클릭 시 complete 토글 PATCH
  const handleToggleComplete = async (todo) => {
    const updatedTodo = {
      todoitem: todo.todoitem,
      complete: !todo.complete,
      date: todo.date,
    };
    try {
      await patchTodo(todo.todoItemId, updatedTodo);
      if (onTodoAdded) onTodoAdded(); // 상태 갱신
    } catch {
      if (triggerErrToast) triggerErrToast("상태 변경 실패");
    }
  };

  return (
    <div className="todo-container">
      <h1 className="title">
        Todo{" "}
        <span style={{ fontSize: "1.5rem", fontWeight: "normal", marginLeft: "12px" }}>
          {selectedDate &&
            `${selectedDate.getFullYear()}.${String(selectedDate.getMonth() + 1).padStart(2, "0")}.${String(selectedDate.getDate()).padStart(2, "0")}`}
        </span>
      </h1>

      <div className="todo-list-wrapper">
        {todos.map((todo) => (
          <div className="todo-item" key={todo.todoItemId}>
            <div
              className={`checkbox ${todo.complete ? "checked" : ""}`}
              onClick={() => handleToggleComplete(todo)}
            />
            <div className="todo-text-wrapper">
              <span className={`todo-text ${todo.complete ? "completed" : ""}`}>
                {todo.todoitem}
              </span>
            </div>
            <button
              className="delete-button"
              onClick={() => handleDeleteTodo(todo.todoItemId)}
            >
              삭제
            </button>
          </div>
        ))}
      </div>

      <div className="add-todo-wrapper">
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="새로운 할 일을 입력하세요"
          className="input"
        />
        <button onClick={handleAddTodo} className="add-button">
          추가
        </button>
      </div>
    </div>
  );
};

export default TodoList;