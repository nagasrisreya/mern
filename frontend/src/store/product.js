import { create } from "zustand";
const url = "/api/products";
export const useProductStore = create((set) => ({
	products: [],
	setProducts: (products) => set({ products }),
	createProduct: async (newProduct) => {
        if (!newProduct.name || !newProduct.image || !newProduct.description) {
          return { success: false, message: "Please fill in all fields." };
        }
        try {
          const res = await fetch(url, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(newProduct),
          });
      
          if (!res.ok) {
            throw new Error("Network response was not ok");
          }
      
          const data = await res.json();
          set((state) => ({ products: [...state.products, data.data] }));
          return { success: true, message: "Product created successfully" };
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
		const res = await fetch(`/api/products/${pid}`, {
			method: "DELETE",
		});
		const data = await res.json();
		if (!data.success) return { success: false, message: data.message };

		// update the ui immediately, without needing a refresh
		set((state) => ({ products: state.products.filter((product) => product._id !== pid) }));
		return { success: true, message: data.message };
	},
	updateProduct: async (pid, updatedProduct) => {
		const res = await fetch(`/api/products/${pid}`, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
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