import { apiRequest } from "./api";

export const loginUser = (email, password) => {
  return apiRequest("/user/login", "POST", { email, password });
};

export const signupUser = (email, password) => {
  return apiRequest("/user/signup", "POST", { email, password });
};
