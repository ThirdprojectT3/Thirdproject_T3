import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { postRegister } from "../api/auth";
import "./SignupPage.css";

const SignupPage = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    name: "",
    password: "",
    height: "",
    age: "",
    gender: "male",
    goal: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("회원가입 시도", form);
    try {
      const res = await postRegister({
        email: form.email,
        name: form.name,
        password: form.password,
        height: Number(form.height),
        age: Number(form.age),
        gender: form.gender.toUpperCase(),
        goal: form.goal,
      });
      alert(res.message);
      navigate("/");
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.error?.message || "회원가입 실패");
    }
  };


  return (
    <div className="signup-wrapper">
      <div className="signup-container">
        <h1 className="signup-title">회원가입</h1>
        <form className="signup-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Email</label>
            <input name="email" value={form.email} onChange={handleChange} placeholder="Value" />
          </div>

          <div className="input-group">
            <label>Name</label>
            <input name="name" value={form.name} onChange={handleChange} placeholder="Value" />
          </div>

          <div className="input-group">
            <label>Password</label>
            <input name="password" type="password" value={form.password} onChange={handleChange} placeholder="Value" />
          </div>

          <div className="input-group">
            <label>Height</label>
            <input name="height" type="number" value={form.height} onChange={handleChange} placeholder="Value" />
          </div>

          <div className="input-group">
            <label>Age</label>
            <input name="age" type="number" value={form.age} onChange={handleChange} placeholder="Value" />
          </div>

          <div className="input-group">
            <label>Gender</label>
            <div className="radio-group">
              <label><input type="radio" name="gender" value="male" checked={form.gender === "male"} onChange={handleChange} /> Male</label>
              <label><input type="radio" name="gender" value="female" checked={form.gender === "female"} onChange={handleChange} /> Female</label>
              <label><input type="radio" name="gender" value="other" checked={form.gender === "other"} onChange={handleChange} /> Other</label>
            </div>
          </div>

          <div className="input-group">
            <label>Goal</label>
            <input name="goal" value={form.goal} onChange={handleChange} placeholder="Value" />
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
