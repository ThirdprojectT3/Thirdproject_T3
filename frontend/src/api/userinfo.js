import axios from "./axios";

export const getUserInfo = async (userId) => {
  const res = await axios.get(`/members/${userId}`);
  return res.data;
};

export const patchUserInfo = async (userId, data) => {
  const res = await axios.put(`/members/${userId}`, data);
  return res.data;
};