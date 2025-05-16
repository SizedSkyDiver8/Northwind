import React from "react";
import iconEdit from "../assets/icon-Edit.png";
import iconDelete from "../assets/icon-delete.png";

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

interface ProductTableProps {
  products: Product[];
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

export default function ProductTable({
  products,
  onEdit,
  onDelete,
}: ProductTableProps) {
  return (
    <div className="divTable productTableWrapper">
      <table className="productTable">
        <thead>
          <tr>
            <th>Product Name</th>
            <th>Category</th>
            <th>Supplier</th>
            <th>Unit Price</th>
            <th>Units</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.productID}>
              <td>{product.productName}</td>
              <td>{product.category.categoryName}</td>
              <td>{product.supplier.supplierName}</td>
              <td>{product.price}</td>
              <td>{product.unit}</td>
              <td>
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
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
