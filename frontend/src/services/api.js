import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;

const getTokenHeader = () => {
  const token = localStorage.getItem("token");
  return { Authorization: `Bearer ${token}` };
};

export const loginUser = async (email, password) => {
  const res = await axios.post(`${API_URL}/api/auth/login`, { email, password });
  return res.data;
};

export const getNotes = async () => {
  const res = await axios.get(`${API_URL}/api/notes`, { headers: getTokenHeader() });
  return res.data;
};

export const createNote = async (title, content) => {
  const res = await axios.post(
    `${API_URL}/api/notes`, // added /api
    { title, content },
    { headers: getTokenHeader() }
  );
  return res.data;
};

export const updateNote = async (id, title, content) => {
  const res = await axios.put(
    `${API_URL}/api/notes/${id}`,
    { title, content },
    { headers: getTokenHeader() }
  );
  return res.data;
};

export const deleteNote = async (id) => {
  const res = await axios.delete(
    `${API_URL}/api/notes/${id}`, 
    { headers: getTokenHeader() }
  );
  return res.data;
};

export const upgradeTenant = async (slug) => {
  const res = await axios.post(`${API_URL}/api/tenants/${slug}/upgrade`, {}, { headers: getTokenHeader() });
  return res.data;
};

console.log("API_URL:", API_URL);
