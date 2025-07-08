import axios from './axios';

export const fetchMyUserId = async () => {
  const res = await axios.get('/members/myUserId', { withCredentials: true });
  return res.data; // 서버가 숫자(Long) 그대로 return 한다고 가정
};