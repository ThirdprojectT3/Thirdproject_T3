import React, { useEffect, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  Legend, CartesianGrid, ResponsiveContainer
} from 'recharts';
import { getUserAnalysis } from '../../api/charts';

export default function UserCompareChart() {
  const [chartData, setChartData] = useState([]);
  const [ageTitle, setAgeTitle] = useState('평균과 비교하기'); // 제목만 저장

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await getUserAnalysis();
        const { myrecord, average, age } = res;

        const data = [
          { name: '체중', 나: myrecord.weight, 평균: average.weight },
          { name: '체지방', 나: myrecord.fat, 평균: average.fat },
          { name: '골격근량', 나: myrecord.muscle, 평균: average.muscle },
          { name: '기초대사량', 나: myrecord.bmr, 평균: average.bmr },
          { name: 'BMI', 나: myrecord.bmi, 평균: average.bmi },
          { name: '내장지방', 나: myrecord.vai, 평균: average.vai },
        ];

        setChartData(data);
        setAgeTitle(`${age}살의 평균과 비교하기`); // 제목만 저장
      } catch (error) {
        console.error('사용자 분석 데이터 불러오기 실패:', error);
      }
    }

    fetchData();
  }, []);

  return (
    <div className="w-full">
      <h2 style={{ textAlign: 'center', marginBottom: '16px', fontSize: '20px', fontWeight: 'bold' }}>{ageTitle}</h2>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis scale="log" domain={['auto', 'auto']} />
          <Tooltip />
          <Legend />
          <Bar dataKey="나" fill="#8884d8" />
          <Bar dataKey="평균" fill="#82ca9d" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
