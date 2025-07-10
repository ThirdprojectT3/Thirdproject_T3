import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import MainModal from '../components/main/MainModal';
import Header from '../components/header/Header';
import TodoList from '../components/main/Todolist';
import Calendar from '../components/main/Calendar';
import Toast from '../components/toast/Toast';
import ErrToast from '../components/toast/ErrToast';
import { fetchTodosByMonth } from "../api/todo";
import Loading from '../components/loading/Loading';
import CheeringPopup from '../components/cheering/CheeringPopup'; 
import { fetchDietsByMonth } from "../api/diet";
const MainPage = () => {
  const [showModal, setShowModal] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [showErrToast, setShowErrToast] = useState(false);
  const [errToastMessage, setErrToastMessage] = useState('');
  const [monthTodos, setMonthTodos] = useState([]);
  const [monthDiets, setMonthDiets] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [cheering, setCheering] = useState("");
  const [showCheerPopup, setShowCheerPopup] = useState(false);
  const [currentTodoMonth, setCurrentTodoMonth] = useState('');
  const [currentDietMonth, setCurrentDietMonth] = useState('');

  const getLocalDateString = (date) => {
    return date.getFullYear() + '-' +
      String(date.getMonth() + 1).padStart(2, '0') + '-' +
      String(date.getDate()).padStart(2, '0');
  };

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  const triggerErrToast = (msg) => {
    setErrToastMessage(msg);
    setShowErrToast(true);
    setTimeout(() => setShowErrToast(false), 2000);
  };

  const handleSaved = (aiResponse) => {
    if (aiResponse?.cheering) {
      setCheering(aiResponse.cheering);
      setShowCheerPopup(true);
    } else {
      window.location.reload();
    }
  };
  const forceSyncMonthTodos = useCallback(() => {
    const ym = `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, "0")}`;
    fetchTodosByMonth(ym).then(res => {
      setMonthTodos(res.data);
      setCurrentTodoMonth(ym); // 필요하면 이건 유지
    });
  }, [selectedDate]);

  const forceSyncMonthDiets = useCallback(() => {
    const ym = `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, "0")}`;
    fetchDietsByMonth(ym).then(res => {
      setMonthDiets(res.data);
      setCurrentDietMonth(ym); // 필요하면 이건 유지
    });
  }, [selectedDate]);
  // 월별 todo 동기화 함수
  const syncMonthTodos = useCallback(() => {
    const ym = `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, "0")}`;
    if (currentTodoMonth === ym) return; 
    setCurrentTodoMonth(ym);
    fetchTodosByMonth(ym).then(res => setMonthTodos(res.data));
  }, [selectedDate, currentTodoMonth]);

  const syncMonthDiets = useCallback(() => {
    const ym = `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, "0")}`;
    if (currentDietMonth === ym) return; 
    setCurrentDietMonth(ym);
    fetchDietsByMonth(ym).then(res => setMonthDiets(res.data));
  }, [selectedDate, currentDietMonth]);

  // 메인 페이지 진입 시 달력 동기화
  useEffect(() => {
    syncMonthTodos();
  }, [selectedDate]);

  useEffect(() => {
    syncMonthDiets();
  }, []);

  return (
    <>
      {isLoading && <Loading fullscreen />}
      {showToast && <Toast message={toastMessage} />}
      {showErrToast && <ErrToast message={errToastMessage} onClose={() => setShowErrToast(false)} />}
      {showCheerPopup && <CheeringPopup message={cheering} />}
      {showModal && <MainModal 
        onClose={() => setShowModal(false)}
        triggerToast={triggerToast}
        triggerErrToast={triggerErrToast}
        setIsLoading={setIsLoading}
        onSaved={handleSaved}
      />}
      {!showModal && (
        <MainPageWrapper>
          <Header />
          <MainContent>
            <Calendar
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
              setMonthTodos={setMonthTodos}
              monthTodos={monthTodos}
              monthDiets={monthDiets}
            />
            <TodoList
              selectedDate={selectedDate}
              triggerErrToast={triggerErrToast}
              triggerToast={triggerToast}
              monthTodos={monthTodos}
              onTodoAdded={() => {
                forceSyncMonthTodos();
                forceSyncMonthDiets();
              }}
            />
          </MainContent>
          <MealBox>
            {(() => {
              const dateStr = getLocalDateString(selectedDate);
              const diet = monthDiets.find(d => d.date === dateStr);
              return diet ? (
              <div>
                <p>🍳 아침: {diet.breakfast}</p>
                <p>🍱 점심: {diet.lunch}</p>
                <p>🍖 저녁: {diet.dinner}</p>
              </div>
              ) : "식단 정보 없음";
            })()}
          </MealBox>
          {(() => {
            const dateStr = getLocalDateString(selectedDate);
            const todayTodos = monthTodos.filter(todo => todo.date === dateStr);
            const youtubeTodos = todayTodos.filter(todo => todo.youtubeId);

            return youtubeTodos.length > 0 ? (
            <VideoBox>
              <h2 style={{ marginBottom: "16px" }}>🎬 운동 추천 영상</h2>
              <VideoGrid>
                {youtubeTodos.map(todo => (
                  <VideoCard key={todo.todoItemId}>
                    <iframe
                      src={`https://www.youtube.com/embed/${todo.youtubeId}`}
                      title={todo.youtubeTitle}
                      frameBorder="0"
                      allowFullScreen
                    />
                    <p>{todo.youtubeTitle}</p>
                  </VideoCard>
                ))}
              </VideoGrid>
            </VideoBox>
            ) : null;
          })()}
        </MainPageWrapper>
      )}
    </>
  );
};
const VideoBox = styled.div`
  min-width: 100%;
  margin-top: 24px;
  padding: 24px;
  border: 2px solid #444;
  border-radius: 12px;
  background: #fafafa;
`;
const VideoGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  justify-content: center;
`;

const VideoCard = styled.div`
  width: 320px;
  iframe {
    width: 100%;
    height: 180px;
    border-radius: 8px;
  }
  p {
    font-size: 14px;
    margin-top: 8px;
    text-align: center;
  }
`;
const MainPageWrapper = styled.div`
  min-height: 100vh;
  background: #fff;
  padding: 32px;
`;

const MainContent = styled.div`
  display: flex;
  gap: 32px;
  margin-bottom: 32px;
`;

const MealBox = styled.div`
  min-width: 100%;
  min-height: 180px;
  border: 1.5px solid #222;
  border-radius: 8px;
  margin-top: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 40px;
  font-weight: 400;
  background: #fff;
`;

export default MainPage;
