import React from "react";
import styled from "styled-components";
import SignUpForm from "../components/signup/signup";

const SignupPage = () => {
  return (
    <Wrapper>
      <SignUpForm />
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

export default SignupPage;
