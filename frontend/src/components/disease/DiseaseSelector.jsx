import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const DISEASES = ['당뇨', '고혈압', '목디스크', '허리디스크', '기타', '없음'];

const DiseaseSelector = () => {
  const [selected, setSelected] = useState([]);
  const navigate = useNavigate();

  const handleSelect = (disease) => {
    if (disease === '없음') {
      setSelected(['없음']);
    } else {
      if (selected.includes('없음')) {
        setSelected([disease]);
      } else if (selected.includes(disease)) {
        setSelected(selected.filter((d) => d !== disease));
      } else {
        setSelected([...selected, disease]);
      }
    }
  };

  return (
    <Wrapper>
      <Title>질병 선택</Title>
      <Grid>
        {DISEASES.map((disease) => (
          <DiseaseBox
            key={disease}
            selected={selected.includes(disease)}
            onClick={() => handleSelect(disease)}
          >
            {disease}
          </DiseaseBox>
        ))}
      </Grid>
      <NextButton onClick={() => {
          console.log('선택된 질병 목록:', selected);
          navigate('/main')
      }}>
        다음
      </NextButton>
    </Wrapper>
  );
};

// styled-components
const Wrapper = styled.div`
  min-height: 100vh;
  background: #fff;
  position: relative;
  display: flex;
  flex-direction: column;
`;

const Title = styled.h2`
  text-align: center;
  font-size: 2.8rem;
  font-weight: 500;
  margin-top: 30px;
  margin-bottom: 60px;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 48px 48px;
  margin: 0 auto;
`;

const DiseaseBox = styled.div`
  height: 100px;
  background: ${({ selected }) => (selected ? '#bdbdbd' : '#ddd')};
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  font-weight: 500;
  cursor: pointer;
  user-select: none;
  transition: background 0.2s;
  padding: 24px 48px;
`;

const NextButton = styled.button`
  align-self: flex-end;
  margin-top: 48px;
  margin-bottom: 16px;
  padding: 18px 48px;
  font-size: 1.5rem;
  font-weight: 600;
  background: #000;
  color: #fff;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  transition: background 0.2s;
  &:hover {
    background: #444;
  }
`;

export default DiseaseSelector;