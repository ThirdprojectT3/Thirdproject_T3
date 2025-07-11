import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import { postLogin } from "../api/auth";
import ErrToast from "../components/toast/ErrToast";
import Toast from "../components/toast/Toast";
import "./LoginPage.css";

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showErrToast, setShowErrToast] = useState(false);
  const [errToastMessage, setErrToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  useEffect(() => {
    if (location.state?.toastMessage) {
      setToastMessage(location.state.toastMessage);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2000);
      navigate(location.pathname, { replace: true, state: {} });
    }

  }, [navigate, location]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await postLogin({ email, password });
      navigate("/main");
    } catch (error) {
      setErrToastMessage(error.response?.data?.error?.message || "로그인 실패");
      setShowErrToast(true);
      setTimeout(() => setShowErrToast(false), 2000);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-container">
        <h1 className="login-title">로그인</h1>
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <label>이메일</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="이메일을 입력하세요." />
          </div>

          <div className="input-group">
            <label>비밀번호</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="비밀번호를 입력하세요." />
          </div>

          <button className="login-button" type="submit">
            <span className="shadow"></span>
            <span className="edge"></span>
            <span className="front"><span>로그인</span></span>
          </button>
        </form>

        <p className="signup-link" onClick={() => navigate("/signup")}>
          계정이 없으신가요?
        </p>
      </div>
      {showToast && (
        <Toast message={toastMessage} onClose={() => setShowToast(false)} />
      )}
      {showErrToast && (
        <ErrToast message={errToastMessage} onClose={() => setShowErrToast(false)} />
      )}
    </div>
  );
};

export default LoginPage;
