import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import { postLogin } from "../api/auth";
import ErrToast from "../components/toast/ErrToast";
import Toast from "../components/toast/Toast";
import "./LoginPage.css";
import Cookies from "js-cookie";

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
    const token = Cookies.get('jwtToken');
    if (token) {
      navigate('/main', { replace: true });
    }
  }, [navigate, location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("로그인 시도");

    try {
      const res = await postLogin({ email, password });
      console.log("로그인 성공", res);
      const token = res.data.jwtToken;
      Cookies.set('jwtToken', token, { expires: 1 }); // 1일간 유지
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
      {showToast && (
        <Toast
          message={toastMessage}
          onClose={() => setShowToast(false)}
        />
      )}
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