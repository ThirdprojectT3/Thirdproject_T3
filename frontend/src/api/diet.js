import axios from "./axios";

// 월별 식단 조회
export const fetchDietsByMonth = (ym) => {
  return axios
    .get(`/diet/month`, { params: { ym }, withCredentials: true })
    .then(res => {
      return res;
    })
    .catch(err => {
      throw err;
    });
};