import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

const workoutPlaces = ['헬스장', '맨몸', '크로스핏', '쉬기'];

const MainModal = ({ onClose }) => {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    weight: '',
    fat: '',
    muscle: '',
    bmr: '',
    bmi: '',
    visceral: '',
    sleep: '',
    workoutPart: '',
    workoutPlace: '',
  });

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setForm(prev => ({ ...prev, [id]: value }));
  };

  const handlePlaceSelect = (place) => {
  setForm(prev => ({
      ...prev,
      workoutPlace: place,
      workoutPart: place === '쉬기' ? '' : prev.workoutPart,
  }));
};

  const handleSubmitStep1 = (e) => {
    e.preventDefault();
    setStep(2);
  };

  const handleSubmitStep2 = (e) => {
    e.preventDefault();

    const orderedForm = {
        weight: form.weight,
        fat: form.fat,
        muscle: form.muscle,
        bmr: form.bmr,
        bmi: form.bmi,
        visceral: form.visceral,
        sleep: form.sleep,
        workoutPart: form.workoutPart,
        workoutPlace: form.workoutPlace,
    };

    console.log('최종 입력값:', orderedForm);
  // fetch('/api/your-endpoint', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(orderedForm)
  // });

    if (onClose) onClose();
  };

  
  return (
    <ModalOverlay>
      <ModalContent>
        <ModalTitle>정보 입력</ModalTitle>
        <div style={{ height: "6rem" }} />
        {step === 1 && (
          <StyledForm onSubmit={handleSubmitStep1}>
            <TwoColumnGrid>
              <InputGroup>
                <Label htmlFor="weight">몸무게 (kg)</Label>
                <Input id="weight" type="number" placeholder="몸무게를 입력하세요" value={form.weight} onChange={handleChange} />
              </InputGroup>
              <InputGroup>
                <Label htmlFor="fat">체지방량 (kg)</Label>
                <Input id="fat" type="number" placeholder="체지방량을 입력하세요" value={form.fat} onChange={handleChange} />
              </InputGroup>
              <InputGroup>
                <Label htmlFor="muscle">골격근량 (kg)</Label>
                <Input id="muscle" type="number" placeholder="골격근량을 입력하세요" value={form.muscle} onChange={handleChange} />
              </InputGroup>
              <InputGroup>
                <Label htmlFor="bmr">기초대사량 (kcal)</Label>
                <Input id="bmr" type="number" placeholder="기초대사량을 입력하세요" value={form.bmr} onChange={handleChange} />
              </InputGroup>
              <InputGroup>
                <Label htmlFor="bmi">BMI</Label>
                <Input id="bmi" type="number" step="0.1" placeholder="BMI를 입력하세요" value={form.bmi} onChange={handleChange} />
              </InputGroup>
              <InputGroup>
                <Label htmlFor="visceral">내장 지방 지수</Label>
                <Input id="visceral" type="number" placeholder="내장 지방 지수를 입력하세요" value={form.visceral} onChange={handleChange} />
              </InputGroup>
              <InputGroup>
                <Label htmlFor="sleep">수면 시간</Label>
                <Input id="sleep" type="number" placeholder="금일 수면 시간을 입력하세요" value={form.sleep} onChange={handleChange} />
              </InputGroup>
            </TwoColumnGrid>
            <SaveButton type="submit">다음</SaveButton>
          </StyledForm>
        )}
        {step === 2 && (
            <StyledForm onSubmit={handleSubmitStep2}>
                <InputGroup style={{ width: '100%' }}>
                <Label>운동 위치</Label>
                <CategoryRow>
                    {workoutPlaces.map((place) => (
                    <CategoryButton
                        key={place}
                        type="button"
                        selected={form.workoutPlace === place}
                        onClick={() => handlePlaceSelect(place)}
                    >
                        {place}
                    </CategoryButton>
                    ))}
                </CategoryRow>
                </InputGroup>
                {/* 운동 위치가 '헬스장', '맨몸', '크로스핏' 중 하나일 때만 운동 선호 부위 요청 입력칸 표시 */}
                {(form.workoutPlace === '헬스장' ||
                form.workoutPlace === '맨몸' ||
                form.workoutPlace === '크로스핏') && (
                <InputGroup style={{ width: '100%' }}>
                    <Label htmlFor="workoutPart">운동 선호 부위 요청</Label>
                    <Input
                    id="workoutPart"
                    type="text"
                    placeholder="운동 선호 부위를 요청해보세요. ex) 오늘은 등 운동 루틴을 만들어줘"
                    value={form.workoutPart}
                    onChange={handleChange}
                    />
                </InputGroup>
                )}
                <ButtonRow>
                <PrevButton type="button" onClick={() => setStep(1)}>이전</PrevButton>
                <SaveButton type="submit">저장하기</SaveButton>
                </ButtonRow>
            </StyledForm>
            )}
      </ModalContent>
    </ModalOverlay>
  );
};

const ModalOverlay = styled.div`
  position: fixed;
  top: 0; left: 0;
  width: 100vw; height: 100vh;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: #fff;
  padding: 2rem;
  border-radius: 8px;
  width: 80vw;
  max-width: 1152px;
  min-width: 520px;
  height: 80vh;
  max-height: 819.2px;
  min-height: 150px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.2);
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  align-items: center;
  position: relative;
`;

const ModalTitle = styled.h2`
  font-size: 2.5rem;
  font-weight: bold;
  margin: 0;
  margin-bottom: 2rem;
  position: absolute;
  top: 2.5rem;
  left: 0;
  right: 0;
  text-align: center;
`;

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  width: 100%;
  align-items: center;
  flex: 1 1 auto;
  justify-content: flex-start;
  position: relative;
`;

const TwoColumnGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem 2rem;
  width: 100%;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
`;

const Label = styled.label`
  font-weight: 700;
  font-size: 14px;
  margin-bottom: 0;
  text-align: left;
`;

const Input = styled.input`
  padding: 0.5rem;
  height: 30px;
  border: 1px solid #ccc;
  border-radius: 4px;
  transition: border-color 0.2s;
  &:hover {
    border-color: #1976d2;
  }
`;

const ButtonRow = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  width: 100%;
  position: absolute;
  left: 0;
  bottom: 2rem;
`;

const PrevButton = styled.button`
  padding: 0.7rem 2.5rem;
  background: #e0e0e0;
  color: #222;
  border: solid 2px #e0e0e0;
  border-radius: 10px;
  font-weight: bold;
  cursor: pointer;
  font-size: 1.1rem;
  height: 48px;
  transition: background 0.2s, color 0.2s, border-color 0.2s;
  &:hover {
    background: #bdbdbd;
    border-color: #bdbdbd;
  }
`;

const SaveButton = styled.button`
  padding: 0.7rem 2.5rem;
  background: rgb(0, 0, 0);
  color: #fff;
  border: solid 2px #000;
  border-radius: 10px;
  font-weight: bold;
  cursor: pointer;
  font-size: 1.1rem;
  height: 48px;
  transition: background 0.2s, border-color 0.2s;
  &:hover {
    border-color: #1565c0;
    background: #222;
  }
`;

const CategoryRow = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 0.5rem;
`;

const CategoryButton = styled.button`
  padding: 0.7rem 1.5rem;
  border: 2px solid ${({ selected }) => (selected ? '#1976d2' : '#ccc')};
  background: ${({ selected }) => (selected ? '#e3f0fc' : '#fff')};
  color: #222;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: border-color 0.2s, background 0.2s;
  &:hover {
    border-color: #1976d2;
  }
`;

export default MainModal;