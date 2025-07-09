// src/components/cheering/CheeringPopup.jsx
import React from 'react';
import styled from 'styled-components';

const Popup = styled.div`
  position: fixed;
  top: 15%;
  left: 50%;
  transform: translate(-50%, 0);
  background: #fff;
  border: 2px solid #4caf50;
  border-radius: 12px;
  padding: 20px 30px;
  z-index: 9999;
  box-shadow: 0 0 10px rgba(0,0,0,0.3);
  font-size: 18px;
  font-weight: 500;
  color: #333;
`;

const CheeringPopup = ({ message }) => {
  return (
    <Popup>
      🎉 {message}
    </Popup>
  );
};

export default CheeringPopup;
