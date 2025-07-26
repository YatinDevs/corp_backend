import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronDown } from "lucide-react";

function PopupForm({ setIsOpen, isOpen }) {
  // Show popup after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 10000); // 5000 milliseconds = 5 seconds

    return () => clearTimeout(timer); // Clean up the timer on component unmount
  }, []);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-gradient-to-br from-gray-900/80 to-indigo-900/80 backdrop-blur-md"
            onClick={() => setIsOpen(false)}
          />

          {/* Form container - Responsive sizing */}
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.98 }}
            transition={{
              type: "spring",
              damping: 25,
              stiffness: 400,
              duration: 0.3,
            }}
            className="relative w-full max-w-2xl mx-2 h-[80vh]" // Increased max-width for iframe
          >
            <div className="relative bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden border border-white/20 h-full flex flex-col">
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-3 right-3 p-1 rounded-full hover:bg-gray-100/50 transition-all z-10"
                aria-label="Close form"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>

              {/* Header */}
              <div className="p-4 sm:p-6 border-b">
                <motion.h2
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-xl sm:text-2xl font-bold text-gray-800"
                >
                  Book Enquiry - Contact Suji Careers
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.7 }}
                  transition={{ delay: 0.15 }}
                  className="text-xs sm:text-sm text-gray-500 mt-1"
                >
                  Fill out the form and we'll get back to you shortly
                </motion.p>
              </div>

              {/* Iframe container with flex-grow to take remaining space */}
              <div className="flex-grow relative">
                <iframe
                  src="https://login.masteraix.io/widget/form/681879b77da32"
                  className="absolute inset-0 w-full h-full"
                  style={{
                    border: "none",
                    borderRadius: "0 0 12px 12px", // Match the container's rounded corners at bottom
                  }}
                  id="inline-681879b77da32"
                  data-form-name="First-Application-Form"
                  data-layout-iframe-id="inline-681879b77da32"
                  data-form-id="681879b77da32"
                  title="First-Application-Form"
                  loading="lazy"
                />
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default PopupForm;
