import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import MainModal from '../components/main/MainModal';
import Header from '../components/header/Header';
import TodoList from '../components/main/Todolist';
import Calendar from '../components/main/Calendar';
import Toast from '../components/toast/Toast';
import ErrToast from '../components/toast/ErrToast';

const MainPage = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [showErrToast, setShowErrToast] = useState(false);
  const [errToastMessage, setErrToastMessage] = useState('');


  useEffect(() => {
    const token = sessionStorage.getItem('jwtToken');
    if (!token) {
      navigate('/', { replace: true });
    }
  }, [navigate]);

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

  return (
    <>
      {showToast && <Toast message={toastMessage} />}
      {showErrToast && (<ErrToast message={errToastMessage} onClose={() => setShowErrToast(false)} />)}
      {showModal && <MainModal onClose={() => setShowModal(false)} triggerToast={triggerToast} triggerErrToast={triggerErrToast} />}
      {!showModal && (
        <MainPageWrapper>
          <Header/>
          <MainContent>
            <Calendar selectedDate={selectedDate} setSelectedDate={setSelectedDate} />
            <TodoList selectedDate={selectedDate} />
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