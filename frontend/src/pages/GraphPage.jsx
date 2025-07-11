import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UserCompareChart from '../components/charts/UserCompareChart';
import ChangeTrendChart from '../components/charts/ChangeTrendChart';
import './GraphPage.css';

export default function GraphPage() {
  const navigate = useNavigate();
  const [errToastMessage, setErrToastMessage] = useState('');
  const [showErrToast, setShowErrToast] = useState(false);

  const handleChartError = (msg) => {
    setErrToastMessage(msg);
    setShowErrToast(true);
  };

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
          <UserCompareChart onError={handleChartError}/>
        </div>

        <div className="graphBox">
          <ChangeTrendChart onError={handleChartError} />
        </div>
      </div>
      {showErrToast && (
        <ErrToast
          message={errToastMessage}
          onClose={() => setShowErrToast(false)}
        />
      )}
    </div>
  );
}

