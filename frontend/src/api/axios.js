import axios from "axios";
import Cookies from "js-cookie";

const instance = axios.create({
  baseURL: "http://localhost:8080/api",
  headers: { "Content-Type": "application/json" },
});

instance.interceptors.request.use(
  (config) => {
    const token = Cookies.get('jwtToken');  // 로그인 시 저장한 토큰
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;  // 토큰 자동 추가
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default instance;