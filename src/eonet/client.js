import axios from 'axios';

export const eonet = axios.create({
  baseURL: 'https://eonet.gsfc.nasa.gov/api/v3',
  timeout: 15000
});

// Helpers: categories, events?status=open&limit=...
export const fetchCategories = () => eonet.get('/categories').then(r => r.data);
export const fetchEventsByCategory = ({ categoryId, status = 'open', limit = 50 }) =>
  eonet.get(`/categories/${categoryId}?status=${status}&limit=${limit}`).then(r => r.data);
