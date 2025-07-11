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
    goal: "체중감량",
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
            <label>이메일</label>
            <input name="email" value={form.email} onChange={handleChange} placeholder="이메일을 입력하세요." />
          </div>

          <div className="input-group">
            <label>이름</label>
            <input name="name" value={form.name} onChange={handleChange} placeholder="이름을 입력하세요." />
          </div>

          <div className="input-group">
            <label>비밀번호</label>
            <input name="password" type="password" value={form.password} onChange={handleChange} placeholder="비밀번호를 입력하세요. (8~20자)" />
          </div>

          <div className="input-group">
            <label>키 (cm)</label>
            <input name="height" type="number" value={form.height} onChange={handleChange} placeholder="키를 입력하세요." />
          </div>

          <div className="input-group">
            <label>나이</label>
            <input name="age" type="number" value={form.age} onChange={handleChange} placeholder="나이를 입력하세요." />
          </div>

          <div className="input-group">
            <label>성별</label>
            <div className="radio-button">
              <label>
                <input type="radio" name="gender" value="male" checked={form.gender === "male"} onChange={handleChange}/>
                <span className="radio"></span>
                남성
              </label>
              <label>
                <input type="radio" name="gender" value="female" checked={form.gender === "female"} onChange={handleChange}/>
                <span className="radio"></span>
                여성
              </label>
              <label>
                <input type="radio" name="gender" value="other" checked={form.gender === "other"} onChange={handleChange}/>
                <span className="radio"></span>
                기타
              </label>
            </div>
          </div>

          <div className="input-group">
            <label>목표</label>
            <div className="radio-button">
              <label>
                <input type="radio" name="goal" value="체중감량" checked={form.goal === "체중감량"} onChange={handleChange}/>
                <span className="radio"></span>
                체중 감량
              </label>
              <label>
                <input type="radio" name="goal" value="근력향상" checked={form.goal === "근력향상"} onChange={handleChange}/>
                <span className="radio"></span>
                근력 향상
              </label>
            </div>
          </div>

          <div className="input-group">
            <label>질병 (해당되는 항목 선택)</label>
            <div className="checkbox-group">
              {diseasesList.map((disease) => (
                <label key={disease} className="checkbox-label">
                  <span className="checkBox transition">
                    <input
                      type="checkbox"
                      name="diseases"
                      value={disease}
                      checked={form.diseases.includes(disease)}
                      onChange={handleDiseaseChange}
                    />
                    <div />
                  </span>
                  {disease}
                </label>
              ))}
            </div>
          </div>

          <button className="signup-button" type="submit">
            <span className="shadow"></span>
            <span className="edge"></span>
            <span className="front"><span>회원가입</span></span>
          </button>
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