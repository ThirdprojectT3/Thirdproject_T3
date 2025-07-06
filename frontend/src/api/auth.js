import axios from "axios";

const BASE_URL = "http://localhost:8080/api";  // 네 백엔드 주소로 바꿔줘

export const postLogin = async (data) => {
  return await axios.post(`${BASE_URL}/auth/login`, data, {
    headers: {
      "Content-Type": "application/json",
    },
  });
};

export const postRegister = async (data) => {
  const response = await axios.post(`${BASE_URL}/auth/register`, data, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.data;
};
