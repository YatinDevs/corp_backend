import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useStore } from "../../store/useStore";
import {
  Gift,
  Box,
  Home,
  Briefcase,
  Cake,
  Diamond,
  Leaf,
  Coffee,
} from "lucide-react";

const CategoriesSection = () => {
  const {
    categories,
    loadingStates: { categories: loadingCategories },
    errors: { categories: categoriesError },
    fetchCategories,
  } = useStore();

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // Map category slugs to icons
  const getCategoryIcon = (slug) => {
    const iconMap = {
      "corporate-gifts": <Briefcase className="h-8 w-8 text-[#a30d14]" />,
      "festive-gifts": <Cake className="h-8 w-8 text-[#fcce01]" />,
      "welcome-kits": <Home className="h-8 w-8 text-[#1b53a5]" />,
      "dry-fruit-hampers": <Leaf className="h-8 w-8 text-[#a30d14]" />,
      "luxurious-gifts": <Diamond className="h-8 w-8 text-[#fcce01]" />,
      "spiritual-gifts": <Coffee className="h-8 w-8 text-[#1b53a5]" />,
    };
    return iconMap[slug] || <Gift className="h-8 w-8 text-[#a30d14]" />;
  };

  // Generate placeholder images based on category
  const getCategoryImage = (slug) => {
    const imageMap = {
      "corporate-gifts":
        "https://images.unsplash.com/photo-1600880292203-757bb62b4baf",
      "festive-gifts":
        "https://images.unsplash.com/photo-1604061986761-d9a4d4b45b05",
      "welcome-kits":
        "https://images.unsplash.com/photo-1556905055-8f358a7a47b2",
      "dry-fruit-hampers":
        "https://images.unsplash.com/photo-1601493700631-2b16ec4b4716",
      "luxurious-gifts":
        "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f",
      "spiritual-gifts":
        "https://images.unsplash.com/photo-1589998059171-988d887df646",
    };
    return (
      imageMap[slug] ||
      "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf"
    );
  };

  // Generate color classes based on index
  const getColorClass = (index) => {
    const colors = [
      "bg-[#fcce01]/20",
      "bg-[#a30d14]/20",
      "bg-[#1b53a5]/20",
      "bg-[#d4d3d0]/20",
    ];
    return colors[index % colors.length];
  };

  if (loadingCategories) {
    return (
      <div className="py-16 bg-[#F9F5F0] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#a30d14]"></div>
      </div>
    );
  }

  if (categoriesError) {
    return (
      <div className="py-16 bg-[#F9F5F0] flex items-center justify-center">
        <div className="text-[#a30d14]">{categoriesError}</div>
      </div>
    );
  }

  return (
    <section className="py-16 bg-[#F9F5F0]">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[#a30d14] mb-4">
            Our Gifting Categories
          </h2>
          <p className="text-[#5e0808] max-w-2xl mx-auto text-lg">
            Discover unique and customized corporate gifting solutions
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6">
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
              className="group"
            >
              <Link to={`/category/${category.slug}`} className="block">
                <div className="relative overflow-hidden rounded-xl aspect-square bg-white shadow-sm hover:shadow-md transition-all duration-300 border border-[#d4d3d0]">
                  <img
                    src={getCategoryImage(category.slug)}
                    alt={category.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent flex flex-col items-center justify-end p-6">
                    <div
                      className={`${getColorClass(
                        index
                      )} p-3 rounded-full mb-3 group-hover:scale-110 transition-transform`}
                    >
                      {getCategoryIcon(category.slug)}
                    </div>
                    <h3 className="text-white font-bold text-lg sm:text-xl text-center">
                      {category.name}
                    </h3>
                    <span className="text-white/80 text-sm mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      {category.products_count} options →
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;
