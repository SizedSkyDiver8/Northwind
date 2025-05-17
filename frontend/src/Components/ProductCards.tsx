import React from "react";
import iconEdit from "../assets/icon-Edit.png";
import iconDelete from "../assets/icon-delete.png";

// Renders a responsive card layout for products with edit and delete actions
interface Product {
  productID: number;
  productName: string;
  category: {
    categoryID: number;
    categoryName: string;
  };
  supplier: {
    supplierID: number;
    supplierName: string;
  };
  unit: string | null;
  price: number;
}

interface ProductCardsProps {
  products: Product[];
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

export default function ProductCards({
  products,
  onEdit,
  onDelete,
}: ProductCardsProps) {
  return (
    <div className="productCards">
      {products.map((product) => (
        <div className="productCard" key={product.productID}>
          <p>
            <strong>Product:</strong> {product.productName}
          </p>
          <p>
            <strong>Category:</strong> {product.category.categoryName}
          </p>
          <p>
            <strong>Supplier:</strong> {product.supplier.supplierName}
          </p>
          <p>
            <strong>Price:</strong> {product.price}
          </p>
          <p>
            <strong>Units:</strong> {product.unit}
          </p>
          <div className="cardActions">
            <img
              src={iconEdit}
              alt="Edit"
              onClick={() => onEdit(product.productID)}
              style={{ cursor: "pointer" }}
            />
            <img
              src={iconDelete}
              alt="Delete"
              onClick={() => onDelete(product.productID)}
              style={{ cursor: "pointer" }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
