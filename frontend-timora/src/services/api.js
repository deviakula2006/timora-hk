const BASE_URL = "http://localhost:9000/api";

export const apiRequest = async (url, method, data) => {
  const token = localStorage.getItem("token");

  const res = await fetch(`${BASE_URL}${url}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: token,
    },
    body: data ? JSON.stringify(data) : null,
  });

  return res.json();
};
