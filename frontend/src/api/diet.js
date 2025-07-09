import axios from "./axios";

// 월별 식단 조회
export const fetchDietsByMonth = (ym) => {
  console.log("📦 월별 식단 요청 전송:", ym); // ✅ 요청 파라미터 출력

  return axios
    .get(`/diet/month`, { params: { ym }, withCredentials: true })
    .then(res => {
      console.log("📥 월별 식단 응답 데이터:", res.data); // ✅ 응답 데이터 출력
      return res;
    })
    .catch(err => {
      console.error("❌ 월별 식단 요청 실패:", err);
      throw err;
    });
};