// pages/MainPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import './MainPage.css';
import MainModal from '../components/main/MainModal';
import Header from '../components/header/Header';
import TodoList from '../components/main/TodoList';
import Calendar from '../components/main/Calendar';
import Toast from '../components/toast/Toast';
import ErrToast from '../components/toast/ErrToast';
import Loading from '../components/loading/Loading';
import CheeringPopup from '../components/cheering/CheeringPopup';
import Meal from '../components/main/Meal';
import Video from '../components/main/Video';
import { fetchTodosByMonth } from '../api/todo';
import { fetchDietsByMonth } from '../api/diet';

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
  const [cheering, setCheering] = useState('');
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
    const ym = `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}`;
    fetchTodosByMonth(ym).then(res => {
      setMonthTodos(res.data);
      setCurrentTodoMonth(ym);
    });
  }, [selectedDate]);

  const forceSyncMonthDiets = useCallback(() => {
    const ym = `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}`;
    fetchDietsByMonth(ym).then(res => {
      setMonthDiets(res.data);
      setCurrentDietMonth(ym);
    });
  }, [selectedDate]);

  const syncMonthTodos = useCallback(() => {
    const ym = `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}`;
    if (currentTodoMonth === ym) return;
    setCurrentTodoMonth(ym);
    fetchTodosByMonth(ym).then(res => setMonthTodos(res.data));
  }, [selectedDate, currentTodoMonth]);

  const syncMonthDiets = useCallback(() => {
    const ym = `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}`;
    if (currentDietMonth === ym) return;
    setCurrentDietMonth(ym);
    fetchDietsByMonth(ym).then(res => setMonthDiets(res.data));
  }, [selectedDate, currentDietMonth]);

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
      {showModal ? (
        <MainModal
          onClose={() => setShowModal(false)}
          triggerToast={triggerToast}
          triggerErrToast={triggerErrToast}
          setIsLoading={setIsLoading}
          onSaved={handleSaved}
        />
      ) : (
        <div className="main-page-wrapper">
          <Header />
          <div className="main-content">
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
          </div>
          <Meal
            selectedDate={selectedDate}
            monthDiets={monthDiets}
            getLocalDateString={getLocalDateString}
          />
          <Video
            selectedDate={selectedDate}
            monthTodos={monthTodos}
            getLocalDateString={getLocalDateString}
          />
        </div>
      )}
    </>
  );
};

export default MainPage;
