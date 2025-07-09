import React from 'react';
import { useNavigate } from 'react-router-dom';
import UserCompareChart from '../components/charts/UserCompareChart';
import ChangeTrendChart from '../components/charts/ChangeTrendChart';
import './GraphPage.css';

export default function GraphPage() {
  const navigate = useNavigate();

  return (
    <div className="graphPageWrapper">
      <button className="homeButton" onClick={() => navigate('/main')}>
        <div className="shadow"></div>
        <div className="edge"></div>
        <div className="front">
          <span>home</span>
        </div>
      </button>

      {/* 막대그래프 */}
      <UserCompareChart />

      {/* 꺾은선 그래프 */}
      <ChangeTrendChart />
    </div>
  );
}
