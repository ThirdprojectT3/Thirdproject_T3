import React from "react";
import { useNavigate } from 'react-router-dom';
import "./ProfilePage.css";

// 실제로는 props로 유저의 기존 정보를 받아오기

const ProfilePage = () => {
  const navigate = useNavigate();

  // 예시: 초기값을 userInfo에서 가져온다고 가정
  // const [formData, setFormData] = useState(userInfo);

  // const handleChange = (e) => {
  //   const { name, value } = e.target;
  //   setFormData((prevData) => ({
  //     ...prevData,
  //     [name]: value,
  //   }));
  // };

  const handleUpdate = (e) => {
    e.preventDefault();
    // 여기에 실제 정보 수정 로직을 구현
    console.log("정보 수정 시도");
  };

  const handleCancel = () => {
    // setFormData(userInfo);
    // 취소 로직 (예: 이전 페이지로 돌아가기)
    console.log("수정 취소");
    navigate("/main");  // 취소 시 홈으로 이동 (원하면 다른 페이지로)
  };

  return (
    <div className="profile-wrapper">
      <div className="profile-container">
        <h1 className="profile-title">내 정보</h1>
        <form className="profile-form" onSubmit={handleUpdate}>
          <div className="input-group">
            <label>Email</label>
            {/* 실제로는 value prop에 기존 데이터를 넣어줍니다. */}
            <input type="email" placeholder="Value" />
            {/*
            <input 
              type="email"
              name="email"
              value={formData.email} 
              onChange={handleChange}
            /> 
            */}
          </div>

          <div className="input-group">
            <label>Name</label>
            <input type="text" placeholder="Value" />
            {/*
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
            /> 
            */}
          </div>

          <div className="input-group">
            <label>Password</label>
            {/* 비밀번호는 보통 새로 입력받습니다. */}
            <input type="password" placeholder="새 비밀번호 입력" />
          </div>

          <div className="input-group">
            <label>Height</label>
            <input type="number" placeholder="Value" min="0" />
            {/*
            <input
              type="number"
              name="height"
              value={formData.height}
              onChange={handleChange}
              min="0"
            /> 
            */}
          </div>

          <div className="input-group">
            <label>Age</label>
            <input type="number" placeholder="Value" min="0" />
            {/*
            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleChange}
              min="0"
            /> 
            */}
          </div>

          <div className="input-group">
            <label>Gender</label>
            <div className="radio-group">
              <label>
                <input type="radio" name="gender" value="male" defaultChecked /> Male
                {/*
                <input
                  type="radio"
                  name="gender"
                  value="male"
                  checked={formData.gender === 'male'}
                  onChange={handleChange}
                /> 
                */}
              </label>
              <label>
                <input type="radio" name="gender" value="female" /> Female
                {/*
                <input
                  type="radio"
                  name="gender"
                  value="female"
                  checked={formData.gender === 'female'}
                  onChange={handleChange}
                /> 
                */}
              </label>
              <label>
                <input type="radio" name="gender" value="other" /> Other
                {/*
                <input
                  type="radio"
                  name="gender"
                  value="other"
                  checked={formData.gender === 'other'}
                  onChange={handleChange}
                /> 
                */}
              </label>
            </div>
          </div>

          <div className="input-group">
            <label>Goal</label>
            <input type="text" placeholder="Value" />
          </div>

          <div className="button-group">
            <button className="submit-button" type="submit">수정하기</button>
            <button className="cancel-button" type="button" onClick={handleCancel}>취소</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;
