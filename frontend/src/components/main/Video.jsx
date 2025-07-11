import React from 'react';
import './Video.css';

const Video = ({ selectedDate, monthTodos, getLocalDateString }) => {
  const dateStr = getLocalDateString(selectedDate);
  const todayTodos = monthTodos.filter(todo => todo.date === dateStr);
  const youtubeTodos = todayTodos.filter(todo => todo.youtubeId);

  if (youtubeTodos.length === 0) return null;

  return (
    <div className="video-box">
      <h2 className="video-title">🎬 운동 추천 영상</h2>
      <div className="video-grid">
        {youtubeTodos.map(todo => (
          <div className="video-card" key={todo.todoItemId}>
            <iframe
              src={`https://www.youtube.com/embed/${todo.youtubeId}`}
              title={todo.youtubeTitle}
              allowFullScreen
            />
            <p>{todo.youtubeTitle}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Video;
