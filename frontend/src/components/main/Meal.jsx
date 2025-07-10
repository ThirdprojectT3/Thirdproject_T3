// components/main/MealInfo.jsx
import React from 'react';
import './Meal.css';

const Meal = ({ selectedDate, monthDiets, getLocalDateString }) => {
  const dateStr = getLocalDateString(selectedDate);
  const diet = monthDiets.find(d => d.date === dateStr);

  return (
    <div className="meal-box">
      {diet ? (
        <div>
          <p>🍳 아침: {diet.breakfast}</p>
          <p>🍱 점심: {diet.lunch}</p>
          <p>🍖 저녁: {diet.dinner}</p>
        </div>
      ) : "식단 정보 없음"}
    </div>
  );
};

export default Meal;
