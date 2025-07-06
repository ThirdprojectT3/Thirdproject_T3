export async function postRecord(form, token) {
  const today = new Date().toISOString().split('T')[0];
  const postData = {
    ...Object.fromEntries(
      Object.entries(form).map(([k, v]) => [k, Number(v)])
    ),
    date: today,
  };

  const response = await fetch('http://localhost:8080/api/records', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(postData),
  });

  if (!response.ok) throw new Error('서버 오류');
  return response.json();
}