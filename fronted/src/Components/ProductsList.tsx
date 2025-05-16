// import React, { useEffect, useRef, useState } from "react";
// import DarkModeSwitch from "./DarkModeSwitch";
// import iconDelete from "../assets/icon-delete.png";
// import iconEdit from "../assets/icon-Edit.png";
// import Paging from "../Components/Paging";
// import { useNavigate } from "react-router-dom";
// import ModalDelete from "./ModalStatus";
// import ToolBar from "./ToolBar";
// import TopCustomers from "./TopCustomers";

// interface TopCustomer {
//   customerID: number;
//   customerName: string;
//   orderCount: number;
// }

// interface Products {
//   productID: number;
//   productName: string;
//   category: {
//     categoryID: number;
//     categoryName: string;
//   };
//   supplier: {
//     supplierID: number;
//     supplierName: string;
//   };
//   unit: string | null;
//   price: number;
// }

// export default function ProductsList() {
//   const [products, setProducts] = useState<Products[]>([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [searchType, setSearchType] = useState<"name" | "category">("name");
//   const [page, setPage] = useState(1);
//   const [totalCount, setTotalCount] = useState(0);
//   const pageSize = 10;
//   const navigate = useNavigate();
//   const listRef = useRef<HTMLDivElement>(null);

//   const [showModal, setShowModal] = useState(false);
//   const [productToDelete, setProductToDelete] = useState<number | null>(null);
//   const [errorModalOpen, setErrorModalOpen] = useState(false);
//   const [errorMessage, setErrorMessage] = useState("");
//   const [errorIcon, setErrorIcon] = useState<React.ReactNode | null>(null);

//   // Fetches top 3 customers by order count on component mount
//   // useEffect(() => {
//   //   fetch("https://localhost:7157/api/Customer/GetTop3CustomerOrderCount")
//   //     .then((res) => res.json())
//   //     .then(setTopCustomers)
//   //     .catch(() => showErrorModal("Failed to load customer summary."));
//   // }, []);

//   // Triggers and displays a styled error modal
//   // Sets modal state variables for error display
//   const showErrorModal = (msg: string) => {
//     setErrorMessage(msg);
//     setErrorIcon(
//       <svg viewBox="0 0 24 24" className="modal-icon-svg">
//         <circle cx="12" cy="12" r="12" fill="#ef4444" />
//         <path
//           d="M15 9l-6 6m0-6l6 6"
//           stroke="white"
//           strokeWidth="2"
//           strokeLinecap="round"
//           strokeLinejoin="round"
//         />
//       </svg>
//     );
//     setErrorModalOpen(true);
//   };

//   // Fetches paged products based on search term and type (name or category)
//   const fetchPagedProducts = (pageNumber: number) => {
//     const url =
//       searchTerm.trim() === ""
//         ? `https://localhost:7157/api/Products/GetPagedProducts?pageNumber=${pageNumber}&pageSize=${pageSize}`
//         : searchType === "name"
//         ? `https://localhost:7157/api/Products/GetProductsByName?name=${searchTerm}&pageNumber=${pageNumber}&pageSize=${pageSize}`
//         : `https://localhost:7157/api/Products/GetProductsByCategory?category=${searchTerm}&pageNumber=${pageNumber}&pageSize=${pageSize}`;
//     fetch(url)
//       .then((res) => res.json())
//       .then((data) => {
//         setProducts(data.products);
//         setTotalCount(data.totalCount);
//         setPage(pageNumber);
//       })
//       .catch(() => showErrorModal("Failed to fetch products."));
//   };

//   // Triggers product fetch from page 1 whenever search term or type changes
//   useEffect(() => {
//     fetchPagedProducts(1);
//   }, [searchTerm, searchType]);

//   // Sends a DELETE request to remove a product by ID
//   const handleDelete = async (productId: number) => {
//     try {
//       const res = await fetch(
//         `https://localhost:7157/api/Products/DeleteProductById/${productId}`,
//         { method: "DELETE" }
//       );
//       const result = await res.text(); // backend returns int as plain text

//       if (!res.ok) {
//         throw new Error("Network/server error");
//       }
//       const status = parseInt(result);
//       if (status === 1) {
//         setProducts((prev) => prev.filter((p) => p.productID !== productId));
//         setErrorIcon(
//           <svg className="modal-icon-svg" viewBox="0 0 24 24">
//             <circle cx="12" cy="12" r="12" fill="#22c55e" />
//             <path
//               d="M16.704 8.704a1 1 0 00-1.408-1.408L10 12.592l-1.296-1.296a1 1 0 00-1.408 1.408l2 2a1 1 0 001.408 0l6-6z"
//               fill="white"
//             />
//           </svg>
//         );
//         setErrorMessage("Product deleted successfully!");
//         setErrorModalOpen(true);
//         setTimeout(() => setErrorModalOpen(false), 2000);
//       } else if (status === -1) {
//         showErrorModal("Cannot delete product — it is in use in an order.");
//       } else if (status === 0) {
//         showErrorModal("Product not found or already deleted.");
//       } else {
//         showErrorModal("Unexpected error occurred during deletion.");
//       }
//     } catch (err) {
//       showErrorModal("Connection error. Please try again later.");
//     }
//   };

//   const totalPages = Math.ceil(totalCount / pageSize);

//   return (
//     <>
//       <DarkModeSwitch />
//       <ToolBar />
//       <h1 className="northwindHeader">Northwind</h1>
//       <TopCustomers />
//       <h1>Products List</h1>

//       <div className="divSearch">
//         <input
//           className="inputSearch"
//           type="text"
//           placeholder="Search by product name or category..."
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//         />
//         <div className="searchOptions">
//           <label>
//             <input
//               type="radio"
//               name="searchType"
//               value="name"
//               checked={searchType === "name"}
//               onChange={() => setSearchType("name")}
//             />
//             Product Name
//           </label>
//           <label>
//             <input
//               type="radio"
//               name="searchType"
//               value="category"
//               checked={searchType === "category"}
//               onChange={() => setSearchType("category")}
//             />
//             Category
//           </label>
//         </div>
//       </div>

//       {/* Delete Modal */}
//       <ModalDelete
//         isOpen={showModal}
//         type="delete"
//         message="Are you sure you want to delete this product?"
//         icon={
//           <svg className="modal-icon-svg" viewBox="0 0 24 24">
//             <circle cx="12" cy="12" r="12" fill="#f59e0b" />
//             <path
//               d="M15 9l-6 6m0-6l6 6"
//               stroke="white"
//               strokeWidth="2"
//               strokeLinecap="round"
//               strokeLinejoin="round"
//             />
//           </svg>
//         }
//         onCancel={() => {
//           setShowModal(false);
//           setProductToDelete(null);
//         }}
//         onConfirm={() => {
//           if (productToDelete !== null) {
//             handleDelete(productToDelete);
//             setShowModal(false);
//             setProductToDelete(null);
//           }
//         }}
//       />

//       {/* Error Modal */}
//       <ModalDelete
//         isOpen={errorModalOpen}
//         type="error"
//         message={errorMessage}
//         icon={errorIcon}
//         showActions={false}
//         onConfirm={() => {}}
//         onCancel={() => setErrorModalOpen(false)}
//       />

//       <div className="divTable">
//         <table className="productTable">
//           <thead>
//             <tr>
//               <th>Product Name</th>
//               <th>Category</th>
//               <th>Supplier</th>
//               <th>Unit Price</th>
//               <th>Units</th>
//               <th>Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {products.map((product) => (
//               <tr key={product.productID}>
//                 <td>{product.productName}</td>
//                 <td>{product.category.categoryName}</td>
//                 <td>{product.supplier.supplierName}</td>
//                 <td>{product.price}</td>
//                 <td>{product.unit}</td>
//                 <td>
//                   <img
//                     src={iconEdit}
//                     alt="Edit"
//                     onClick={() =>
//                       navigate(`/products/${product.productID}/edit`)
//                     }
//                     style={{ cursor: "pointer" }}
//                   />
//                   <img
//                     src={iconDelete}
//                     alt="Delete"
//                     onClick={() => {
//                       setProductToDelete(product.productID);
//                       setShowModal(true);
//                     }}
//                     style={{ cursor: "pointer" }}
//                   />
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       {/* Mobile Cards */}
//       <div className="productCards" ref={listRef}>
//         {products.map((product) => (
//           <div className="productCard" key={product.productID}>
//             <p>
//               <strong>Product:</strong> {product.productName}
//             </p>
//             <p>
//               <strong>Category:</strong> {product.category.categoryName}
//             </p>
//             <p>
//               <strong>Supplier:</strong> {product.supplier.supplierName}
//             </p>
//             <p>
//               <strong>Price:</strong> {product.price}
//             </p>
//             <p>
//               <strong>Units:</strong> {product.unit}
//             </p>
//             <div className="cardActions">
//               <img
//                 src={iconEdit}
//                 alt="Edit"
//                 onClick={() => navigate(`/products/${product.productID}/edit`)}
//                 style={{ cursor: "pointer" }}
//               />
//               <img
//                 src={iconDelete}
//                 alt="Delete"
//                 onClick={() => {
//                   setProductToDelete(product.productID);
//                   setShowModal(true);
//                 }}
//                 style={{ cursor: "pointer" }}
//               />
//             </div>
//           </div>
//         ))}
//       </div>
//       {totalPages > 1 && (
//         <Paging
//           page={page}
//           totalPages={totalPages}
//           onPageChange={(pageNum) => {
//             fetchPagedProducts(pageNum);
//             listRef.current?.scrollIntoView({ behavior: "smooth" });
//           }}
//         />
//       )}
//     </>
//   );
// }

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

  const fetchPagedProducts = (pageNumber: number) => {
    const url =
      searchTerm.trim() === ""
        ? `https://localhost:7157/api/Products/GetPagedProducts?pageNumber=${pageNumber}&pageSize=${pageSize}`
        : searchType === "name"
        ? `https://localhost:7157/api/Products/GetProductsByName?name=${searchTerm}&pageNumber=${pageNumber}&pageSize=${pageSize}`
        : `https://localhost:7157/api/Products/GetProductsByCategory?category=${searchTerm}&pageNumber=${pageNumber}&pageSize=${pageSize}`;

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

  useEffect(() => {
    fetchPagedProducts(1);
  }, [searchTerm, searchType]);

  const handleDelete = async (productId: number) => {
    try {
      const res = await fetch(
        `https://localhost:7157/api/Products/DeleteProductById/${productId}`,
        { method: "DELETE" }
      );
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

      {/* <div className="divSearch">
        <input
          className="inputSearch"
          type="text"
          placeholder="Search by product name or category..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
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
      </div> */}
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
