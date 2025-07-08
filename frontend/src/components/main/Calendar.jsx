import React, { useEffect } from 'react';
import './Calendar.css';
import { fetchTodosByMonth } from "../../api/todo";

const Calendar = ({ selectedDate, setSelectedDate, setMonthTodos }) => {

  const handlePrevMonth = () => {
    setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 1));
  };

  useEffect(() => {
    const ym = `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, "0")}`;
    fetchTodosByMonth(1, ym) // userId는 실제 값으로
      .then(res => setMonthTodos(res.data))
      .catch(() => setMonthTodos([]));
  }, [selectedDate, setMonthTodos]);

  const renderDays = () => {
    const days = [];
    const daysInMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0).getDate();
    const firstDayOfMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1).getDay();

    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div className="empty-day" key={`empty-${i}`} />);
    }

    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), i);
      const dayOfWeek = date.getDay();
      days.push(
        <div className="day-wrapper" key={i}>
          <div
            className="top-circle"
            onClick={() => setSelectedDate(date)}
          />
          <div
            className={`day-circle${selectedDate.getDate() === i ? ' selected' : ''} day-${dayOfWeek}`}
            onClick={() => setSelectedDate(date)}
          >
            {i}
          </div>
        </div>
      );
    }
    return days;
  };

  return (
    <div className="calendar-wrapper">
      <div className="calendar-header">
        <div className="month-year">
          {selectedDate.getFullYear()}년 {selectedDate.getMonth() + 1}월
        </div>
        <div className="calendar-navigation">
          <button onClick={handlePrevMonth}>&lt;</button>
          <button onClick={handleNextMonth}>&gt;</button>
        </div>
      </div>
      <div className="calendar-weekdays">
        {['일', '월', '화', '수', '목', '금', '토'].map((day, index) => (
          <div
            className={`calendar-weekday weekday-${index}`}
            key={index}
          >
            {day}
          </div>
        ))}
      </div>
      <div className="calendar-days-grid">{renderDays()}</div>
    </div>
  );
};

export default Calendar;