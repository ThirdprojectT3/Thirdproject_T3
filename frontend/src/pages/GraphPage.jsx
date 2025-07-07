import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const GraphPage = () => {
  const navigate = useNavigate();
  const [selected, setSelected] = useState('week');

  return (
    <GraphPageWrapper>
       <HomeButton onClick={() => navigate('/main')}>home</HomeButton>
      <GraphBox>
        메인 팝업에서 입력한 값으로<br />
        내 나이대 평균과 비교 그래프
      </GraphBox>
      <ButtonRow>
        <SmallButton
          style={{ background: selected === 'week' ? '#bdbdbd' : '#e0e0e0' }}
          onClick={() => setSelected('week')}
        >
          일주일
        </SmallButton>
        <SmallButton
          style={{ background: selected === 'month' ? '#bdbdbd' : '#e0e0e0' }}
          onClick={() => setSelected('month')}
        >
          한달
        </SmallButton>
      </ButtonRow>
      <GraphBox>
        {selected === 'week' ? '일주일 변화율 그래프' : '한달 변화율 그래프'}
      </GraphBox>
    </GraphPageWrapper>
  );
};

const GraphPageWrapper = styled.div`
  min-height: 100vh;
  min-width: 1000px;
  background: #fff;
  padding: 32px;
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
  display: flex;
  flex-direction: column;
`;

const HomeButton = styled.button`
  z-index: 10;
  background: #e0e0e0;
  border: none;
  border-radius: 8px;
  padding: 10px 24px;
  font-size: 18px;
  font-weight: 500;
  margin-bottom: 24px;
  cursor: pointer;
  align-self: flex-start;
`;

const GraphBox = styled.div`
  width: 100%;
  min-height: 260px;
  border: 1.5px solid #222;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.8rem;
  font-weight: 400;
  background: #fff;
  margin-bottom: 36px;
`;

const ButtonRow = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 18px;
`;

const SmallButton = styled.button`
  background: #e0e0e0;
  border: none;
  border-radius: 8px;
  padding: 8px 22px;
  font-size: 18px;
  font-weight: 500;
  cursor: pointer;
`;

export default GraphPage;