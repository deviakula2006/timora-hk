import { apiRequest } from "./api";

export const fetchProfile = () => {
  return apiRequest("/user/profile", "GET");
};
