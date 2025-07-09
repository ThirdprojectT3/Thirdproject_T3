// src/api/record.js
import axios from "./axios";

export async function postRecord(form) {
  const today = new Date().toISOString().split('T')[0];

  const postData = {
    weight: Number(form.weight),
    fat: Number(form.fat),
    muscle: Number(form.muscle),
    bmr: Number(form.bmr),
    bmi: Number(form.bmi),
    vai: Number(form.vai),
    sleep: Number(form.sleep),
    prompt: form.prompt,
    place: form.place,
    date: today,
  };

  const response = await axios.post('/records', postData);
  return response.data;
}
