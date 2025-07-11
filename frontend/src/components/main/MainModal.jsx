// src/components/MainModal.jsx
import React, { useEffect, useState } from 'react';
import './MainModal.css';
import { validNumberInput } from '../../utils/ValueValidation';
import { postRecord } from '../../api/record';
import { fetchMyUserId } from '../../api/user';
import { getLatestRecord ,checkTodayRecord} from '../../api/record';

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
    const initModal = async () => {
      try {
        const userId = await fetchMyUserId();
        const { data } = await checkTodayRecord(); // 오늘 기록 여부 확인
        if (!data.exists) {
          try {
            const latest = await getLatestRecord();
            if (latest) {
              setForm((prev) => ({
                ...prev,
                weight: latest.weight || '',
                fat: latest.fat || '',
                muscle: latest.muscle || '',
                bmr: latest.bmr || '',
                bmi: latest.bmi || '',
                vai: latest.vai || '',
                sleep: latest.sleep || '',
              }));
            }
          } catch (err) {
            console.error("최신 기록 불러오기 실패", err);
          }

          setShowModal(true);
          document.body.style.overflow = 'hidden';
        } else {
          setShowModal(false);
          if (onClose) onClose();
        }
      } catch (err) {
        console.error("모달 초기화 실패", err);
        setShowModal(false);
        if (onClose) onClose();
      }
    };

    initModal();
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


    if (setIsLoading) setIsLoading(true);
    try {
      console.log("📦 서버 전송 form 데이터:", form);
      const res = await postRecord(form);
      if (triggerToast) triggerToast('저장 성공!');
      if (onSaved) await onSaved(res);
      setShowModal(false);
      // window.location.reload();
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
        <div style={{ height: "5px" }} />
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
            <div className="button-row">
              <button className="save-button" type="submit">
                <span className="shadow"></span>
                <span className="edge"></span>
                <span className="front"><span>다음</span></span>
              </button>
            </div>
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
              <button
                className="prev-button"
                type="button"
                onClick={() => setStep(1)}
              >
                <span className="shadow"></span>
                <span className="edge"></span>
                <span className="front"><span>이전</span></span>
              </button>
              <button className="save-button" type="submit">
                <span className="shadow"></span>
                <span className="edge"></span>
                <span className="front"><span>저장하기</span></span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default MainModal;
