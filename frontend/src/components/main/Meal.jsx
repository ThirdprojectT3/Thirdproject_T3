import React from 'react';
import './Meal.css';

const Meal = ({ selectedDate, monthDiets, getLocalDateString }) => {
  const dateStr = getLocalDateString(selectedDate);
  const diet = monthDiets.find(d => d.date === dateStr);

  return (
    <div className="meal-box">
      <h2 className="meal-title">오늘의 추천 식단</h2>
      {diet ? (
        <div className="meal-list">
          <p className="meal-item breakfast">🍳 아침 : {diet.breakfast}</p>
          <p className="meal-item lunch">🍱 점심 : {diet.lunch}</p>
          <p className="meal-item dinner">🍖 저녁 : {diet.dinner}</p>
        </div>
      ) : "식단 정보 없음"}
    </div>
  );
};

export default Meal;
