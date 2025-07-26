import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiFilter,
  FiChevronDown,
  FiX,
  FiSearch,
  FiHeart,
  FiShoppingCart,
} from "react-icons/fi";
import { FaStar, FaRegStar, FaStarHalfAlt } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useStore } from "../../store/useStore";

const ProductsShowcase = () => {
  const {
    products = { data: [] },
    categories = [],
    loadingStates: { products: loadingProducts, categories: loadingCategories },
    errors: { products: productsError, categories: categoriesError },
    fetchProducts,
    fetchCategories,
  } = useStore();

  const [activeFilter, setActiveFilter] = useState("All");
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [hoveredProduct, setHoveredProduct] = useState(null);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [fetchProducts, fetchCategories]);

  const filteredProducts = products
    ? activeFilter === "All"
      ? products
      : products.filter((product) => product.category?.name === activeFilter)
    : [];

  const searchedProducts =
    filteredProducts?.filter((product) => {
      const nameMatch = product.name
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase());
      const descMatch = product.description
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase());
      return nameMatch || descMatch;
    }) || [];

  const clearFilters = () => {
    setActiveFilter("All");
    setSearchQuery("");
  };

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

  if (loadingProducts || loadingCategories) {
    return (
      <div className="py-16 bg-[#F9F5F0] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#a30d14]"></div>
      </div>
    );
  }

  if (productsError || categoriesError) {
    return (
      <div className="py-16 bg-[#F9F5F0] flex items-center justify-center">
        <div className="text-[#a30d14]">{productsError || categoriesError}</div>
      </div>
    );
  }

  return (
    <section className="py-16 bg-[#F9F5F0]">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h2 className="text-3xl font-bold text-[#a30d14]">
              Our Premium Gift Collection
            </h2>
            <p className="text-[#5e0808] mt-2">
              {activeFilter === "All" ? "All gifts" : activeFilter}
            </p>
          </div>

          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[#5e0808]" />
              <input
                type="text"
                placeholder="Search gifts..."
                className="w-full pl-10 pr-4 py-2 border border-[#d4d3d0] rounded-lg focus:ring-2 focus:ring-[#a30d14] focus:border-[#a30d14]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#5e0808] hover:text-[#a30d14]"
                >
                  <FiX size={18} />
                </button>
              )}
            </div>

            <button
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              className="md:hidden flex items-center gap-2 bg-[#d4d3d0] hover:bg-[#fcce01] px-4 py-2 rounded-lg transition-colors text-[#5e0808]"
            >
              <FiFilter />
              <span>Filters</span>
              <FiChevronDown
                className={`transition-transform ${
                  showMobileFilters ? "rotate-180" : ""
                }`}
              />
            </button>
          </div>
        </div>

        {(activeFilter !== "All" || searchQuery) && (
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <span className="text-sm text-[#5e0808]">Active filters:</span>
            {activeFilter !== "All" && (
              <div className="flex items-center bg-[#fcce01] text-[#5e0808] px-3 py-1 rounded-full text-sm">
                {activeFilter}
                <button
                  onClick={() => setActiveFilter("All")}
                  className="ml-2 text-[#a30d14] hover:text-[#5e0808]"
                >
                  <FiX size={16} />
                </button>
              </div>
            )}
            {searchQuery && (
              <div className="flex items-center bg-[#d4d3d0] text-[#5e0808] px-3 py-1 rounded-full text-sm">
                Search: "{searchQuery}"
                <button
                  onClick={() => setSearchQuery("")}
                  className="ml-2 text-[#a30d14] hover:text-[#5e0808]"
                >
                  <FiX size={16} />
                </button>
              </div>
            )}
            <button
              onClick={clearFilters}
              className="text-sm text-[#a30d14] hover:text-[#5e0808] underline"
            >
              Clear all
            </button>
          </div>
        )}

        <AnimatePresence>
          {showMobileFilters && (
            <motion.div
              className="md:hidden mb-6 bg-white p-4 rounded-lg shadow-lg border border-[#d4d3d0]"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ type: "spring", damping: 25 }}
            >
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => {
                    setActiveFilter("All");
                    setShowMobileFilters(false);
                  }}
                  className={`px-4 py-2 rounded-lg text-sm text-left ${
                    activeFilter === "All"
                      ? "bg-[#a30d14] text-white"
                      : "bg-[#d4d3d0] text-[#5e0808] hover:bg-[#fcce01]"
                  }`}
                >
                  All Gifts
                </button>
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => {
                      setActiveFilter(category.name);
                      setShowMobileFilters(false);
                    }}
                    className={`px-4 py-2 rounded-lg text-sm text-left ${
                      activeFilter === category.name
                        ? "bg-[#a30d14] text-white"
                        : "bg-[#d4d3d0] text-[#5e0808] hover:bg-[#fcce01]"
                    }`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="hidden md:flex gap-3 mb-8 overflow-x-auto pb-2">
          <button
            onClick={() => setActiveFilter("All")}
            className={`px-4 py-2 rounded-full whitespace-nowrap ${
              activeFilter === "All"
                ? "bg-[#a30d14] text-white"
                : "bg-[#d4d3d0] text-[#5e0808] hover:bg-[#fcce01]"
            }`}
          >
            All Gifts
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveFilter(category.name)}
              className={`px-4 py-2 rounded-full whitespace-nowrap ${
                activeFilter === category.name
                  ? "bg-[#a30d14] text-white"
                  : "bg-[#d4d3d0] text-[#5e0808] hover:bg-[#fcce01]"
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>

        {searchedProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {searchedProducts.map((product, index) => {
              const rating = getRandomRating();
              return (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  whileHover={{ y: -5 }}
                  onHoverStart={() => setHoveredProduct(product.id)}
                  onHoverEnd={() => setHoveredProduct(null)}
                  className="relative group"
                >
                  <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow border border-[#d4d3d0]/50">
                    {/* Product Image */}
                    <div className="relative h-48 overflow-hidden">
                      <motion.img
                        src={
                          product.images?.[0] ||
                          "https://via.placeholder.com/300"
                        }
                        alt={product.name}
                        className="w-full h-full object-cover"
                        initial={{ scale: 1 }}
                        animate={{
                          scale: hoveredProduct === product.id ? 1.05 : 1,
                        }}
                        transition={{ duration: 0.3 }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />

                      {/* Quick actions */}
                      <div className="absolute top-3 right-3 flex flex-col gap-2">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="bg-white/90 p-2 rounded-full shadow-md"
                        >
                          <FiHeart className="text-[#a30d14]" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="bg-white/90 p-2 rounded-full shadow-md"
                        >
                          <FiShoppingCart className="text-[#a30d14]" />
                        </motion.button>
                      </div>
                    </div>

                    {/* Product Info */}
                    <div className="p-4">
                      <div className="flex justify-between items-start mb-1">
                        <h3 className="font-bold text-[#5e0808] line-clamp-1">
                          {product.name}
                        </h3>
                        <span className="text-[#a30d14] font-bold">
                          ₹{product.price}
                        </span>
                      </div>

                      <div className="flex items-center mb-2">
                        <div className="flex mr-2">{renderStars(rating)}</div>
                        <span className="text-xs text-[#5e0808]/80">
                          ({Math.floor(Math.random() * 100) + 1})
                        </span>
                      </div>

                      <p className="text-sm text-[#5e0808]/80 line-clamp-2 mb-3">
                        {product.description}
                      </p>

                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full"
                      >
                        <button className="w-full bg-[#a30d14] hover:bg-[#5e0808] text-white py-2 px-4 rounded-lg transition-colors text-sm font-medium">
                          Add to Cart
                        </button>
                      </motion.div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-[#5e0808] mb-4">
              <FiSearch size={48} className="mx-auto" />
            </div>
            <p className="text-[#5e0808] text-lg mb-4">
              No gifts found matching your criteria
            </p>
            <button
              onClick={clearFilters}
              className="text-[#a30d14] font-medium underline hover:text-[#5e0808]"
            >
              Reset filters
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductsShowcase;
