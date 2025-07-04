import React, { useState } from 'react';
import styled from 'styled-components';
import MainModal from '../components/main/MainModal';

const MainPage = () => {
  const [showModal, setShowModal] = useState(true);

  return (
    <>
      {showModal && <MainModal onClose={() => setShowModal(false)} />}
      {!showModal && (
        <MainPageWrapper>
          <Header>
            <HeaderButton>로그아웃</HeaderButton>
            <HeaderRight>
              <HeaderButton>통계분석</HeaderButton>
              <HeaderButton>회원이름</HeaderButton>
            </HeaderRight>
          </Header>
          <MainContent>
            <Box>달력</Box>
            <TodoBox>todolist</TodoBox>
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

const Header = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 32px;
  margin-bottom: 32px;
`;

const HeaderButton = styled.button`
  background: #e0e0e0;
  border: none;
  border-radius: 8px;
  padding: 12px 32px;
  font-size: 16px;
  font-weight: 500;
  margin-right: 32px;
  cursor: pointer;
`;

const HeaderRight = styled.div`
  display: flex;
  gap: 16px;
  margin-left: auto;
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

const TodoBox = styled(Box)`
  min-width: 400px;
  font-size: 40px;
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