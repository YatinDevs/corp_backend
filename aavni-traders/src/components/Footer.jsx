import React from "react";
import {
  FaFacebookF,
  FaLinkedinIn,
  FaTwitter,
  FaInstagram,
} from "react-icons/fa";
import { MdOutlineEmail } from "react-icons/md";
import { IoLocationOutline, IoCallOutline } from "react-icons/io5";
import { motion } from "framer-motion";
import { BsBriefcase, BsGift } from "react-icons/bs";
import { Mail, MapPin, Phone } from "lucide-react";

const Footer = () => {
  const socialIcons = [
    { icon: FaLinkedinIn, label: "LinkedIn", color: "text-[#DEAF29]" },
    { icon: FaTwitter, label: "Twitter", color: "text-[#DEAF29]" },
    { icon: FaFacebookF, label: "Facebook", color: "text-[#DEAF29]" },
    { icon: FaInstagram, label: "Instagram", color: "text-[#DEAF29]" },
  ];

  const productCategories = [
    { name: "Corporate Gifts", link: "/corporate-gifts" },
    { name: "Festive Gifts", link: "/festive-gifts" },
    { name: "Welcome Kits", link: "/welcome-kits" },
    { name: "Dry Fruit Hampers", link: "/dry-fruit-hampers" },
    { name: "Luxurious Gifts", link: "/luxurious-gifts" },
    { name: "Spiritual Gifts", link: "/spiritual-gifts" },
  ];

  const quickLinks = [
    { name: "Bulk Orders", link: "/bulk-orders" },
    { name: "Custom Branding", link: "/custom-branding" },
    { name: "About Us", link: "/about" },
    { name: "Testimonials", link: "/testimonials" },
    { name: "Contact Us", link: "/contact" },
  ];

  return (
    <>
      <motion.footer
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="bg-[#410306] text-[#D3D2D2] -mb-10  pt-16 pb-10 px-6 md:px-16"
      >
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* About Section */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center mb-4">
              <h2 className="text-xl font-bold text-[#fcce01]">
                CORP GIFT GPT
              </h2>
            </div>
            <p className="text-[#d4d3d0]/80 text-sm mb-4">
              "Delivers Smile & Spreading Happiness" worldwide with innovative
              gifting solutions. We help businesses build brand loyalty through
              unique and customized corporate gifts.
            </p>
            <div className="flex gap-4 mt-6">
              {socialIcons.map(({ icon: Icon, label, color }, index) => (
                <motion.a
                  key={index}
                  href="#"
                  whileHover={{ scale: 1.2, y: -5 }}
                  whileTap={{ scale: 0.9 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  title={label}
                  className={`cursor-pointer bg-[#2F263B] p-3 rounded-full hover:bg-[#5e0808] ${color}`}
                >
                  <Icon size={16} />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Product Categories */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h3 className="text-lg font-semibold mb-4 flex items-center text-[#DEAF29]">
              <BsGift className="mr-2" />
              Our Products
            </h3>
            <ul className="space-y-2">
              {productCategories.map((link, index) => (
                <motion.li
                  key={index}
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <a
                    href={link.link}
                    className="text-[#D3D2D2]/80 hover:text-[#DEAF29] transition-colors flex items-center text-sm"
                  >
                    {link.name}
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h3 className="text-lg font-semibold mb-4 flex items-center text-[#DEAF29]">
              <BsBriefcase className="mr-2" />
              Corporate Solutions
            </h3>
            <ul className="space-y-2">
              {quickLinks.map((link, index) => (
                <motion.li
                  key={index}
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <a
                    href={link.link}
                    className="text-[#D3D2D2]/80 hover:text-[#DEAF29] transition-colors text-sm"
                  >
                    {link.name}
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <h3 className="text-lg font-semibold mb-4 text-[#DEAF29]">
              Contact Us
            </h3>
            <ul className="text-[#D3D2D2]/80 space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <IoLocationOutline size={18} className="mt-1 text-[#DEAF29]" />
                <span>
                  Ashwin Nagar, Cidco, Nashik
                  <br />
                  Maharashtra, India - 422009
                </span>
              </li>
              <li className="flex items-center gap-3">
                <IoCallOutline size={18} className="text-[#DEAF29]" />
                <a href="tel:+917030875102" className="hover:text-[#DEAF29]">
                  +91 70308 75102
                </a>
              </li>
              <li className="flex items-center gap-3">
                <MdOutlineEmail size={18} className="text-[#DEAF29]" />
                <a
                  href="mailto:smitaaaher@corpgiftgpt.com"
                  className="hover:text-[#DEAF29]"
                >
                  smitaaaher@corpgiftgpt.com
                </a>
              </li>
              <li className="mt-6">
                <p className="font-medium">Business Hours:</p>
                <p>Monday - Friday: 9:00 AM - 6:00 PM</p>
                <p>Saturday: 10:00 AM - 4:00 PM</p>
              </li>
            </ul>
          </motion.div>
        </div>

        {/* Footer Bottom */}
      </motion.footer>
      <div className="relative ">
        <div
          className={`absolute w-full bg-[#fcce01] text-[#1b53a5] text-sm transition-all  duration-300 ${"h-8 mt-6 "}`}
        >
          <div className="container mx-auto px-4 h-full flex items-center justify-start">
            <div className="hidden md:flex items-center space-x-6">
              <a
                href="mailto:smitaaaher@corpgiftgpt.com"
                className="flex items-center hover:text-[#DEAF29] transition-colors"
              >
                <Mail className="h-4 w-4 mr-1" />
                smitaaaher@corpgiftgpt.com
              </a>
              <a
                href="tel:+917030875102"
                className="flex items-center hover:text-[#DEAF29] transition-colors"
              >
                <Phone className="h-4 w-4 mr-1" />
                +91 70308 75102
              </a>
            </div>
          </div>
        </div>

        {/* Blue section - positioned to overlap */}
        <div
          className={`absolute pl-16 right-0 z-10 w-1/2 rounded-tl-full bg-[#a30d14] text-white text-sm transition-all duration-300 ${"h-14 "} `}
        >
          <div className="container mx-auto px-4 h-full flex items-st justify-start">
            <div className="hidden md:flex items-center space-x-4 ">
              <MapPin className="h-4 w-4 mr-1 text-[#DEAF29]" />
              <span>
                Ashwin Nagar, Cidco, Nashik - 422009, Maharashtra, Bharat
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Footer;
