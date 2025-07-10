import React, { useEffect } from 'react';
import './Calendar.css';
import { fetchTodosByMonth } from '../../api/todo';

const Calendar = ({ selectedDate, setSelectedDate, setMonthTodos, userId, monthTodos = [] }) => {

  const handlePrevMonth = () => {
    setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 1));
  };

  // useEffect(() => {
  //   if (!userId) return;
  //   const ym = `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, "0")}`;
  //   fetchTodosByMonth(userId, ym)
  //     .then(res => setMonthTodos(res.data))
  //     .catch(() => setMonthTodos([]));
  // }, [selectedDate, setMonthTodos, userId]);

  // 날짜별 todo 통계 계산
  const getTodoStatsForDate = (dateObj) => {
    const dateStr = `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, '0')}-${String(dateObj.getDate()).padStart(2, '0')}`;
    const todos = monthTodos.filter(todo => todo.date === dateStr);
    const total = todos.length;
    const completed = todos.filter(todo => todo.complete).length;
    return { total, completed };
  };

  // 완료율에 따라 색상 결정
  const getCircleColor = (total, completed) => {
    if (total === 0) return "#ffffff"; // 흰색
    const ratio = completed / total;
    if (ratio === 1) return "#4caf50"; // 초록
    if (ratio >= 0.8) return "#8bc34a";
    if (ratio >= 0.6) return "#cddc39";
    if (ratio >= 0.4) return "#ffeb3b";
    if (ratio >= 0.2) return "#ff9800";
    return "#f44336"; // 빨강
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
      const dayOfWeek = date.getDay(); // 요일 (0: 일, 6: 토)
      const isToday = date.toDateString() === new Date().toDateString();
      const isSelected = selectedDate.getDate() === i && selectedDate.getMonth() === date.getMonth();

      const { total, completed } = getTodoStatsForDate(date);
      const circleColor = getCircleColor(total, completed);

      days.push(
        <div
          key={i}
          className={`day-wrapper ${isSelected ? 'selected' : ''} ${isToday ? 'today' : ''}`}
          onClick={() => setSelectedDate(date)}
        >
          <div className={`date-text ${dayOfWeek === 0 ? 'sunday' : dayOfWeek === 6 ? 'saturday' : ''}`}>
            {i}
          </div>
          <div
            className="dot"
            style={{ backgroundColor: circleColor }}
            title={total > 0 ? `총 ${total}개 중 ${completed}개 완료` : "할 일 없음"}
          />
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
          <div className={`calendar-weekday weekday-${index}`} key={index}>{day}</div>
        ))}
      </div>
      <div className="calendar-days-grid">{renderDays()}</div>
    </div>
  );
};

export default Calendar;
