import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useStore } from "../../store/useStore";
import { FiShoppingCart, FiHeart, FiTag, FiGift } from "react-icons/fi";
import { FaStar, FaRegStar, FaStarHalfAlt } from "react-icons/fa";

const ComboPacksShowcase = () => {
  const {
    comboPacks = { data: [] },
    loadingStates: { comboPacks: loadingComboPacks },
    errors: { comboPacks: comboPacksError },
    fetchComboPacks,
  } = useStore();

  useEffect(() => {
    fetchComboPacks();
  }, [fetchComboPacks]);

  // Generate random ratings (for demo)
  const getRandomRating = () => {
    const ratings = [4, 4.5, 5];
    return ratings[Math.floor(Math.random() * ratings.length)];
  };

  // Render star rating
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<FaStar key={i} className="text-[#fcce01] text-sm" />);
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(
          <FaStarHalfAlt key={i} className="text-[#fcce01] text-sm" />
        );
      } else {
        stars.push(<FaRegStar key={i} className="text-[#fcce01] text-sm" />);
      }
    }
    return stars;
  };

  if (loadingComboPacks) {
    return (
      <div className="py-16 bg-[#F9F5F0] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#a30d14]"></div>
      </div>
    );
  }

  if (comboPacksError) {
    return (
      <div className="py-16 bg-[#F9F5F0] flex items-center justify-center">
        <div className="text-[#a30d14]">{comboPacksError}</div>
      </div>
    );
  }

  const hasComboPacks = comboPacks?.length > 0;

  return (
    <section className="py-16 bg-[#F9F5F0]">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-[#a30d14] mb-4">
              <FiGift className="inline mr-2 text-[#fcce01]" />
              Custom Gift Combos
              <FiGift className="inline ml-2 text-[#fcce01]" />
            </h2>
          </motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-[#5e0808] max-w-2xl mx-auto text-lg"
          >
            Special gift combinations tailored to your budget and requirements
          </motion.p>
        </div>

        {hasComboPacks ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {comboPacks?.map((combo, index) => {
              const rating = getRandomRating();
              return (
                <motion.div
                  key={combo.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                  className="group"
                >
                  <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow border border-[#d4d3d0]/50 relative">
                    {/* Discount Ribbon */}
                    <div className="absolute top-4 left-0 bg-[#fcce01] text-[#5e0808] px-3 py-1 text-sm font-bold z-10 shadow-md">
                      <FiTag className="inline mr-1" />
                      {Math.round(
                        ((combo.price - combo.discount_price) / combo.price) *
                          100
                      )}
                      % OFF
                    </div>

                    <div className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="text-xl font-bold text-[#a30d14]">
                          {combo.name}
                        </h3>
                        <div className="text-right">
                          <span className="text-gray-500 line-through mr-2 text-sm">
                            ₹{combo.price}
                          </span>
                          <span className="text-2xl font-bold text-[#1b53a5]">
                            ₹{combo.discount_price}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center mb-4">
                        <div className="flex mr-2">{renderStars(rating)}</div>
                        <span className="text-xs text-[#5e0808]/80">
                          ({Math.floor(Math.random() * 50) + 1})
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-6">
                        {combo.products?.map((product) => (
                          <motion.div
                            key={product.id}
                            whileHover={{ scale: 1.05 }}
                            className="border rounded-lg p-3 flex flex-col items-center border-[#d4d3d0] bg-[#F9F5F0]/50"
                          >
                            {product.images?.[0] ? (
                              <img
                                src={product.images[0]}
                                alt={product.name}
                                className="h-16 w-16 object-contain mb-2"
                              />
                            ) : (
                              <div className="h-16 w-16 bg-[#F9F5F0] rounded flex items-center justify-center mb-2">
                                <span className="text-[#5e0808] text-xs">
                                  No image
                                </span>
                              </div>
                            )}
                            <p className="text-sm font-medium text-center text-[#5e0808] line-clamp-1">
                              {product.name}
                            </p>
                            <p className="text-xs text-[#5e0808]">
                              Qty: {product.pivot?.quantity || 1}
                            </p>
                          </motion.div>
                        ))}
                      </div>

                      <div className="flex gap-3">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="flex-1 bg-[#a30d14] hover:bg-[#5e0808] text-white py-2 px-4 rounded-lg transition-colors text-sm font-medium flex items-center justify-center gap-2"
                        >
                          <FiShoppingCart />
                          Add to Cart
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="w-10 h-10 bg-[#d4d3d0] hover:bg-[#fcce01] text-[#5e0808] rounded-lg transition-colors flex items-center justify-center"
                        >
                          <FiHeart />
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-center py-12"
          >
            <div className="bg-white p-8 rounded-xl shadow-sm border border-[#d4d3d0] max-w-md mx-auto">
              <FiGift className="mx-auto text-[#a30d14] text-4xl mb-4" />
              <h3 className="text-xl font-bold text-[#5e0808] mb-2">
                No Combo Packs Available
              </h3>
              <p className="text-[#5e0808] mb-4">
                Contact us to create custom gift combos for your needs
              </p>
              <Link
                to="/contact"
                className="inline-block bg-[#a30d14] hover:bg-[#5e0808] text-white py-2 px-6 rounded-lg transition-colors text-sm font-medium"
              >
                Contact Now
              </Link>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default ComboPacksShowcase;
