import React from "react";
import styled from "styled-components";

export default function LoginForm() {
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("로그인 시도");
  };

  return (
    <Container>
      <Title>로그인</Title>
      <Form onSubmit={handleSubmit}>
        <InputGroup>
          <Label>Email</Label>
          <Input type="email" placeholder="Value" />
        </InputGroup>

        <InputGroup>
          <Label>Password</Label>
          <Input type="password" placeholder="Value" />
        </InputGroup>

        <Button type="submit">Sign In</Button>
      </Form>

      <RegisterLink onClick={() => console.log("회원가입 이동")}>
        계정이 없으신가요?
      </RegisterLink>
    </Container>
  );
}

// styled-components
const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
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

const Button = styled.button`
  padding: 12px;
  background-color: #222;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;

  &:hover {
    background-color: #444;
  }
`;

const RegisterLink = styled.p`
  margin-top: 15px;
  font-size: 12px;
  color: #555;
  text-decoration: underline;
  cursor: pointer;

  &:hover {
    color: #000;
  }
`;
