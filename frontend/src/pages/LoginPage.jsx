import React from "react";
import styled from "styled-components";
import LoginForm from "../components/login/login";

const LoginPage = () => {
  return (
    <Wrapper>
      <LoginForm />
    </Wrapper>
  );
};

const Wrapper = styled.div`
  background-color: #ffffff;
  height: 100vh;
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

export default LoginPage;
