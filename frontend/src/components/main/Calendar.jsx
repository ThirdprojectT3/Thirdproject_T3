import React, { useState } from 'react';
import styled from 'styled-components';

const Calendar = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const handlePrevMonth = () => {
    setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 1));
  };

  const renderDays = () => {
    const days = [];
    const daysInMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0).getDate();
    const firstDayOfMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1).getDay();

    // 빈 칸 추가 (첫 번째 날의 요일 기준)
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<EmptyDay key={`empty-${i}`} />);
    }

    // 날짜 추가
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), i);
      const dayOfWeek = date.getDay(); // 요일 인덱스 (0: 일요일, 6: 토요일)
      days.push(
        <DayWrapper key={i}>
          <TopCircle onClick={() => setSelectedDate(date)} /> {/* 클릭 이벤트 추가 */}
          <DayCircle
            selected={selectedDate.getDate() === i}
            onClick={() => setSelectedDate(date)}
            dayOfWeek={dayOfWeek} // 요일 전달
          >
            {i}
          </DayCircle>
        </DayWrapper>
      );
    }
    return days;
  };

  return (
    <CalendarWrapper>
      <Header>
        <MonthYear>
          {selectedDate.getFullYear()}년 {selectedDate.getMonth() + 1}월
        </MonthYear>
        <Navigation>
          <button onClick={handlePrevMonth}>&lt;</button>
          <button onClick={handleNextMonth}>&gt;</button>
        </Navigation>
      </Header>
      <Weekdays>
        {['일', '월', '화', '수', '목', '금', '토'].map((day, index) => (
          <Weekday key={index} index={index}>
            {day}
          </Weekday>
        ))}
      </Weekdays>
      <DaysGrid>{renderDays()}</DaysGrid>
    </CalendarWrapper>
  );
};

export default Calendar;

// styled-components
const CalendarWrapper = styled.div`
  width: 100%;
  height: 100%;
  border: 1.5px solid #222;
  border-radius: 8px;
  padding: 28px 16px;
  background: #fff;
  display: flex;
  flex-direction: column;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

const MonthYear = styled.div`
  font-size: 1.8rem;
  font-weight: bold;
`;

const Navigation = styled.div`
  button {
    background: none;
    border: none;
    font-size: 1.2rem;
    cursor: pointer;
    margin: 0 8px;
  }
`;

const Weekdays = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  margin-bottom: 8px;
`;

const Weekday = styled.div`
  text-align: center;
  font-size: 1rem;
  font-weight: bold;
  color: ${({ index }) => (index === 0 ? 'red' : index === 6 ? 'blue' : '#666')};
`;

const DaysGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 0px;
  row-gap: 12px;
  flex: 1;
`;

const DayWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const TopCircle = styled.div`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: #ddd;
  margin-bottom: 4px;
  cursor: pointer; /* 클릭 가능하도록 설정 */
  &:hover {
    background: #bbb; /* 호버 효과 추가 */
  }
`;

const DayCircle = styled.div`
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: ${({ selected }) => (selected ? '#000' : '#fff')};
  color: ${({ selected, dayOfWeek }) =>
    selected ? '#fff' : dayOfWeek === 0 ? 'red' : dayOfWeek === 6 ? 'blue' : '#000'};
  font-size: 0.85rem;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
  &:hover {
    background: ${({ selected }) => (selected ? '#444' : '#ddd')};
  }
`;

const EmptyDay = styled.div`
  width: 30px;
  height: 30px;
`;