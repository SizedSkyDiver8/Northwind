import React from "react";
import excel from "../assets/icon-excel.png";
import { APIRoutes } from "../Api";

export default function ExportCSV() {
  // Fetch products from API and export them as a CSV file
  const fetchAndExport = async () => {
    try {
      const response = await fetch(APIRoutes.PRODUCTS_GET_ALL);
      if (!response.ok) throw new Error("Failed to fetch products.");
      const products = await response.json();

      const headers = ["Product Name", "Category", "Supplier", "Unit", "Price"];
      const rows = products.map((p: any) => [
        `"${p.productName}"`,
        `"${p.category.categoryName}"`,
        `"${p.supplier.supplierName}"`,
        `"${p.unit ?? ""}"`,
        `"${p.price}"`,
      ]);
      const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join(
        "\n"
      );
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "products.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error("CSV export failed:", err);
      alert("Failed to export CSV. Please try again later.");
    }
  };

  return (
    <button
      onClick={fetchAndExport}
      title="Export to CSV"
      className="export-icon-btn"
    >
      <img src={excel} alt="Export CSV" className="export-icon" />
    </button>
  );
}
