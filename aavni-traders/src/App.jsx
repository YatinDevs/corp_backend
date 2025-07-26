import React, { useEffect } from "react";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import Layout from "./Layout/Layout";
import Home from "./pages/Home/Home";
import PageNotFound from "./pages/ErrorPages/NotFound";
import { useStore } from "./store/useStore";

function App() {
  const {
    products,
    categories,
    comboPacks,
    fetchCategories,
    fetchProducts,
    fetchComboPacks,
  } = useStore();
  console.log(products, categories, comboPacks);

  useEffect(() => {
    fetchCategories();
    fetchProducts();
    fetchComboPacks();
  }, [fetchCategories, fetchProducts, fetchComboPacks]);

  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="*" element={<PageNotFound />} />
      </Route>
    )
  );

  return <RouterProvider router={router} />;
}

export default App;
