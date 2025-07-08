import axios from "./axios";

export const postLogin = async (data) => {
  return await axios.post("/auth/login", data);
};

export const postRegister = async (data) => {
  const response = await axios.post("/auth/register", data);
  return response.data;
};