import React from 'react';
import { useNavigate } from 'react-router-dom';
import UserCompareChart from '../components/charts/UserCompareChart';
import ChangeTrendChart from '../components/charts/ChangeTrendChart';
import './GraphPage.css';

export default function GraphPage() {
  const navigate = useNavigate();

  return (
    <div className="graphPageBackground"> {/* ✅ 전체 배경 */}
      <button className="homeButton" onClick={() => navigate('/main')}>
        <div className="shadow"></div>
        <div className="edge"></div>
        <div className="front">
          <span>home</span>
        </div>
      </button>

      <div className="graphPageWrapper">
        <div className="graphBox">
          <UserCompareChart />
        </div>

        <div className="graphBox">
          <ChangeTrendChart />
        </div>
      </div>
    </div>
  );
}

