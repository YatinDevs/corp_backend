// src/store/useStore.js
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import {
  fetchCategories,
  fetchComboPacks,
  fetchProducts,
} from "../services/apiService";

// Helper function for generating toast messages
const getToastMessage = (action, success = true, productName = "Item") => {
  const messages = {
    add: success ? "added to cart" : "failed to add to cart",
    remove: success ? "removed from cart" : "failed to remove from cart",
    update: success ? "quantity updated" : "failed to update quantity",
    clear: success ? "cart cleared" : "failed to clear cart",
  };
  return `${productName} ${messages[action]}`;
};

export const useStore = create(
  persist(
    (set, get) => ({
      // Products state
      products: [],
      featuredProducts: [],
      loadingStates: {
        products: false,
        categories: false,
        comboPacks: false,
      },
      errors: {
        products: null,
        categories: null,
        comboPacks: null,
      },

      // Categories state
      categories: [],

      // Combo Packs state
      comboPacks: [],

      // Cart state
      cartItems: [],
      isCartOpen: false,
      toast: null,

      // Data fetching actions
      fetchProducts: async () => {
        set({
          loadingStates: { ...get().loadingStates, products: true },
          errors: { ...get().errors, products: null },
        });

        try {
          const response = await fetchProducts();
          set({
            products: response.data,
            loadingStates: { ...get().loadingStates, products: false },
          });
        } catch (error) {
          set({
            errors: { ...get().errors, products: error.message },
            loadingStates: { ...get().loadingStates, products: false },
          });
          get().toast?.addToast?.(
            `Failed to load products: ${error.message}`,
            "error"
          );
        }
      },

      fetchCategories: async () => {
        set({
          loadingStates: { ...get().loadingStates, categories: true },
          errors: { ...get().errors, categories: null },
        });

        try {
          const response = await fetchCategories();
          set({
            categories: response,
            loadingStates: { ...get().loadingStates, categories: false },
          });
        } catch (error) {
          set({
            errors: { ...get().errors, categories: error.message },
            loadingStates: { ...get().loadingStates, categories: false },
          });
          get().toast?.addToast?.(
            `Failed to load categories: ${error.message}`,
            "error"
          );
        }
      },

      fetchComboPacks: async () => {
        set({
          loadingStates: { ...get().loadingStates, comboPacks: true },
          errors: { ...get().errors, comboPacks: null },
        });

        try {
          const response = await fetchComboPacks();
          set({
            comboPacks: response.data,
            loadingStates: { ...get().loadingStates, comboPacks: false },
          });
        } catch (error) {
          set({
            errors: { ...get().errors, comboPacks: error.message },
            loadingStates: { ...get().loadingStates, comboPacks: false },
          });
          get().toast?.addToast?.(
            `Failed to load combo packs: ${error.message}`,
            "error"
          );
        }
      },

      // Cart actions
      addToCart: (product) => {
        const { toast, cartItems } = get();
        const existingItem = cartItems.find((item) => item.id === product.id);

        try {
          // Validation
          if (product.stock_quantity <= 0) {
            toast?.addToast?.("This product is out of stock", "error");
            return false;
          }

          if (existingItem && existingItem.quantity >= product.stock_quantity) {
            toast?.addToast?.("Maximum available quantity reached", "warning");
            return false;
          }

          set({
            cartItems: existingItem
              ? cartItems.map((item) =>
                  item.id === product.id
                    ? { ...item, quantity: item.quantity + 1 }
                    : item
                )
              : [
                  ...cartItems,
                  {
                    ...product,
                    quantity: 1,
                    addedAt: Date.now(),
                  },
                ],
          });

          toast?.addToast?.(
            getToastMessage("add", true, product.name),
            "success"
          );
          return true;
        } catch (error) {
          toast?.addToast?.(
            getToastMessage("add", false, product.name),
            "error"
          );
          console.error("Add to cart error:", error);
          return false;
        }
      },

      removeFromCart: (productId) => {
        const { toast, cartItems } = get();
        const product = cartItems.find((item) => item.id === productId);

        try {
          set({
            cartItems: cartItems.filter((item) => item.id !== productId),
          });

          toast?.addToast?.(
            getToastMessage("remove", true, product?.name),
            "info"
          );
          return true;
        } catch (error) {
          toast?.addToast?.(getToastMessage("remove", false), "error");
          console.error("Remove from cart error:", error);
          return false;
        }
      },

      updateQuantity: (productId, quantity) => {
        const { toast, cartItems } = get();
        const product = cartItems.find((item) => item.id === productId);

        try {
          // Validation
          if (quantity < 1) {
            toast?.addToast?.("Quantity must be at least 1", "warning");
            return false;
          }

          if (quantity > product?.stock_quantity) {
            toast?.addToast?.("Not enough stock available", "error");
            return false;
          }

          set({
            cartItems: cartItems.map((item) =>
              item.id === productId
                ? { ...item, quantity: Math.max(1, quantity) }
                : item
            ),
          });

          toast?.addToast?.(
            getToastMessage("update", true, product?.name),
            "success"
          );
          return true;
        } catch (error) {
          toast?.addToast?.(getToastMessage("update", false), "error");
          console.error("Update quantity error:", error);
          return false;
        }
      },

      clearCart: () => {
        const { toast } = get();
        try {
          set({ cartItems: [] });
          toast?.addToast?.(getToastMessage("clear", true), "info");
          return true;
        } catch (error) {
          toast?.addToast?.(getToastMessage("clear", false), "error");
          console.error("Clear cart error:", error);
          return false;
        }
      },

      // Cart visibility
      openCart: () => set({ isCartOpen: true }),
      closeCart: () => set({ isCartOpen: false }),
      toggleCart: () => set((state) => ({ isCartOpen: !state.isCartOpen })),

      // Initialize toast in store
      setToast: (toast) => set({ toast }),
    }),
    {
      name: "ecommerce-store",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        cartItems: state.cartItems,
      }),
      version: 1, // Useful for future migrations
    }
  )
);

// Selectors for computed values
export const useCartTotal = () =>
  useStore((state) =>
    state.cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    )
  );

export const useItemCount = () =>
  useStore((state) =>
    state.cartItems.reduce((count, item) => count + item.quantity, 0)
  );

// Additional useful selectors
export const useCartItem = (productId) =>
  useStore((state) => state.cartItems.find((item) => item.id === productId));

export const useIsProductInCart = (productId) =>
  useStore((state) => state.cartItems.some((item) => item.id === productId));
