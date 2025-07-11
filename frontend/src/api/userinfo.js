import axios from "./axios";

export const getUserInfo = async () => {
  const res = await axios.get(`/members/me`);
  return res.data;
};

export const patchUserInfo = async (data) => {
  const res = await axios.put(`/members/me`, data);
  return res.data;
};