import API from '../services/api';

export const createGoal = async (goalData) => {
  const res = await API.post('/goals', goalData);
  return res.data;
};
