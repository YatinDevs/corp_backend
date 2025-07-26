// src/Layout/Layout.jsx
import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import WhatsAppPopup from "../components/PopUp/WhatsAppPopup";
import ScrollToTop from "../components/ScrollToTop/ScrollToTop";
import CartSidebar from "../pages/CartFeature/CartSidebar";
import { useToast } from "../context/ToastContext";
import { useStore } from "../store/useStore";

export const CartContext = React.createContext();

function Layout() {
  const { addToast, removeToast } = useToast();
  const setToast = useStore((state) => state.setToast);

  React.useEffect(() => {
    setToast({ addToast, removeToast });
  }, [addToast, removeToast, setToast]);

  return (
    <>
      <ScrollToTop />
      <Navbar />
      <main className="relative min-h-[calc(100vh-120px)]">
        <Outlet />
      </main>
      <Footer />
      <WhatsAppPopup />
      <CartSidebar />
    </>
  );
}

export default Layout;
