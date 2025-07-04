import React from "react";
import styled from "styled-components";

// 실제로는 props로 유저의 기존 정보를 받아오기

export default function ProfileForm() {

  //이런 거
//   const [formData, setFormData] = useState(userInfo);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prevData) => ({
//       ...prevData,
//       [name]: value,
//     }));
//   };

  const handleUpdate = (e) => {
    e.preventDefault();
    // 여기에 실제 정보 수정 로직을 구현
    console.log("정보 수정 시도");
  };

  const handleCancel = () => {
    // setFormData(userInfo);
    // 취소 로직 (예: 이전 페이지로 돌아가기)
    console.log("수정 취소");
  };

  return (
    <Container>
      <Title>내 정보</Title>
      <Form onSubmit={handleUpdate}>
        <InputGroup>
          <Label>Email</Label>
          {/* 실제로는 value prop에 기존 데이터를 넣어줍니다. */}
          <Input type="email" placeholder="Value" />
          {/* <Input 
            type="email"
            name="email" // state의 key와 일치
            value={formData.email} 
            onChange={handleChange}
          /> */}
        </InputGroup>

        <InputGroup>
          <Label>Name</Label>
          <Input type="text" placeholder="Value" />
          {/* <Input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
          /> */}
        </InputGroup>

        <InputGroup>
          <Label>Password</Label>
          {/* 비밀번호는 보통 새로 입력받습니다. */}
          <Input type="password" placeholder="새 비밀번호 입력" />
        </InputGroup>

        <InputGroup>
          <Label>Height</Label>
          <Input type="number" placeholder="Value" min="0" />
          {/* <Input
            type="number"
            name="height"
            value={formData.height}
            onChange={handleChange}
            min="0"
          /> */}
        </InputGroup>

        <InputGroup>
          <Label>Age</Label>
          <Input type="number" placeholder="Value" min="0" />
          {/* <Input
            type="number"
            name="age"
            value={formData.age}
            onChange={handleChange}
            min="0"
          /> */}
        </InputGroup>

        <InputGroup>
          <Label>Gender</Label>
          <RadioGroup>
            <label>
              {/* 실제 데이터에 따라 checked 상태를 동적으로 설정해야 합니다. */}
              <input type="radio" name="gender" value="male" defaultChecked /> Male
              {/* <input
                type="radio"
                name="gender"
                value="male"
                checked={formData.gender === 'male'} // state 값에 따라 checked 결정
                onChange={handleChange}
              /> Male */}
            </label>
            <label>
              <input type="radio" name="gender" value="female" /> Female
              {/* <input
                type="radio"
                name="gender"
                value="female"
                checked={formData.gender === 'female'} // state 값에 따라 checked 결정
                onChange={handleChange}
              /> Female */}
            </label>
          </RadioGroup>
        </InputGroup>

        <InputGroup>
          <Label>Goal</Label>
          <Input type="text" placeholder="Value" />
        </InputGroup>

        <ButtonGroup>
          <SubmitButton type="submit">수정하기</SubmitButton>
          <CancelButton type="button" onClick={handleCancel}>취소</CancelButton>
        </ButtonGroup>
      </Form>
    </Container>
  );
}

//--- styled-components ---//

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 50px 0;
`;

const Title = styled.h1`
  font-size: 32px;
  margin-bottom: 30px;
  font-weight: bold;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  width: 280px;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
`;

const Label = styled.label`
  margin-bottom: 5px;
  font-size: 14px;
`;

const Input = styled.input`
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 14px;
`;

const RadioGroup = styled.div`
  display: flex;
  gap: 20px;
  
  label {
    display: flex;
    align-items: center;
    font-size: 14px;
    gap: 5px;
  }
`;

// 버튼들을 그룹으로 묶어 스타일링
const ButtonGroup = styled.div`
  display: flex;
  gap: 10px; // 버튼 사이의 간격
  margin-top: 10px;
`;

// 공통 버튼 스타일
const BaseButton = styled.button`
  flex: 1; // 버튼이 그룹 내에서 차지하는 비율을 동일하게
  padding: 12px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.2s; // 부드러운 색상 전환 효과
`;

// 수정하기 버튼 (기존 Button 스타일)
const SubmitButton = styled(BaseButton)`
  background-color: #222;
  color: white;

  &:hover {
    background-color: #444;
  }
`;

// 취소 버튼 (새로운 스타일)
const CancelButton = styled(BaseButton)`
  background-color: #ccc;
  color: #333;

  &:hover {
    background-color: #bbb;
  }
`;