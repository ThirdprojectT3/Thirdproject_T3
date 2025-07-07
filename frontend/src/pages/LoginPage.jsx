import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { postLogin } from "../api/auth";
import "./LoginPage.css";

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const token = sessionStorage.getItem('jwtToken');
    if (token) {
      navigate('/main', { replace: true });
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("로그인 시도");

    try {
      const res = await postLogin({ email, password });
      console.log("로그인 성공", res);
      sessionStorage.setItem('jwtToken', res.data.jwtToken);
      navigate("/main");
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.error?.message || "로그인 실패"); // 실패 버전으로 보내서 수정하기
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-container">
        <h1 className="login-title">로그인</h1>
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Value" />
          </div>

          <div className="input-group">
            <label>Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Value" />
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
