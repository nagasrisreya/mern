import { create } from "zustand";
import axios from "axios";

export const useAuthStore = create((set) => ({
  user: JSON.parse(localStorage.getItem("user")) || null, // Restore user from local storage
  login: async (email, password) => {
    try {
      const response = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
      });
      const { token } = response.data;
      const user = { email, token };
      console.log("User:", user);
      localStorage.setItem("user", JSON.stringify(user)); // Persist user in local storage
      set({ user });
      return { success: true };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || "Login failed" };
    }
  },
  logout: () => {
    localStorage.removeItem("user"); // Remove user from local storage
    set({ user: null });
  },
  isAuthenticated: () => {
    const user = JSON.parse(localStorage.getItem("user"));
    return !!user;
  },
}));