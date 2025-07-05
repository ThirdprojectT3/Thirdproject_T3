import React from "react";
import styled from "styled-components";
import ProfileForm from "../components/profile/profile";

const ProfilePage = () => {
  return (
    <Wrapper>
      <ProfileForm />
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

export default ProfilePage;
