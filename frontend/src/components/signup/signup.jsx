import React from "react";
import styled from "styled-components";

export default function SignUpForm() {
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("회원가입 시도");
  };

  return (
    <Container>
      <Title>회원가입</Title>
      <Form onSubmit={handleSubmit}>
        <InputGroup>
          <Label>Email</Label>
          <Input type="email" placeholder="Value" />
        </InputGroup>

        <InputGroup>
          <Label>Name</Label>
          <Input type="text" placeholder="Value" />
        </InputGroup>

        <InputGroup>
          <Label>Password</Label>
          <Input type="password" placeholder="Value" />
        </InputGroup>

        <InputGroup>
          <Label>Height</Label>
          <Input type="number" placeholder="Value" />
        </InputGroup>

        <InputGroup>
          <Label>Age</Label>
          <Input type="number" placeholder="Value" />
        </InputGroup>

        <InputGroup>
          <Label>Gender</Label>
          <RadioGroup>
            <label>
              <input type="radio" name="gender" value="male" defaultChecked /> Male
            </label>
            <label>
              <input type="radio" name="gender" value="female" /> Female
            </label>
          </RadioGroup>
        </InputGroup>

        <InputGroup>
          <Label>Goal</Label>
          <Input type="text" placeholder="Value" />
        </InputGroup>

        <Button type="submit">Sign Up</Button>
      </Form>

      <LoginLink onClick={() => console.log("로그인으로 이동")}>
        로그인으로 돌아가기
      </LoginLink>
    </Container>
  );
}


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

const Button = styled.button`
  padding: 12px;
  background-color: #222;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  margin-top: 10px;

  &:hover {
    background-color: #444;
  }
`;

const LoginLink = styled.p`
  margin-top: 15px;
  font-size: 12px;
  color: #555;
  text-decoration: underline;
  cursor: pointer;

  &:hover {
    color: #000;
  }
`;