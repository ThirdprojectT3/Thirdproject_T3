import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, CartesianGrid, ResponsiveContainer } from 'recharts';
import { getGraphData } from '../../api/charts';

export default function ChangeTrendChart({ onError }) {
  const [category, setCategory] = useState('체지방');
  const [duration, setDuration] = useState('1w');
  const [chartData, setChartData] = useState([]);

  const categories = ['체지방', '골격근량', '기초대사량', 'BMI', '내장지방지수'];

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await getGraphData(duration, category);
        const formattedData = res.myRecords.map(item => ({
          date: item.date,
          값: item.value,
        }));
        setChartData(formattedData);
      } catch {
        if (onError) onError('그래프 데이터 불러오기 실패');
      }
    }

    fetchData();
  }, [category, duration]);

  const getDurationLabel = (d) => {
    if (d === '1w') return '1주일';
    if (d === '1m') return '한달';
    if (d === '3m') return '3개월';
    return d;
  };

  return (
    <div>
      {/* 제목 */}
      <h2 style={{ textAlign: 'center', marginBottom: '16px', fontSize: '20px', fontWeight: 'bold' }}>
        최근 {getDurationLabel(duration)} 동안 {category} 변화
      </h2>

      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '16px',
      }}>

        {/* 버튼들 */}
        <div>
          {['1w', '1m', '3m'].map((d) => (
            <button
              key={d}
              style={{
                marginRight: '8px',
                background: duration === d ? '#bdbdbd' : '#e0e0e0',
                border: 'none',
                borderRadius: '6px',
                padding: '6px 16px',
                cursor: 'pointer',
              }}
              onClick={() => setDuration(d)}
            >
              {getDurationLabel(d)}
            </button>
          ))}
        </div>

        {/* 드롭다운 */}
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          style={{
            padding: "8px 16px",
            fontSize: "16px",
            border: "1px solid #ccc",
            borderRadius: "8px",
            backgroundColor: "#ffffff",
            outline: "none",
            cursor: "pointer",
          }}
        >
          {categories.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      {/* 꺾은선 그래프 */}
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="값" stroke="#8884d8" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
