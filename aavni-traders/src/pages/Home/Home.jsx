import React, { useEffect } from "react";
import HeroSection from "./HeroSection";
import ProductShowcase from "./ProductShowcase";
import CategoriesSection from "./CategoriesSection";
import ProductsPage from "./ProductsPage";
import ComboPacksShowcase from "./ComboPacksShowcase";
import WhoWeAre from "./WhoWeAre";

function Home() {
  return (
    <div>
      <HeroSection />
      <CategoriesSection />
      <ProductShowcase />
      <WhoWeAre />
      <ComboPacksShowcase />
      <WhoWeAre />
    </div>
  );
}

export default Home;
