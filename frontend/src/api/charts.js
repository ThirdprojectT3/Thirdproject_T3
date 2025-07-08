import axios from './axios'; // 인스턴스지만 이름을 axios로 사용

export const getUserAnalysis = async () => {
  const res = await axios.get('/records/analysis');
  return res.data;
};

export const getGraphData = async (duration, category) => {
  const res = await axios.get('/records/graph', {
    params: { duration, category },
  });
  return res.data;
};
