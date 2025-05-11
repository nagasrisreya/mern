import { create } from "zustand";
import { useAuthStore } from "./auth"; // Import the auth store

const url = "http://localhost:5000/api/products"; // Adjust port if necessary

export const useProductStore = create((set) => ({
  products: [],
  setProducts: (products) => set({ products }),
  createProduct: async (newProduct) => {
    if (!newProduct.name || !newProduct.image || !newProduct.description || !newProduct.state) {
      return { success: false, message: "Please fill in all fields." };
    }

    const { user } = useAuthStore.getState(); // Get the user from the auth store
     // Log the token for debugging

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`, // Include the token in the headers
        },
        body: JSON.stringify(newProduct),
      });
      

      if (!res.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await res.json();
      set((state) => ({ products: [...state.products, data.data] }));
      return { success: true, message: "travel log created successfully" };
    } catch (error) {
      console.error("Error during fetch:", error);
      return { success: false, message: error.message };
    }
  },

  fetchProducts: async () => {
    const res = await fetch(url);
    const data = await res.json();
    set({ products: data.data });
  },

  deleteProduct: async (pid) => {
    const { user } = useAuthStore.getState(); // Get the user from the auth store

    if (!user || !user.token) {
        console.error("User not authenticated");
        return { success: false, message: "User not authenticated" };
    }

    // console.log("Bearer Token:", user.token); // Log the Bearer token

    try {
        const res = await fetch(`/api/products/${pid}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${user.token}`, // Include the token in the headers
            },
        });

        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.message || "Failed to delete travel log");
        }

        const data = await res.json();

        // Update the UI immediately, without needing a refresh
        set((state) => ({ products: state.products.filter((product) => product._id !== pid) }));

        return { success: true, message: data.message };
    } catch (error) {
        console.error("Error deleting travel log:", error.message);
        return { success: false, message: error.message };
    }
  },

  updateProduct: async (pid, updatedProduct) => {
    const { user } = useAuthStore.getState(); // Get the user from the auth store

    const res = await fetch(`/api/products/${pid}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`, // Include the token in the headers
      },
      body: JSON.stringify(updatedProduct),
    });
    const data = await res.json();
    if (!data.success) return { success: false, message: data.message };

    // update the ui immediately, without needing a refresh
    set((state) => ({
      products: state.products.map((product) => (product._id === pid ? data.data : product)),
    }));

    return { success: true, message: data.message };
  },
}));