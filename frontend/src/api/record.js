import axios from "./axios";

export async function postRecord(form) {
  const today = new Date().toISOString().split('T')[0];
  const postData = {
    ...Object.fromEntries(
      Object.entries(form).map(([k, v]) => [k, Number(v)])
    ),
    date: today,
  };

  const response = await axios.post('/records', postData);
  return response.data;
}