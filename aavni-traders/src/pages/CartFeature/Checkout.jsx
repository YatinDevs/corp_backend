// src/components/Checkout.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import useStore from "../../store/useStore";
import { useToast } from "../../context/ToastContext";

const Checkout = () => {
  const { cartItems, clearCart } = useStore();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [shippingInfo, setShippingInfo] = useState({
    name: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    phone: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingInfo((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    if (cartItems.length === 0) {
      addToast("Your cart is empty", "error");
      return false;
    }

    const requiredFields = ["name", "address", "city", "state", "zip", "phone"];
    for (const field of requiredFields) {
      if (!shippingInfo[field]) {
        addToast(
          `Please fill in ${field.replace(/([A-Z])/g, " $1").toLowerCase()}`,
          "error"
        );
        return false;
      }
    }

    // Validate phone number
    if (!/^\d{10}$/.test(shippingInfo.phone)) {
      addToast("Please enter a valid 10-digit phone number", "error");
      return false;
    }

    // Validate ZIP code
    if (!/^\d{6}$/.test(shippingInfo.zip)) {
      addToast("Please enter a valid 6-digit ZIP code", "error");
      return false;
    }

    return true;
  };

  const handleCheckout = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      // Prepare order data
      const orderData = {
        items: cartItems.map((item) => ({
          product_id: item.id,
          quantity: item.quantity,
          price: item.price,
          name: item.name,
        })),
        total_amount: cartItems.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        ),
        payment_method: "razorpay",
        shipping_address: shippingInfo,
      };

      // Create order
      const response = await axios.post("/api/orders", orderData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      // Initialize Razorpay payment
      const options = {
        key: response.data.key,
        amount: response.data.amount,
        currency: response.data.currency,
        name: "Aavni Traders",
        description: `Order #${response.data.order_id}`,
        order_id: response.data.razorpay_order_id,
        handler: async function (response) {
          try {
            const verificationResponse = await axios.post(
              "/api/payments/verify",
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                order_id: response.data.order_id,
              },
              {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
              }
            );

            if (verificationResponse.data.success) {
              clearCart();
              addToast(
                "Payment successful! Your order has been placed.",
                "success"
              );
              navigate("/order-success", {
                state: { orderId: response.data.order_id },
              });
            } else {
              addToast(
                "Payment verification failed. Please contact support.",
                "error"
              );
            }
          } catch (error) {
            console.error("Payment verification error:", error);
            addToast(
              error.response?.data?.error ||
                "Payment verification failed. Please contact support.",
              "error"
            );
          }
        },
        prefill: {
          name: shippingInfo.name,
          email: localStorage.getItem("email") || "",
          contact: shippingInfo.phone,
        },
        notes: {
          address: shippingInfo.address,
        },
        theme: {
          color: "#3399cc",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", (response) => {
        addToast(`Payment failed: ${response.error.description}`, "error");
      });
      rzp.open();
    } catch (error) {
      console.error("Checkout error:", error);
      let errorMessage = "Checkout failed. Please try again.";

      if (error.response) {
        if (error.response.status === 401) {
          errorMessage = "Please login to proceed";
          navigate("/login");
        } else if (error.response.data?.outOfStock) {
          const outOfStockItems = error.response.data.outOfStock
            .map((item) => item.name)
            .join(", ");
          errorMessage = `Some items are out of stock: ${outOfStockItems}`;
        } else if (error.response.data?.message) {
          errorMessage = error.response.data.message;
        }
      } else if (error.message) {
        errorMessage = error.message;
      }

      addToast(errorMessage, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Shipping Info Form */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-lg shadow mb-6">
            <h2 className="text-xl font-semibold mb-4">Shipping Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={shippingInfo.name}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={shippingInfo.phone}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                  maxLength="10"
                  pattern="[0-9]{10}"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Address *
                </label>
                <input
                  type="text"
                  name="address"
                  value={shippingInfo.address}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    City *
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={shippingInfo.city}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    State *
                  </label>
                  <input
                    type="text"
                    name="state"
                    value={shippingInfo.state}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  ZIP Code *
                </label>
                <input
                  type="text"
                  name="zip"
                  value={shippingInfo.zip}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                  maxLength="6"
                  pattern="[0-9]{6}"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-lg shadow sticky top-4">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            <div className="divide-y">
              {cartItems.map((item) => (
                <div key={item.id} className="py-3 flex justify-between">
                  <div>
                    <p className="font-medium">
                      {item.name} × {item.quantity}
                    </p>
                    {item.specifications?.size && (
                      <p className="text-xs text-gray-500">
                        Size: {item.specifications.size}
                      </p>
                    )}
                  </div>
                  <span className="font-medium">
                    ₹{(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div className="space-y-3 mt-4 pt-4 border-t">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">
                  ₹
                  {cartItems
                    .reduce(
                      (total, item) => total + item.price * item.quantity,
                      0
                    )
                    .toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Delivery</span>
                <span className="font-medium">
                  {cartItems.reduce(
                    (total, item) => total + item.price * item.quantity,
                    0
                  ) > 2000 ? (
                    <span className="text-green-600">Free</span>
                  ) : (
                    `₹50.00`
                  )}
                </span>
              </div>
              <div className="flex justify-between text-lg font-bold pt-2 border-t">
                <span>Total</span>
                <span>
                  ₹
                  {(
                    cartItems.reduce(
                      (total, item) => total + item.price * item.quantity,
                      0
                    ) +
                    (cartItems.reduce(
                      (total, item) => total + item.price * item.quantity,
                      0
                    ) > 2000
                      ? 0
                      : 50)
                  ).toFixed(2)}
                </span>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              disabled={loading || cartItems.length === 0}
              className={`w-full mt-6 py-3 rounded-lg transition-colors flex items-center justify-center gap-2 ${
                loading || cartItems.length === 0
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 text-white"
              }`}
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Processing...
                </>
              ) : (
                "Proceed to Payment"
              )}
            </button>

            <p className="text-xs text-gray-500 mt-3 text-center">
              By placing your order, you agree to our{" "}
              <Link to="/terms" className="text-blue-600 hover:underline">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link to="/privacy" className="text-blue-600 hover:underline">
                Privacy Policy
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
