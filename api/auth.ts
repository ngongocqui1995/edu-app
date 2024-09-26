import API from "../utils/request";

export const loginAccount = async (body: any) => {
  return await API.post(`auth/login`, body, {
    headers: { "x-custom-lang": "vi" },
  });
};

export const getProfile = async (token: string) => {
  return await API.get(`auth/profile`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
