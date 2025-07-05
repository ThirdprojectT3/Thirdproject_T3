import React, { useState } from "react";
import styled from "styled-components";

const TodoList = () => {
  // 할 일 목록을 관리하는 state
  const [todos, setTodos] = useState([
    { id: 1, text: "오늘 할 일 1", completed: false },
    { id: 2, text: "오늘 할 일 2", completed: false },
    { id: 3, text: "오늘 할 일 3", completed: false },
  ]);

  // 새로운 할 일 입력을 관리하는 state
  const [newTodo, setNewTodo] = useState("");

  // 새로운 할 일을 추가하는 함수
  const handleAddTodo = () => {
    if (newTodo.trim() === "") return; // 입력값이 없으면 추가하지 않음
    setTodos([...todos, { id: Date.now(), text: newTodo, completed: false }]);
    setNewTodo(""); // 입력 필드 초기화
  };

  // 할 일 완료 상태를 토글하는 함수
  const toggleTodo = (id) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  return (
    <TodoContainer>
      <Title>Todo</Title>
      <TodoListWrapper>
        {todos.map((todo) => (
          <TodoItem key={todo.id}>
            <Checkbox
              checked={todo.completed}
              onClick={() => toggleTodo(todo.id)}
            />
            <TodoText completed={todo.completed}>{todo.text}</TodoText>
          </TodoItem>
        ))}
      </TodoListWrapper>

      {/* 새로운 할 일 추가 UI (이미지에는 없지만 일반적인 기능) */}
      <AddTodoWrapper>
        <Input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="새로운 할 일을 입력하세요"
        />
        <AddButton onClick={handleAddTodo}>추가</AddButton>
      </AddTodoWrapper>
    </TodoContainer>
  );
};

// --- Styled Components ---

const TodoContainer = styled.div`
  width: 100%;
  max-width: 400px;
  margin: 50px auto;
  padding: 20px;
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
`;

const Title = styled.h1`
  font-size: 32px;
  font-weight: bold;
  margin-bottom: 20px;
  color: #000000;
`;

const TodoListWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px; /* 항목 사이의 간격 */
`;

const TodoItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const Checkbox = styled.div`
  width: 28px;
  height: 28px;
  background-color: ${(props) => (props.checked ? "#a5a5a5" : "#e0e0e0")};
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.2s;
`;

const TodoText = styled.span`
  font-size: 18px;
  color: ${(props) => (props.completed ? "#a5a5a5" : "#000000")};
  text-decoration: ${(props) => (props.completed ? "line-through" : "none")};
`;

const AddTodoWrapper = styled.div`
  display: flex;
  margin-top: 30px;
  gap: 10px;
`;

const Input = styled.input`
  flex-grow: 1;
  border: 1px solid #e0e0e0;
  padding: 12px;
  border-radius: 8px;
  font-size: 16px;

  &:focus {
    outline: none;
    border-color: #a5a5a5;
  }
`;

const AddButton = styled.button`
  background-color: #000000;
  color: #ffffff;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.2s;

  &:hover {
    background-color: #333333;
  }
`;

export default TodoList;
