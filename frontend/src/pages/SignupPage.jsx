import React from "react";
import { useNavigate } from 'react-router-dom';
import "./SignupPage.css";

const SignupPage = () => {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("회원가입 시도");
  };

  return (
    <div className="signup-wrapper">
      <div className="signup-container">
        <h1 className="signup-title">회원가입</h1>
        <form className="signup-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Email</label>
            <input type="email" placeholder="Value" />
          </div>

          <div className="input-group">
            <label>Name</label>
            <input type="text" placeholder="Value" />
          </div>

          <div className="input-group">
            <label>Password</label>
            <input type="password" placeholder="Value" />
          </div>

          <div className="input-group">
            <label>Height</label>
            <input type="number" placeholder="Value" />
          </div>

          <div className="input-group">
            <label>Age</label>
            <input type="number" placeholder="Value" />
          </div>

          <div className="input-group">
            <label>Gender</label>
            <div className="radio-group">
              <label><input type="radio" name="gender" value="male" defaultChecked /> Male</label>
              <label><input type="radio" name="gender" value="female" /> Female</label>
              <label><input type="radio" name="gender" value="female" /> Other</label>
            </div>
          </div>

          <div className="input-group">
            <label>Goal</label>
            <input type="text" placeholder="Value" />
          </div>

          <button className="signup-button" type="submit">Sign Up</button>
        </form>

        <p className="login-link" onClick={() => navigate("/")}>
          로그인으로 돌아가기
        </p>
      </div>
    </div>
  );
};

export default SignupPage;
