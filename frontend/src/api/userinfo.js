import axios from "./axios";

export const getUserInfo = async (userId) => {
  const res = await axios.get(`/members/${userId}`);
  return res.data;
};

