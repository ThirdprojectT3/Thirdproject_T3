import React, { useState } from 'react';
import styled from 'styled-components';
import MainModal from '../components/main/MainModal';
import Header from '../components/header/Header';
import TodoList from '../components/main/Todolist';
import Calendar from '../components/main/Calendar';

const MainPage = () => {
  const [showModal, setShowModal] = useState(true);

  return (
    <>
      {showModal && <MainModal onClose={() => setShowModal(false)} />}
      {!showModal && (
        <MainPageWrapper>
          <Header/>
          <MainContent>
            <Calendar/>
            <TodoList/>
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

const Box = styled.div`
  flex: 1;
  min-width: 700px;
  min-height: 350px;
  border: 1.5px solid #222;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 48px;
  font-weight: 400;
  background: #fff;
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