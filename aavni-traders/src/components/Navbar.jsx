import React, { useState, useEffect } from "react";
import {
  Menu,
  X,
  ChevronDown,
  Phone,
  Mail,
  MapPin,
  ShoppingBag,
  ShoppingCart,
  Gift,
  Briefcase,
  Info,
  Home,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useStore, useItemCount } from "../store/useStore";
import { logo } from "../assets";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const itemCount = useItemCount();
  const { isCartOpen, openCart, closeCart, toggleCart } = useStore();

  const navItems = [
    { label: "Home", path: "/", icon: <Home className="h-4 w-4 mr-2" /> },
    {
      label: "Corporate Gifts",
      path: "/corporate-gifts",
      icon: <Briefcase className="h-4 w-4 mr-2" />,
      subItems: [
        "Festive Gifts",
        "Welcome Kits",
        "Exhibition Gifts",
        "Luxury Gifts",
        "Employee Appreciation",
      ],
    },
    {
      label: "Gift Categories",
      path: "/categories",
      icon: <Gift className="h-4 w-4 mr-2" />,
      subItems: [
        "Dry Fruit Hampers",
        "Spiritual Gifts",
        "Paithani Products",
        "Gold & Silver Gifts",
        "Healthy Cookies Hampers",
        "Customized Gift Sets",
      ],
    },
    {
      label: "Special Occasions",
      path: "/occasions",
      icon: <ShoppingBag className="h-4 w-4 mr-2" />,
      subItems: [
        "Wedding Gifts",
        "Return Gifts",
        "Anniversary Gifts",
        "Festival Gifts",
        "Corporate Milestones",
      ],
    },
    {
      label: "About Us",
      path: "/about",
      icon: <Info className="h-4 w-4 mr-2" />,
    },
    {
      label: "Contact",
      path: "/contact",
      icon: <Phone className="h-4 w-4 mr-2" />,
    },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleDropdown = (dropdown) => {
    setOpenDropdown(openDropdown === dropdown ? null : dropdown);
  };

  useEffect(() => {
    if (isCartOpen) {
      setIsMenuOpen(false);
    }
  }, [isCartOpen]);

  return (
    <header className="fixed w-full z-50">
      {/* Top Contact Bar */}
      <div className=" relative">
        {/* Yellow curved section */}
        <div
          className={`relative z-10 w-1/2 rounded-br-full bg-[#d4d3d0] text-[#1b53a5] text-sm transition-all duration-300 ${
            scrolled ? "h-14 overflow-hidden" : "h-14"
          }`}
        >
          <div className="container mx-auto px-4 h-full flex items-center justify-around">
            <div className="hidden md:flex items-center space-x-6 ">
              <a
                href="mailto:smitaaaher@corpgiftgpt.com"
                className="flex items-center hover:text-[#a30d14] transition-colors"
              >
                <Mail className="h-4 w-4 mr-1" />
                smitaaaher@corpgiftgpt.com
              </a>
              <a
                href="tel:+917030875102"
                className="flex items-center hover:text-[#a30d14] transition-colors"
              >
                <Phone className="h-4 w-4 mr-1" />
                +91 70308 75102
              </a>
            </div>
          </div>
        </div>

        {/* Red section - positioned to overlap */}
        <div
          className={`relative bg-[#1b53a5] text-white text-sm transition-all duration-300 ${
            scrolled ? "h-10 overflow-hidden -mt-14" : "h-10 -mt-14"
          }`}
        >
          <div className="container mx-auto px-4 h-full flex items-center justify-end">
            <div className="hidden md:flex items-center space-x-4">
              <MapPin className="h-4 w-4 mr-1 text-[#fcce01]" />
              <span>Maharashtra</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <nav
        className={`bg-white shadow-md transition-all duration-300 ${
          scrolled ? "py-4" : "py-6"
        }`}
      >
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center">
            <a href="/" className="text-2xl font-bold text-[#1b53a5]">
              <img src={logo} alt="CORP GIFT GPT" className="h-12 w-auto" />
            </a>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-6">
            {navItems.map((item) => (
              <div key={item.label} className="relative group">
                {item.subItems ? (
                  <>
                    <button
                      onClick={() => toggleDropdown(item.label)}
                      className="flex items-center text-gray-800 hover:text-[#a30d14] transition-colors font-medium"
                    >
                      {item.icon}
                      {item.label}
                      <ChevronDown
                        className={`ml-1 h-4 w-4 transition-transform ${
                          openDropdown === item.label ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    <AnimatePresence>
                      {openDropdown === item.label && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          className="absolute left-0 mt-2 w-56 bg-white rounded-md shadow-lg z-50 border border-gray-200"
                        >
                          <div className="py-1">
                            {item.subItems.map((subItem) => (
                              <a
                                key={subItem}
                                href={`/${item.path}/${subItem
                                  .toLowerCase()
                                  .replace(/\s+/g, "-")}`}
                                className="block px-4 py-2 text-gray-700 hover:bg-[#a30d14]/10 hover:text-[#a30d14] transition-colors text-sm"
                                onClick={() => setOpenDropdown(null)}
                              >
                                {subItem}
                              </a>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </>
                ) : (
                  <a
                    href={item.path}
                    className="flex items-center text-gray-800 hover:text-[#a30d14] transition-colors font-medium"
                  >
                    {item.icon}
                    {item.label}
                  </a>
                )}
              </div>
            ))}

            {/* Shopping Cart Button */}
            <button
              onClick={toggleCart}
              className="relative ml-4 bg-[#a30d14] hover:bg-[#7a0a0f] text-white px-4 py-2 rounded-lg flex items-center transition-colors group"
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              Cart
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#fcce01] text-gray-800 text-xs rounded-full w-5 h-5 flex items-center justify-center transform group-hover:scale-110 transition-transform">
                  {itemCount}
                </span>
              )}
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden items-center gap-4">
            <button
              onClick={toggleCart}
              className="relative p-2 text-gray-800 hover:text-[#a30d14]"
            >
              <ShoppingCart size={20} />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#fcce01] text-gray-800 text-xs rounded-full w-4 h-4 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </button>
            <button
              className="text-gray-800 focus:outline-none"
              onClick={toggleMenu}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "tween" }}
            className="fixed inset-0 bg-white z-40 lg:hidden overflow-y-auto"
          >
            <div className="container mx-auto px-4 py-6">
              <div className="flex justify-between items-center mb-8">
                <div className="flex items-center">
                  <img src="/logo.png" alt="CORP GIFT GPT" className="h-10" />
                </div>
                <button onClick={toggleMenu} className="text-gray-800">
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-2">
                {navItems.map((item) => (
                  <div
                    key={item.label}
                    className="border-b border-gray-200/30 pb-2"
                  >
                    {item.subItems ? (
                      <>
                        <button
                          onClick={() => toggleDropdown(item.label)}
                          className="flex items-center justify-between w-full py-3 text-gray-800 font-medium"
                        >
                          <div className="flex items-center">
                            {item.icon}
                            <span className="ml-2">{item.label}</span>
                          </div>
                          <ChevronDown
                            className={`h-5 w-5 transition-transform ${
                              openDropdown === item.label ? "rotate-180" : ""
                            }`}
                          />
                        </button>
                        {openDropdown === item.label && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="pl-8 overflow-hidden"
                          >
                            <div className="py-2 space-y-2">
                              {item.subItems.map((subItem) => (
                                <a
                                  key={subItem}
                                  href={`/${item.path}/${subItem
                                    .toLowerCase()
                                    .replace(/\s+/g, "-")}`}
                                  className="block py-2 text-gray-700/80 hover:text-[#a30d14] transition-colors text-sm"
                                  onClick={toggleMenu}
                                >
                                  {subItem}
                                </a>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </>
                    ) : (
                      <a
                        href={item.path}
                        className="flex items-center py-3 text-gray-800 hover:text-[#a30d14] transition-colors font-medium"
                        onClick={toggleMenu}
                      >
                        {item.icon}
                        <span className="ml-2">{item.label}</span>
                      </a>
                    )}
                  </div>
                ))}
              </div>

              <div className="mt-8 p-4 bg-gray-100 rounded-lg">
                <h3 className="font-semibold text-gray-800 mb-3">Contact Us</h3>
                <a
                  href="mailto:smitaaaher@corpgiftgpt.com"
                  className="flex items-center text-gray-700 mb-2 text-sm"
                >
                  <Mail className="h-5 w-5 mr-2 text-[#a30d14]" />
                  smitaaaher@corpgiftgpt.com
                </a>
                <a
                  href="tel:+917030875102"
                  className="flex items-center text-gray-700 mb-2 text-sm"
                >
                  <Phone className="h-5 w-5 mr-2 text-[#a30d14]" />
                  +91 70308 75102
                </a>
                <div className="flex items-start text-gray-700 text-sm">
                  <MapPin className="h-5 w-5 mr-2 text-[#a30d14] mt-1" />
                  <span>
                    Ashwin Nagar, Cidco, Nashik - 422009, Maharashtra, Bharat
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
