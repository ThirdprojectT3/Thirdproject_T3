import React from "react";
import styled from "styled-components";
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();
  return (
    <HeaderContainer>
      <Button onClick={() => navigate('/')}>로그아웃</Button>
      <ButtonGroup>
        <Button onClick={() => navigate('/graph')}>통계분석</Button>
        <Button onClick={() => navigate('/profile')}>회원이름</Button>
      </ButtonGroup>
    </HeaderContainer>
  );
};

const HeaderContainer = styled.div`
  width: 100%;
  height: 100px;
  background-color: #ffffff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
`;

const Button = styled.button`
  background-color: #e0e0e0;
  border: none;
  padding: 12px 32px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;

  &:hover {
    background-color: #d5d5d5;
  }
`;

export default Header;
