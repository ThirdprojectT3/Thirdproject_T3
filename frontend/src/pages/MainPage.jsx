import React, { useState } from 'react';
import styled from 'styled-components';
import MainModal from '../components/main/MainModal';
import Header from '../components/header/Header';
import TodoList from '../components/main/Todolist';
import Calendar from '../components/main/Calendar';
import Toast from '../components/toast/Toast';
import ErrToast from '../components/toast/ErrToast';
import { fetchTodosByMonth } from "../api/todo";
import Loading from '../components/loading/Loading';
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

const MainPage = () => {
  const [showModal, setShowModal] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [showErrToast, setShowErrToast] = useState(false);
  const [errToastMessage, setErrToastMessage] = useState('');
  const [monthTodos, setMonthTodos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  const triggerErrToast = (msg) => {
    setErrToastMessage(msg);
    setShowErrToast(true);
    setTimeout(() => setShowErrToast(false), 2000);
  };

  let userId = null;
  const token = Cookies.get('jwtToken');
  if (token) {
    try {
      const decoded = jwtDecode(token);
      userId = decoded.userId;
    } catch {
      userId = null;
    }
  }

  // 월별 todo 동기화 함수
  const syncMonthTodos = () => {
    const ym = `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, "0")}`;
    if (userId) {
      fetchTodosByMonth(userId, ym).then(res => setMonthTodos(res.data));
    }
  };

  return (
    <>
      {isLoading && <Loading fullscreen />}
      {showToast && <Toast message={toastMessage} />}
      {showErrToast && <ErrToast message={errToastMessage} onClose={() => setShowErrToast(false)} />}
      {showModal && <MainModal 
        onClose={() => setShowModal(false)}
        triggerToast={triggerToast}
        triggerErrToast={triggerErrToast}
        setIsLoading={setIsLoading}
        onSaved={syncMonthTodos}
      />}
      {!showModal && (
        <MainPageWrapper>
          <Header />
          <MainContent>
            <Calendar
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
              setMonthTodos={setMonthTodos}
              userId={userId}
              monthTodos={monthTodos}
            />
            <TodoList
              selectedDate={selectedDate}
              triggerErrToast={triggerErrToast}
              triggerToast={triggerToast}
              monthTodos={monthTodos}
              onTodoAdded={syncMonthTodos}
            />
          </MainContent>
          <MealBox>식단</MealBox>
        </MainPageWrapper>
      )}
    </>
  );
};

const MainPageWrapper = styled.div`
  min-height: 100vh;
  background: #fff;
  padding: 32px;
`;

const MainContent = styled.div`
  display: flex;
  gap: 32px;
  margin-bottom: 32px;
`;

const MealBox = styled.div`
  min-width: 100%;
  min-height: 180px;
  border: 1.5px solid #222;
  border-radius: 8px;
  margin-top: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 40px;
  font-weight: 400;
  background: #fff;
`;

export default MainPage;
