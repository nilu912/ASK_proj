import API from '../api/axios';

export const registerUser = async (formData) => {
  const response = await API.post('/auth/register', formData);
  return response.data;
};
