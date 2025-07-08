import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import Cookies from "js-cookie";
import { getUserInfo, patchUserInfo } from "../api/userinfo";
import ErrToast from "../components/toast/ErrToast";
import "./ProfilePage.css";

const diseasesList = ["고혈압", "당뇨병", "심장질환", "천식", "관절염", "디스크 질환"];

const ProfilePage = () => {
  const navigate = useNavigate();
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

  const [showErrToast, setShowErrToast] = useState(false);
  const [errToastMessage, setErrToastMessage] = useState("");

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {

        const res = await getUserInfo();
        setForm({
          email: res.email,
          name: res.name,
          password: "",
          height: res.height,
          age: res.age,
          gender: res.gender.toLowerCase(),
          goal: res.goal,
          diseases: res.diseases || [],
        });
      } catch (error) {
        console.error("내 정보 조회 실패", error);
        setErrToastMessage("내 정보 불러오기 실패");
        setShowErrToast(true);
        setTimeout(() => setShowErrToast(false), 2000);
      }
    };

    fetchUserInfo();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDiseaseChange = (e) => {
    const { value, checked } = e.target;
    setForm((prev) => {
      const diseases = checked
        ? [...prev.diseases, value]
        : prev.diseases.filter((d) => d !== value);
      return { ...prev, diseases };
    });
  };

 const handleUpdate = async (e) => {
  e.preventDefault();
  try {
    const updateData = {
      email: form.email,
      name: form.name,
      height: Number(form.height),
      age: Number(form.age),
      gender: form.gender.toUpperCase(),
      goal: form.goal,
      diseases: form.diseases,
    };

    // 비밀번호가 입력된 경우에만 추가
    if (form.password && form.password.trim() !== "") {
      updateData.password = form.password;
    }

    await patchUserInfo(updateData);
    navigate("/main", { state: { toastMessage: "정보 수정 성공!" } });
  } catch (error) {
    console.error("정보 수정 실패", error);
    setErrToastMessage("정보 수정 실패");
    setShowErrToast(true);
    setTimeout(() => setShowErrToast(false), 2000);
  }
};

  const handleCancel = () => {
    navigate("/main");
  };

  return (
    <div className="profile-wrapper">
      <div className="profile-container">
        <h1 className="profile-title">내 정보 수정</h1>
        <form className="profile-form" onSubmit={handleUpdate}>
          <div className="input-group">
            <label>Email</label>
            <input name="email" value={form.email} onChange={handleChange} />
          </div>

          <div className="input-group">
            <label>Name</label>
            <input name="name" value={form.name} onChange={handleChange} />
          </div>

          <div className="input-group">
            <label>Password</label>
            <input name="password" type="password" value={form.password} onChange={handleChange} placeholder="새 비밀번호 입력" />
          </div>

          <div className="input-group">
            <label>Height</label>
            <input name="height" type="number" value={form.height} onChange={handleChange} />
          </div>

          <div className="input-group">
            <label>Age</label>
            <input name="age" type="number" value={form.age} onChange={handleChange} />
          </div>

          <div className="input-group">
            <label>Gender</label>
            <div className="radio-group">
              {["male", "female", "other"].map((genderOption) => (
                <label key={genderOption}>
                  <input type="radio" name="gender" value={genderOption} checked={form.gender === genderOption} onChange={handleChange} />
                  {genderOption.charAt(0).toUpperCase() + genderOption.slice(1)}
                </label>
              ))}
            </div>
          </div>

          <div className="input-group">
            <label>Goal</label>
            <div className="radio-group">
              {["체중감량", "근력향상"].map((goalOption) => (
                <label key={goalOption}>
                  <input type="radio" name="goal" value={goalOption} checked={form.goal === goalOption} onChange={handleChange} />
                  {goalOption}
                </label>
              ))}
            </div>
          </div>

          <div className="input-group">
            <label>질병 (해당되는 항목 선택)</label>
            <div className="checkbox-group">
              {diseasesList.map((disease) => (
                <label key={disease}>
                  <input type="checkbox" name="diseases" value={disease} checked={form.diseases.includes(disease)} onChange={handleDiseaseChange} />
                  {disease}
                </label>
              ))}
            </div>
          </div>

          <div className="button-group">
            <button className="submit-button" type="submit">수정하기</button>
            <button className="cancel-button" type="button" onClick={handleCancel}>취소</button>
          </div>
        </form>
      </div>
      {showErrToast && (<ErrToast message={errToastMessage} onClose={() => setShowErrToast(false)} />)}
    </div>
  );
};

export default ProfilePage;
