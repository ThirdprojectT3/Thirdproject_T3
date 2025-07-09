// src/components/MainModal.jsx
import React, { useEffect, useState } from 'react';
import './MainModal.css';
import { validNumberInput } from '../../utils/ValueValidation';
import { postRecord } from '../../api/record';
import Cookies from "js-cookie";
import { fetchMyUserId } from '../../api/user';

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
    const today = new Date().toISOString().split('T')[0];

    fetchMyUserId()
      .then((userId) => {
        const modalKey = `modalShownDate_${userId}`;
        const modalShownDate = Cookies.get(modalKey);

        if (modalShownDate !== today) {
          setShowModal(true);
          document.body.style.overflow = 'hidden';
        } else {
          setShowModal(false);
          if (onClose) onClose();
        }
      })
      .catch(() => {
        setShowModal(false);
        if (onClose) onClose();
      });

    return () => {
      document.body.style.overflow = '';
    };
  }, [onClose]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    if (['weight', 'fat', 'muscle', 'bmr', 'bmi', 'vai', 'sleep'].includes(id)) {
      const validValue = validNumberInput(value);
      setForm((prev) => ({ ...prev, [id]: validValue }));
    } else {
      setForm((prev) => ({ ...prev, [id]: value }));
    }
  };

  const handlePlaceSelect = (place) => {
    setForm((prev) => ({
      ...prev,
      place,
      prompt: place === '쉬기' ? '' : prev.prompt,
    }));
  };

  const handleSubmitStep1 = (e) => {
    e.preventDefault();
    const requiredFields = [
      { key: "weight", label: "몸무게" },
      { key: "fat", label: "체지방량" },
      { key: "muscle", label: "골격근량" },
      { key: "bmr", label: "기초대사량" },
      { key: "bmi", label: "BMI" },
      { key: "vai", label: "내장 지방 지수" },
      { key: "sleep", label: "수면 시간" },
    ];
    for (const field of requiredFields) {
      if (!form[field.key] || form[field.key].toString().trim() === "") {
        if (triggerErrToast) triggerErrToast(`${field.label} 값을 입력하세요.`);
        return;
      }
    }
    setStep(2);
  };

  const handleSubmitStep2 = async (e) => {
    e.preventDefault();
    if (!form.place || form.place.trim() === "") {
      if (triggerErrToast) triggerErrToast("운동 위치를 선택하세요.");
      return;
    }

    const today = new Date().toISOString().split('T')[0];
    if (setIsLoading) setIsLoading(true);

    try {
      const userId = await fetchMyUserId();
      const modalKey = userId ? `modalShownDate_${userId}` : 'modalShownDate';
      Cookies.set(modalKey, today, { expires: 1 });
      setShowModal(false);

      console.log("📦 서버 전송 form 데이터:", form);
      await postRecord(form);
      if (triggerToast) triggerToast('저장 성공!');
      if (onSaved) onSaved();
    } catch {
      if (triggerErrToast) triggerErrToast('저장 실패!');
    } finally {
      if (setIsLoading) setIsLoading(false);
      if (onClose) onClose();
    }
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
              {[
                { id: "weight", label: "몸무게 (kg)" },
                { id: "fat", label: "체지방량 (kg)" },
                { id: "muscle", label: "골격근량 (kg)" },
                { id: "bmr", label: "기초대사량 (kcal)" },
                { id: "bmi", label: "BMI", step: "0.1" },
                { id: "vai", label: "내장 지방 지수" },
                { id: "sleep", label: "수면 시간" },
              ].map(({ id, label, step }) => (
                <div className="input-group" key={id}>
                  <label htmlFor={id} className="label">{label}</label>
                  <input
                    id={id}
                    type="number"
                    step={step || "1"}
                    placeholder={`${label}를 입력하세요`}
                    value={form[id]}
                    onChange={handleChange}
                    className="input"
                  />
                </div>
              ))}
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
            {['헬스장', '집', '크로스핏'].includes(form.place) && (
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
