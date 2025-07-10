import React, { useEffect } from 'react';
import './Calendar.css';
import { fetchTodosByMonth } from "../../api/todo";

const Calendar = ({ selectedDate, setSelectedDate, setMonthTodos, userId, monthTodos = [] }) => {

  const handlePrevMonth = () => {
    setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 1));
  };

  useEffect(() => {
    if (!userId) return;
    const ym = `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, "0")}`;
    fetchTodosByMonth(userId, ym)
      .then(res => setMonthTodos(res.data))
      .catch(() => setMonthTodos([]));
  }, [selectedDate, setMonthTodos, userId]);

  // 날짜별 todo 통계 계산 함수
  const getTodoStatsForDate = (dateObj) => {
    const dateStr = `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, "0")}-${String(dateObj.getDate()).padStart(2, "0")}`;
    const todos = monthTodos.filter(todo => todo.date === dateStr);
    const total = todos.length;
    const completed = todos.filter(todo => todo.complete).length;
    return { total, completed };
  };

const getCircleColor = (total, completed) => {
  if (total === 0) return "#e0e0e0"; // 회색(기본)
  const ratio = completed / total;
  if (ratio === 1) return "#4caf50"; // 100% 초록
  if (ratio >= 0.8) return "#8bc34a"; // 80% 이상 연두
  if (ratio >= 0.6) return "#cddc39"; // 60% 이상 연노랑
  if (ratio >= 0.4) return "#ffeb3b"; // 40% 이상 노랑
  if (ratio >= 0.2) return "#ff9800"; // 20% 이상 주황
  return "#f44336"; // 20% 미만 빨강
};

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
      const { total, completed } = getTodoStatsForDate(date);
      const circleColor = getCircleColor(total, completed);
      const isSelected = selectedDate.getDate() === i &&
                        selectedDate.getMonth() === date.getMonth() &&
                        selectedDate.getFullYear() === date.getFullYear();

      days.push(
        <div className="day-wrapper" key={i}>
          <div
            className={`top-circle${isSelected ? ' selected' : ''} day-${dayOfWeek}`}
            title={total > 0 ? `총 ${total}개, 완료 ${completed}개` : "할 일 없음"}
            style={{ background: circleColor, color: "#fff" }}
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