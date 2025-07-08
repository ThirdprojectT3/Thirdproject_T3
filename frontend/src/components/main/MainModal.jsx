import React, { useEffect, useState } from 'react';
import './MainModal.css';
import { validNumberInput } from '../../utils/ValueValidation';
import { postRecord } from '../../api/record';
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

const workoutPlaces = ['헬스장', '집', '크로스핏', '쉬기'];

const MainModal = ({ onClose, triggerToast, triggerErrToast, setIsLoading, onSaved }) => {
  const [showModal, setShowModal] = useState(false);
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    weight: '',
    fat: '',
    muscle: '',
    bmr: '',
    bmi: '',
    vai: '',
    sleep: '',
    prompt: '',
    place: '',
  });

  useEffect(() => {
    const token = Cookies.get('jwtToken');
    let userId = '';
    if (token) {
      try {
        const decoded = jwtDecode(token);
        userId = decoded.userId;
      } catch {
        userId = '';
      }
    }
    const modalKey = userId ? `modalShownDate_${userId}` : 'modalShownDate';
    const modalShownDate = Cookies.get(modalKey);
    const today = new Date().toISOString().split('T')[0];
    if (modalShownDate !== today) {
      setShowModal(true);
      document.body.style.overflow = 'hidden';
    } else {
      setShowModal(false);
      if (onClose) onClose();
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [onClose]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    // 숫자 입력값은 유효성 검사
    if (
      id === 'weight' ||
      id === 'fat' ||
      id === 'muscle' ||
      id === 'bmr' ||
      id === 'bmi' ||
      id === 'vai' ||
      id === 'sleep'
    ) {
      const validValue = validNumberInput(value);
      setForm((prev) => ({ ...prev, [id]: validValue }));
    } else {
      setForm((prev) => ({ ...prev, [id]: value }));
    }
  };

  const handlePlaceSelect = (place) => {
    setForm((prev) => ({
      ...prev,
      place: place,
      prompt: place === '쉬기' ? '' : prev.prompt,
    }));
  };

  const handleSubmitStep1 = (e) => {
    e.preventDefault();
    setStep(2);
  };

  const handleSubmitStep2 = async (e) => {
    e.preventDefault();
    const token = Cookies.get('jwtToken');
    let userId = '';
    if (token) {
      try {
        const decoded = jwtDecode(token);
        userId = decoded.userId;
      } catch {
        userId = '';
      }
    }
    const modalKey = userId ? `modalShownDate_${userId}` : 'modalShownDate';
    const today = new Date().toISOString().split('T')[0];
    Cookies.set(modalKey, today, { expires: 1 }); // 쿠키에 저장
    setShowModal(false);

    if (setIsLoading) setIsLoading(true);

    try {
      await postRecord(form, token);
      if (triggerToast) triggerToast('저장 성공!');
      if (onSaved) onSaved();
    } catch {
      if (triggerErrToast) triggerErrToast('저장 실패!');
    } finally {
      if (setIsLoading) setIsLoading(false);
    }

    if (onClose) onClose();
  };

  if (!showModal) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2 className="modal-title">정보 입력</h2>
        <div style={{ height: "6rem" }} />
        {step === 1 && (
          <form className="styled-form" onSubmit={handleSubmitStep1}>
            <div className="two-column-grid">
              <div className="input-group">
                <label htmlFor="weight" className="label">몸무게 (kg)</label>
                <input id="weight" type="number" placeholder="몸무게를 입력하세요" value={form.weight} onChange={handleChange} className="input" />
              </div>
              <div className="input-group">
                <label htmlFor="fat" className="label">체지방량 (kg)</label>
                <input id="fat" type="number" placeholder="체지방량을 입력하세요" value={form.fat} onChange={handleChange} className="input" />
              </div>
              <div className="input-group">
                <label htmlFor="muscle" className="label">골격근량 (kg)</label>
                <input id="muscle" type="number" placeholder="골격근량을 입력하세요" value={form.muscle} onChange={handleChange} className="input" />
              </div>
              <div className="input-group">
                <label htmlFor="bmr" className="label">기초대사량 (kcal)</label>
                <input id="bmr" type="number" placeholder="기초대사량을 입력하세요" value={form.bmr} onChange={handleChange} className="input" />
              </div>
              <div className="input-group">
                <label htmlFor="bmi" className="label">BMI</label>
                <input id="bmi" type="number" step="0.1" placeholder="BMI를 입력하세요" value={form.bmi} onChange={handleChange} className="input" />
              </div>
              <div className="input-group">
                <label htmlFor="vai" className="label">내장 지방 지수</label>
                <input id="vai" type="number" placeholder="내장 지방 지수를 입력하세요" value={form.vai} onChange={handleChange} className="input" />
              </div>
              <div className="input-group">
                <label htmlFor="sleep" className="label">수면 시간</label>
                <input id="sleep" type="number" placeholder="금일 수면 시간을 입력하세요" value={form.sleep} onChange={handleChange} className="input" />
              </div>
            </div>
            <button className="save-button" type="submit">다음</button>
          </form>
        )}
        {step === 2 && (
          <form className="styled-form" onSubmit={handleSubmitStep2}>
            <div className="input-group" style={{ width: '100%' }}>
              <label className="label">운동 위치</label>
              <div className="category-row">
                {workoutPlaces.map((place) => (
                  <button
                    key={place}
                    type="button"
                    className={`category-button${form.place === place ? ' selected' : ''}`}
                    onClick={() => handlePlaceSelect(place)}
                  >
                    {place}
                  </button>
                ))}
              </div>
            </div>
            {(form.place === '헬스장' ||
              form.place === '집' ||
              form.place === '크로스핏') && (
              <div className="input-group" style={{ width: '100%' }}>
                <label htmlFor="prompt" className="label">운동 선호 부위 요청</label>
                <input
                  id="prompt"
                  type="text"
                  placeholder="운동 선호 부위를 요청해보세요. ex) 오늘은 등 운동 루틴을 만들어줘"
                  value={form.prompt}
                  onChange={handleChange}
                  className="input"
                />
              </div>
            )}
            <div className="button-row">
              <button className="prev-button" type="button" onClick={() => setStep(1)}>이전</button>
              <button className="save-button" type="submit">저장하기</button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default MainModal;