import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import ToolBar from "./ToolBar";
import DarkModeSwitch from "./DarkModeSwitch";
import ModalDelete from "./ModalStatus";
import { APIRoutes } from "../Api";

interface ProductFormData {
  productID?: number;
  productName: string;
  supplierID: number;
  categoryID: number;
  unit: string;
  price: number;
}

interface Supplier {
  supplierID: number;
  supplierName: string;
}

interface Category {
  categoryID: number;
  categoryName: string;
}

const initialFormData: ProductFormData = {
  productName: "",
  supplierID: 0,
  categoryID: 0,
  unit: "",
  price: 0,
};

export default function ProductForm() {
  const { id } = useParams();
  const location = useLocation();

  const [formData, setFormData] = useState<ProductFormData>(initialFormData);
  const [originalProductName, setOriginalProductName] = useState("");
  const [quantityPerUnit, setQuantityPerUnit] = useState("");
  const [unitType, setUnitType] = useState("");
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [mode, setMode] = useState<"edit" | "create">("create");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"success" | "error">("success");
  const [modalMessage, setModalMessage] = useState("");
  const [modalIcon, setModalIcon] = useState<React.ReactNode | null>(null);

  // Display an error modal with a red X icon and a custom message
  const showErrorModal = (msg: string) => {
    setModalType("error");
    setModalMessage(msg);
    setModalIcon(
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
    setModalOpen(true);
  };

  // Load product data in edit mode and parse unit details; reset form in create mode
  useEffect(() => {
    if (id) {
      setMode("edit");
      fetch(APIRoutes.GET_PRODUCT_BY_ID(parseInt(id)))
        .then((res) => res.json())
        .then((data) => {
          const unitMatch = data.unit?.match(/^(\d+)\s*[-x]?\s*(.+)$/);
          setFormData({
            productID: data.productID,
            productName: data.productName,
            supplierID: data.supplier.supplierID,
            categoryID: data.category.categoryID,
            unit: data.unit,
            price: data.price,
          });
          setOriginalProductName(data.productName);
          setQuantityPerUnit(unitMatch?.[1] ?? "");
          setUnitType(unitMatch?.[2] ?? "");
        })
        .catch(() =>
          showErrorModal("Failed to load product. Check your connection.")
        );
    } else {
      setMode("create");
      setFormData(initialFormData);
    }
  }, [id, location.pathname]);

  // Fetch suppliers and categories with combined error handling for failure messaging
  useEffect(() => {
    let supplierError = false;
    let categoryError = false;

    fetch(APIRoutes.SUPPLIERS_GET_ALL)
      .then((res) => res.json())
      .then(setSuppliers)
      .catch(() => {
        supplierError = true;
        if (categoryError) {
          showErrorModal("Failed to load suppliers and categories.");
        }
      });

    fetch(APIRoutes.CATEGORIES_GET_ALL)
      .then((res) => res.json())
      .then(setCategories)
      .catch(() => {
        categoryError = true;
        if (supplierError) {
          showErrorModal("Failed to load suppliers and categories.");
        }
      });

    setTimeout(() => {
      if (supplierError && !categoryError) {
        showErrorModal("Failed to load suppliers.");
      }
      if (!supplierError && categoryError) {
        showErrorModal("Failed to load categories.");
      }
    }, 300);
  }, []);

  // Check if a product name already exists in the database
  const checkNameExists = async (name: string): Promise<boolean> => {
    try {
      const res = await fetch(APIRoutes.CHECK_PRODUCT_NAME_EXISTS(name));
      if (!res.ok) throw new Error("Failed to check name");
      return await res.json(); 
    } catch {
      return false; 
    }
  };

  // Validate product name uniqueness on change, ignoring name error if unchanged in edit mode
  useEffect(() => {
    const validateName = async () => {
      const name = formData.productName.trim();
      if (!name) return;
      const exists = await checkNameExists(name);
      const isSameAsOriginal =
        mode === "edit" &&
        name.toLowerCase() === originalProductName.toLowerCase();
      if (exists && !isSameAsOriginal) {
        setErrors((prev) => ({
          ...prev,
          productName: "Product name already exists.",
        }));
      } else {
        setErrors((prev) => {
          const { productName, ...rest } = prev;
          return rest;
        });
      }
    };
    validateName();
  }, [formData.productName, mode, originalProductName]);

  // Handle input changes, parsing numeric fields and updating unit state separately
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (name === "quantityPerUnit") setQuantityPerUnit(value);
    else if (name === "unitType") setUnitType(value);
    else {
      const parsedValue =
        name === "supplierID" || name === "categoryID" || name === "price"
          ? parseFloat(value)
          : value;
      setFormData((prev) => ({ ...prev, [name]: parsedValue }));
    }
  };

  // Handle form submission: validate input, build payload, send to API, and show success or error modal
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors: { [key: string]: string } = {};
    const unit = `${quantityPerUnit.trim()} ${unitType.trim()}`.trim();
    const name = formData.productName.trim();
    if (!name) errors.productName = "Product name is required.";
    const exists = await checkNameExists(name);
    const isSameAsOriginal =
      mode === "edit" &&
      name.toLowerCase() === originalProductName.toLowerCase();
    if (exists && !(mode === "edit" && isSameAsOriginal))
      errors.productName = "Product name already exists.";
    if (!formData.supplierID) errors.supplierID = "Supplier is required.";
    if (!formData.categoryID) errors.categoryID = "Category is required.";
    if (!quantityPerUnit.trim())
      errors.quantityPerUnit = "Quantity per unit is required.";
    if (!unitType.trim()) errors.unit = "Unit type is required.";
    if (formData.price <= 0) errors.price = "Price must be greater than 0.";
    setErrors(errors);
    if (Object.keys(errors).length > 0) return;
    const supplier = suppliers.find(
      (s) => s.supplierID === formData.supplierID
    )!;
    const category = categories.find(
      (c) => c.categoryID === formData.categoryID
    )!;
    const payload = {
      ...formData,
      supplier,
      category,
      unit,
    };
    const url =
      mode === "edit" ? APIRoutes.PRODUCTS_EDIT : APIRoutes.PRODUCTS_ADD;
    const method = mode === "edit" ? "PUT" : "POST";
    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        setModalType("success");
        setModalMessage("Product saved successfully!");
        setModalIcon(
          <svg viewBox="0 0 24 24" className="modal-icon-svg">
            <circle cx="12" cy="12" r="12" fill="#22c55e" />
            <path
              d="M9.5 12.5l2 2 4-4"
              fill="none"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        );
        setModalOpen(true);
        setTimeout(() => {
          if (mode === "create") window.location.reload();
          else setModalOpen(false);
        }, 2000);
      } else {
        const errText = await res.text();
        showErrorModal(`Failed to save product: ${errText}`);
      }
    } catch (err) {
      showErrorModal("Connection error. Please try again later.");
    }
  };

  return (
    <>
      <DarkModeSwitch />
      <ToolBar />
      <h1 className="northwindHeader">Northwind</h1>
      <div className="formContainer">
        <h2 className="formTitle">
          {mode === "edit" ? "Edit Product" : "Create Product"}
        </h2>
        <form onSubmit={handleSubmit} className="productForm">
          <label>
            Product Name
            <input
              name="productName"
              value={formData.productName}
              onChange={handleChange}
            />
            {errors.productName && (
              <small className="input-error">{errors.productName}</small>
            )}
          </label>
          <label>
            Supplier
            <select
              name="supplierID"
              value={formData.supplierID}
              onChange={handleChange}
            >
              <option value="">Select supplier</option>
              {suppliers.map((s) => (
                <option key={s.supplierID} value={s.supplierID}>
                  {s.supplierName}
                </option>
              ))}
            </select>
            {errors.supplierID && (
              <small className="input-error">{errors.supplierID}</small>
            )}
          </label>
          <label>
            Category
            <select
              name="categoryID"
              value={formData.categoryID}
              onChange={handleChange}
            >
              <option value="">Select category</option>
              {categories.map((c) => (
                <option key={c.categoryID} value={c.categoryID}>
                  {c.categoryName}
                </option>
              ))}
            </select>
            {errors.categoryID && (
              <small className="input-error">{errors.categoryID}</small>
            )}
          </label>
          <label>
            Quantity Per Unit
            <input
              type="number"
              name="quantityPerUnit"
              value={quantityPerUnit}
              onChange={handleChange}
            />
            {errors.quantityPerUnit && (
              <small className="input-error">{errors.quantityPerUnit}</small>
            )}
          </label>
          <label>
            Unit Type
            <input name="unitType" value={unitType} onChange={handleChange} />
            {errors.unit && (
              <small className="input-error">{errors.unit}</small>
            )}
          </label>
          <label>
            Unit Price
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
            />
            {errors.price && (
              <small className="input-error">{errors.price}</small>
            )}
          </label>
          <button type="submit" className="submitBtn">
            {mode === "edit" ? "Update Product" : "Create Product"}
          </button>
        </form>
      </div>

      <ModalDelete
        isOpen={modalOpen}
        type={modalType}
        message={modalMessage}
        icon={modalIcon}
        showActions={false}
        onConfirm={() => {}}
        onCancel={() => setModalOpen(false)}
      />
    </>
  );
}
