import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { postLogin } from "../api/auth";
import ErrToast from "../components/toast/errToast"; // 추가
import "./LoginPage.css";

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showErrToast, setShowErrToast] = useState(false); // 추가
  const [errToastMessage, setErrToastMessage] = useState(""); // 추가

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
      setErrToastMessage(error.response?.data?.error?.message || "로그인 실패"); // 변경
      setShowErrToast(true); // 변경
      setTimeout(() => setShowErrToast(false), 2000); // 2초 후 자동 닫힘
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
      {showErrToast && (
        <ErrToast
          message={errToastMessage}
          onClose={() => setShowErrToast(false)}
        />
      )}
    </div>
  );
};

export default LoginPage;