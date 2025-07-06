import React, { useState } from "react";
import "./Todolist.css";

const TodoList = ({ selectedDate }) => {
  const [todos, setTodos] = useState([
    { id: 1, text: "오늘 할 일 1", completed: false },
    { id: 2, text: "오늘 할 일 2", completed: false },
    { id: 3, text: "오늘 할 일 3", completed: false },
  ]);

  const [newTodo, setNewTodo] = useState("");

  const handleAddTodo = () => {
    if (newTodo.trim() === "") return;
    setTodos([...todos, { id: Date.now(), text: newTodo, completed: false }]);
    setNewTodo("");
  };

  const toggleTodo = (id) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  // 삭제 함수 추가
  const handleDeleteTodo = (id) => {
    setTodos(todos.filter((todo) => todo.id !== id));
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
          <div className="todo-item" key={todo.id}>
            <div
              className={`checkbox ${todo.completed ? "checked" : ""}`}
              onClick={() => toggleTodo(todo.id)}
            />
            <div className="todo-text-wrapper">
              <span className={`todo-text ${todo.completed ? "completed" : ""}`}>
                {todo.text}
              </span>
            </div>
            <button
              className="delete-button"
              onClick={() => handleDeleteTodo(todo.id)}
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
