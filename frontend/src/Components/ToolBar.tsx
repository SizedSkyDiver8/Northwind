import React from "react";
import { useNavigate } from "react-router-dom";

// Toolbar with navigation links to product list and add product page
export default function ToolBar() {
  const navigate = useNavigate();

  return (
    <div className="toolbarDiv">
      <span onClick={() => navigate("/products")}>Products</span>
      <span onClick={() => navigate("/products/new")}>Add Product</span>
    </div>
  );
}
