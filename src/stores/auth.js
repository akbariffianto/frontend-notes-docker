// src/store/auth.js
import { writable } from 'svelte/store';

// Membuat store untuk token dan status login
export const token = writable(localStorage.getItem("accessToken") || null);
export const isLoggedIn = writable(!!localStorage.getItem("accessToken"));

export const setToken = (newToken) => {
  token.set(newToken);
  localStorage.setItem("accessToken", newToken);
  isLoggedIn.set(true);
};

export const clearToken = () => {
  token.set(null);
  localStorage.removeItem("accessToken");
  isLoggedIn.set(false);
};
