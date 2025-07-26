// src/components/CartSidebar.jsx
import { X, ShoppingCart, ArrowRight, Trash2, Plus, Minus } from "lucide-react";
import { Link } from "react-router-dom";

import { useCartTotal, useItemCount, useStore } from "../../store/useStore";
import { useToast } from "../../context/ToastContext";

const EmptyCartIllustration = () => (
  <svg
    width="200"
    height="200"
    viewBox="0 0 200 200"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M50 50C50 22.3858 72.3858 0 100 0C127.614 0 150 22.3858 150 50V150C150 177.614 127.614 200 100 200C72.3858 200 50 177.614 50 150V50Z"
      fill="#F3F4F6"
    />
    <path
      d="M75 62.5C75 56.1487 80.1487 51 86.5 51H113.5C119.851 51 125 56.1487 125 62.5V137.5C125 143.851 119.851 149 113.5 149H86.5C80.1487 149 75 143.851 75 137.5V62.5Z"
      fill="#E5E7EB"
    />
    <path
      d="M85 70C85 65.0294 89.0294 61 94 61H106C110.971 61 115 65.0294 115 70V130C115 134.971 110.971 139 106 139H94C89.0294 139 85 134.971 85 130V70Z"
      fill="#FFFFFF"
    />
    <circle cx="100" cy="170" r="10" fill="#9CA3AF" />
    <circle cx="140" cy="60" r="10" fill="#9CA3AF" />
    <circle cx="60" cy="60" r="10" fill="#9CA3AF" />
    <path
      d="M70 30H130"
      stroke="#9CA3AF"
      strokeWidth="4"
      strokeLinecap="round"
    />
  </svg>
);

const CartSidebar = () => {
  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    isCartOpen,
    closeCart,
    clearCart,
  } = useStore();
  const { addToast } = useToast();

  // Use the selectors
  const cartTotal = useCartTotal();
  const itemCount = useItemCount();

  // Calculate delivery fee
  const deliveryFee = cartTotal > 2000 ? 0 : 50;
  const totalWithDelivery = cartTotal + deliveryFee;

  const handleClearCart = () => {
    try {
      clearCart();
      addToast("Cart has been cleared", "info");
    } catch (error) {
      addToast("Failed to clear cart", "error");
      console.error("Clear cart error:", error);
    }
  };

  const handleRemoveItem = (item) => {
    try {
      removeFromCart(item.id);
      addToast(`${item.name} removed from cart`, "info");
    } catch (error) {
      addToast("Failed to remove item", "error");
      console.error("Remove item error:", error);
    }
  };

  const handleQuantityChange = (item, newQuantity) => {
    try {
      if (newQuantity < 1) {
        addToast("Quantity must be at least 1", "warning");
        return;
      }

      if (newQuantity > item.stock_quantity) {
        addToast(`Only ${item.stock_quantity} available in stock`, "error");
        return;
      }

      updateQuantity(item.id, newQuantity);
    } catch (error) {
      addToast("Failed to update quantity", "error");
      console.error("Update quantity error:", error);
    }
  };

  return (
    <div className={`fixed inset-0 z-50 ${isCartOpen ? "block" : "hidden"}`}>
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/50 transition-opacity duration-300"
        onClick={closeCart}
      />

      {/* Cart Panel */}
      <div
        className={`absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl transition-transform duration-300 ease-in-out ${
          isCartOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="border-b p-4 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <ShoppingCart size={20} className="text-blue-600" />
              <h3 className="text-xl font-bold">Your Cart ({itemCount})</h3>
            </div>
            <div className="flex items-center gap-2">
              {cartItems.length > 0 && (
                <button
                  onClick={handleClearCart}
                  className="text-sm text-red-500 hover:text-red-700 flex items-center gap-1"
                >
                  <Trash2 size={16} />
                  <span>Clear</span>
                </button>
              )}
              <button
                onClick={closeCart}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-4">
            {cartItems.length === 0 ? (
              <div className="text-center py-12 flex flex-col items-center h-full justify-center">
                <EmptyCartIllustration className="w-48 h-48 mb-6" />
                <p className="text-gray-500 text-lg mb-4">Your cart is empty</p>
                <Link
                  to="/products"
                  onClick={closeCart}
                  className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
                >
                  <ShoppingCart size={18} />
                  <span>Start Shopping</span>
                </Link>
              </div>
            ) : (
              <ul className="divide-y">
                {cartItems.map((item) => (
                  <li key={`${item.id}-${item.addedAt}`} className="py-4">
                    <div className="flex gap-4">
                      <Link
                        to={`/product/${item.id}`}
                        onClick={closeCart}
                        className="w-20 h-20 bg-gray-100 rounded-md overflow-hidden flex-shrink-0"
                      >
                        <img
                          src={item.images?.[0] || "/placeholder-product.jpg"}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </Link>
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <Link
                            to={`/product/${item.id}`}
                            onClick={closeCart}
                            className="font-medium hover:text-blue-600"
                          >
                            {item.name}
                          </Link>
                          <span className="font-bold">₹{item.price}</span>
                        </div>

                        {item.specifications?.size && (
                          <p className="text-xs text-gray-500 mt-1">
                            Size: {item.specifications.size}
                          </p>
                        )}

                        <div className="flex justify-between items-center mt-3">
                          <div className="flex items-center border rounded-md overflow-hidden">
                            <button
                              onClick={() =>
                                handleQuantityChange(item, item.quantity - 1)
                              }
                              className="px-3 py-1 bg-gray-100 hover:bg-gray-200 transition-colors"
                              disabled={item.quantity <= 1}
                            >
                              <Minus size={14} />
                            </button>
                            <span className="px-3 w-10 text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                handleQuantityChange(item, item.quantity + 1)
                              }
                              className="px-3 py-1 bg-gray-100 hover:bg-gray-200 transition-colors"
                              disabled={item.quantity >= item.stock_quantity}
                            >
                              <Plus size={14} />
                            </button>
                          </div>
                          <button
                            onClick={() => handleRemoveItem(item)}
                            className="text-red-500 hover:text-red-700 text-sm flex items-center gap-1"
                          >
                            <Trash2 size={14} />
                            <span>Remove</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Footer */}
          {cartItems.length > 0 && (
            <div className="border-t p-4 bg-gray-50">
              <div className="space-y-3 mb-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">₹{cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Delivery</span>
                  <span className="font-medium">
                    {deliveryFee === 0 ? (
                      <span className="text-green-600">Free</span>
                    ) : (
                      `₹${deliveryFee.toFixed(2)}`
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-lg font-bold pt-2 border-t">
                  <span>Total</span>
                  <span>₹{totalWithDelivery.toFixed(2)}</span>
                </div>
              </div>

              <Link
                to="/checkout"
                onClick={closeCart}
                className="block w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg text-center font-medium transition-colors flex items-center justify-center gap-2"
              >
                Proceed to Checkout
                <ArrowRight size={18} />
              </Link>

              <Link
                to="/products"
                onClick={closeCart}
                className="block mt-3 text-center text-blue-600 hover:text-blue-800 hover:underline text-sm"
              >
                Continue Shopping
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartSidebar;
