import axios from 'axios';

const API = axios.create({
  baseURL: 'https://goalgenie.onrender.com/api',
});

export default API;
