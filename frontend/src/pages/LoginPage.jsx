import React from "react";
import { useNavigate } from 'react-router-dom';
import "./LoginPage.css";

const LoginPage = () => {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("로그인 시도");
    navigate("/disease");  // 로그인 성공 시 이동
  };

  return (
    <div className="login-wrapper">
      <div className="login-container">
        <h1 className="login-title">로그인</h1>
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Email</label>
            <input type="email" placeholder="Value" />
          </div>

          <div className="input-group">
            <label>Password</label>
            <input type="password" placeholder="Value" />
          </div>

          <button className="login-button" type="submit">Sign In</button>
        </form>

        <p className="signup-link" onClick={() => navigate("/signup")}>
          계정이 없으신가요?
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
