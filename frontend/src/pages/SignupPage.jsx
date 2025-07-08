import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { postRegister } from "../api/auth";
import ErrToast from "../components/toast/ErrToast";
import "./SignupPage.css";
import Cookies from "js-cookie";

const SignupPage = () => {
  const navigate = useNavigate();
  const [showErrToast, setShowErrToast] = useState(false);
  const [errToastMessage, setErrToastMessage] = useState("");

  useEffect(() => {
    const token = Cookies.get('jwtToken');
    if (token) {
      navigate('/main', { replace: true });
    }
  }, [navigate]);

  const diseasesList = [
    "고혈압",
    "당뇨병",
    "심장질환",
    "천식",
    "관절염",
    "디스크 질환"
  ];

  const [form, setForm] = useState({
    email: "",
    name: "",
    password: "",
    height: "",
    age: "",
    gender: "male",
    goal: "체중 감량",
    diseases: [],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleDiseaseChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setForm(prev => ({
        ...prev,
        diseases: [...prev.diseases, value],
      }));
    } else {
      setForm(prev => ({
        ...prev,
        diseases: prev.diseases.filter(d => d !== value),
      }));
    }
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
        diseases: form.diseases,
      });
      navigate("/", { state: { toastMessage: res.message || "회원가입 성공!" } });
    } catch (error) {
      console.error(error);
      setErrToastMessage(error.response?.data?.error?.message || "회원가입 실패");
      setShowErrToast(true);
      setTimeout(() => setShowErrToast(false), 2000);
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
            <div className="radio-group">
              <label><input type="radio" name="goal" value="체중감량" checked={form.goal === "체중감량"} onChange={handleChange}/> 체중 감량</label>
              <label><input type="radio" name="goal" value="근력향상" checked={form.goal === "근력향상"} onChange={handleChange}/> 근력 향상</label>
            </div>
          </div>

          <div className="input-group">
            <label>질병 (해당되는 항목 선택)</label>
            <div className="checkbox-group">
              {diseasesList.map((disease) => (
                <label key={disease} className="checkbox-label">
                  <input
                    type="checkbox"
                    name="diseases"
                    value={disease}
                    checked={form.diseases.includes(disease)}
                    onChange={handleDiseaseChange}
                  />
                  {disease}
                </label>
              ))}
            </div>
          </div>

          <button className="signup-button" type="submit">Sign Up</button>
        </form>
        <p className="login-link" onClick={() => navigate("/")}>
          로그인으로 돌아가기
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

export default SignupPage;