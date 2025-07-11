import React, { useState, useEffect } from "react";
import { postTodo, deleteTodo, patchTodo } from "../../api/todo";
import "./Todolist.css";

const TodoList = ({ selectedDate, triggerErrToast, triggerToast, monthTodos, onTodoAdded }) => {
  const [newTodo, setNewTodo] = useState("");
  const [tipInfo, setTipInfo] = useState({ show: false, tip: "", x: 0, y: 0, full: false });

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

  // tip: hover시 "tip", 클릭시 실제 tip
  const handleTextMouseEnter = (e) => {
    setTipInfo({
      show: true,
      tip: "tip보기",
      x: e.clientX + 10,
      y: e.clientY + 10,
      full: false,
    });
  };

  const handleTextMouseMove = (e) => {
    setTipInfo(info => info.show ? { ...info, x: e.clientX + 10, y: e.clientY + 10 } : info);
  };

  const handleTextMouseLeave = () => {
    setTipInfo({ show: false, tip: "", x: 0, y: 0, full: false });
  };

  const handleTextClick = (e, tip) => {
    e.stopPropagation();
    setTipInfo({
      show: true,
      tip,
      x: e.clientX + 10,
      y: e.clientY + 10,
      full: true,
    });
  };

  // 바깥 클릭 시 tip 닫기
  useEffect(() => {
    if (!tipInfo.full) return;
    const closeTip = () => setTipInfo({ show: false, tip: "", x: 0, y: 0, full: false });
    window.addEventListener("mousedown", closeTip);
    return () => window.removeEventListener("mousedown", closeTip);
  }, [tipInfo.full]);

  // 숫자로 시작하는 todoitem이 있으면 오름차순 정렬
  const sortedTodos = [...todos].sort((a, b) => {
    const numA = parseInt(a.todoitem, 10);
    const numB = parseInt(b.todoitem, 10);

    const isNumA = !isNaN(numA) && /^\d/.test(a.todoitem);
    const isNumB = !isNaN(numB) && /^\d/.test(b.todoitem);

    if (isNumA && isNumB) {
      return numA - numB;
    }
    if (isNumA) return -1;
    if (isNumB) return 1;
    return 0;
  });

  return (
    <div className="todo-container" style={{ position: "relative" }}>
      <h1 className="title">
        Todo{" "}
        <span style={{ fontSize: "1.5rem", fontWeight: "normal", marginLeft: "12px" }}>
          {selectedDate &&
            `${selectedDate.getFullYear()}.${String(selectedDate.getMonth() + 1).padStart(2, "0")}.${String(selectedDate.getDate()).padStart(2, "0")}`}
        </span>
      </h1>

      <div className="todo-list-wrapper">
        {sortedTodos.map((todo) => (
          <div className="todo-item" key={todo.todoItemId}>
            <label className="checkbox container">
              <input
                type="checkbox"
                checked={todo.complete}
                onChange={() => handleToggleComplete(todo)}
              />
              <svg viewBox="0 0 64 64" height="2em" width="2em">
                <path d="M 0 16 V 56 A 8 8 90 0 0 8 64 H 56 A 8 8 90 0 0 64 56 V 8 A 8 8 90 0 0 56 0 H 8 A 8 8 90 0 0 0 8 V 16 L 32 48 L 64 16 V 8 A 8 8 90 0 0 56 0 H 8 A 8 8 90 0 0 0 8 V 56 A 8 8 90 0 0 8 64 H 56 A 8 8 90 0 0 64 56 V 16" pathLength="575.0541381835938" class="path"></path>
              </svg>
            </label>
            <div className="todo-text-wrapper">
              <span
                className={`todo-text ${todo.complete ? "completed" : ""}`}
                onMouseEnter={todo.tip ? handleTextMouseEnter : undefined}
                onMouseMove={todo.tip ? handleTextMouseMove : undefined}
                onMouseLeave={todo.tip ? handleTextMouseLeave : undefined}
                onClick={todo.tip ? (e) => handleTextClick(e, todo.tip) : undefined}
                style={{ cursor: todo.tip ? "pointer" : "default" }}
              >
                {todo.todoitem}
              </span>
            </div>
            <button
              className="delete-button"
              onClick={() => handleDeleteTodo(todo.todoItemId)}
            >
              <svg viewBox="0 0 15 17.5" height="17.5" width="15" xmlns="http://www.w3.org/2000/svg" class="icon">
                <path transform="translate(-2.5 -1.25)" d="M15,18.75H5A1.251,1.251,0,0,1,3.75,17.5V5H2.5V3.75h15V5H16.25V17.5A1.251,1.251,0,0,1,15,18.75ZM5,5V17.5H15V5Zm7.5,10H11.25V7.5H12.5V15ZM8.75,15H7.5V7.5H8.75V15ZM12.5,2.5h-5V1.25h5V2.5Z" id="Fill"/>
              </svg>
            </button>
          </div>
        ))}
      </div>
      {tipInfo.show && tipInfo.tip && (
        <div
          className="tip-popup"
          style={{
            top: tipInfo.y,
            left: tipInfo.x,
          }}
        >
          {tipInfo.full ? tipInfo.tip : "tip보기"}
        </div>
      )}
      <div className="add-todo-wrapper">
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="새로운 할 일을 입력하세요"
          className="input"
        />
        <button onClick={handleAddTodo} className="add-button">
          <svg className="plusIcon" viewBox="0 0 24 24">
            <rect x="10" y="4" width="4" height="16" rx="2"/>
            <rect x="4" y="10" width="16" height="4" rx="2"/>
          </svg>
        </button>
      </div>
    </div>
  );
};

export default TodoList;