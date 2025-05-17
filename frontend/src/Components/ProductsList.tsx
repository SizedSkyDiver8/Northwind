import React, { useEffect, useRef, useState } from "react";
import DarkModeSwitch from "./DarkModeSwitch";
import iconDelete from "../assets/icon-delete.png";
import iconEdit from "../assets/icon-Edit.png";
import Paging from "../Components/Paging";
import { useNavigate } from "react-router-dom";
import ModalStatus from "./ModalStatus";
import ToolBar from "./ToolBar";
import TopCustomers from "./TopCustomers";
import ExportCSV from "./ExportCSV";
import { APIRoutes } from "../Api";

interface Products {
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

export default function ProductsList() {
  const [products, setProducts] = useState<Products[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchType, setSearchType] = useState<"name" | "category">("name");
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"delete" | "error" | "success">(
    "delete"
  );
  const [modalMessage, setModalMessage] = useState("");
  const [modalIcon, setModalIcon] = useState<React.ReactNode | null>(null);
  const [productToDelete, setProductToDelete] = useState<number | null>(null);
  const pageSize = 10;
  const navigate = useNavigate();
  const listRef = useRef<HTMLDivElement>(null);

  const showModal = (
    type: "error" | "success",
    message: string,
    icon: React.ReactNode
  ) => {
    setModalType(type);
    setModalMessage(message);
    setModalIcon(icon);
    setModalOpen(true);
  };

  // Fetch paginated products from API based on search term and type, update state or show error modal
  const fetchPagedProducts = (pageNumber: number) => {
    const url =
      searchTerm.trim() === ""
        ? APIRoutes.PRODUCTS_PAGED(pageNumber, pageSize)
        : searchType === "name"
        ? APIRoutes.PRODUCTS_BY_NAME(searchTerm, pageNumber, pageSize)
        : APIRoutes.PRODUCTS_BY_CATEGORY(searchTerm, pageNumber, pageSize);
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        setProducts(data.products);
        setTotalCount(data.totalCount);
        setPage(pageNumber);
      })
      .catch(() => {
        showModal(
          "error",
          "Failed to load products.",
          <svg viewBox="0 0 24 24" className="modal-icon-svg">
            <circle cx="12" cy="12" r="12" fill="#ef4444" />
            <path
              d="M15 9l-6 6m0-6l6 6"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        );
      });
  };

  // Fetch first page of products whenever search term or type changes
  useEffect(() => {
    fetchPagedProducts(1);
  }, [searchTerm, searchType]);

  // Delete product by ID, update UI, and show appropriate success or error modal based on API response
  const handleDelete = async (productId: number) => {
    try {
      const res = await fetch(APIRoutes.DELETE_PRODUCT_BY_ID(productId), {
        method: "DELETE",
      });
      const result = await res.text();
      if (!res.ok) throw new Error("Network/server error");
      const status = parseInt(result);
      if (status === 1) {
        setProducts((prev) => prev.filter((p) => p.productID !== productId));
        showModal(
          "success",
          "Product deleted successfully!",
          <svg viewBox="0 0 24 24" className="modal-icon-svg">
            <circle cx="12" cy="12" r="12" fill="#22c55e" />
            <g transform="scale(0.7) translate(5, 5)">
              <path
                d="M16.704 8.704a1 1 0 00-1.408-1.408L10 12.592l-1.296-1.296a1 1 0 00-1.408 1.408l2 2a1 1 0 001.408 0l6-6z"
                fill="white"
              />
            </g>
          </svg>
        );
        setTimeout(() => setModalOpen(false), 2000);
      } else if (status === -1) {
        showModal(
          "error",
          "Cannot delete product — it is in use in an order.",
          modalIcon
        );
      } else if (status === 0) {
        showModal("error", "Product not found or already deleted.", modalIcon);
      } else {
        showModal(
          "error",
          "Unexpected error occurred during deletion.",
          modalIcon
        );
      }
    } catch {
      showModal(
        "error",
        "Connection error. Please try again later.",
        modalIcon
      );
    }
  };

  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <>
      <DarkModeSwitch />
      <ToolBar />
      <h1 className="northwindHeader">Northwind</h1>
      <TopCustomers />
      <h1>Products List</h1>
      <div className="divSearch">
        <div className="searchInputWithIcon">
          <input
            className="inputSearch"
            type="text"
            placeholder="Search by product name or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <ExportCSV />
        </div>
        <div className="searchOptions">
          <label>
            <input
              type="radio"
              name="searchType"
              value="name"
              checked={searchType === "name"}
              onChange={() => setSearchType("name")}
            />
            Product Name
          </label>
          <label>
            <input
              type="radio"
              name="searchType"
              value="category"
              checked={searchType === "category"}
              onChange={() => setSearchType("category")}
            />
            Category
          </label>
        </div>
      </div>

      <ModalStatus
        isOpen={modalOpen}
        type={modalType}
        message={modalMessage}
        icon={modalIcon}
        onCancel={() => setModalOpen(false)}
        onConfirm={() => {
          if (modalType === "delete" && productToDelete !== null) {
            handleDelete(productToDelete);
            setModalOpen(false);
          }
        }}
        showActions={modalType === "delete"}
      />

      <div className="divTable">
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
                    onClick={() =>
                      navigate(`/products/${product.productID}/edit`)
                    }
                  />
                  <img
                    src={iconDelete}
                    alt="Delete"
                    onClick={() => {
                      setModalType("delete");
                      setModalMessage(
                        "Are you sure you want to delete this product?"
                      );
                      setModalIcon(
                        <svg className="modal-icon-svg" viewBox="0 0 24 24">
                          <circle cx="12" cy="12" r="12" fill="#ef4444" />
                          <path
                            d="M15 9l-6 6m0-6l6 6"
                            stroke="white"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      );
                      setProductToDelete(product.productID);
                      setModalOpen(true);
                    }}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="productCards" ref={listRef}>
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
                onClick={() => navigate(`/products/${product.productID}/edit`)}
              />
              <img
                src={iconDelete}
                alt="Delete"
                onClick={() => {
                  setModalType("delete");
                  setModalMessage(
                    "Are you sure you want to delete this product?"
                  );
                  setModalIcon(
                    <svg className="modal-icon-svg" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="12" fill="#f59e0b" />
                      <path
                        d="M15 9l-6 6m0-6l6 6"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  );
                  setProductToDelete(product.productID);
                  setModalOpen(true);
                }}
              />
            </div>
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <Paging
          page={page}
          totalPages={totalPages}
          onPageChange={(pageNum) => {
            fetchPagedProducts(pageNum);
            listRef.current?.scrollIntoView({ behavior: "smooth" });
          }}
        />
      )}
    </>
  );
}
