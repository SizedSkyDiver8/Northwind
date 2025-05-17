const BASE_URL = (() => {
  const env = import.meta.env.VITE_APP_STAGE;

  switch (env) {
    case "development":
      return "https://localhost:7157/api";
    default:
      console.warn("⚠️ No valid VITE_APP_STAGE — using localhost fallback.");
      return "https://localhost:7157/api";
  }
})();

export const APIRoutes = {
  PRODUCTS_GET_ALL: `${BASE_URL}/Products/GetAllProducts`,
  PRODUCTS_ADD: `${BASE_URL}/Products/AddNewProduct`,
  PRODUCTS_EDIT: `${BASE_URL}/Products/EditProduct`,
  SUPPLIERS_GET_ALL: `${BASE_URL}/Supplier/GetAllSuppliers`,
  CATEGORIES_GET_ALL: `${BASE_URL}/Category/GetAllCategories`,
  CUSTOMERS_TOP3: `${BASE_URL}/Customer/GetTop3CustomerOrderCount`,

  GET_PRODUCT_BY_ID: (id: number) =>
    `${BASE_URL}/Products/GetProductByID/${id}`,

  CHECK_PRODUCT_NAME_EXISTS: (name: string) =>
    `${BASE_URL}/Products/CheckNameExists/${encodeURIComponent(name)}`,

  PRODUCTS_PAGED: (pageNumber: number, pageSize: number) =>
    `${BASE_URL}/Products/GetPagedProducts?pageNumber=${pageNumber}&pageSize=${pageSize}`,

  PRODUCTS_BY_NAME: (name: string, pageNumber: number, pageSize: number) =>
    `${BASE_URL}/Products/GetProductsByName?name=${encodeURIComponent(
      name
    )}&pageNumber=${pageNumber}&pageSize=${pageSize}`,

  PRODUCTS_BY_CATEGORY: (
    category: string,
    pageNumber: number,
    pageSize: number
  ) =>
    `${BASE_URL}/Products/GetProductsByCategory?category=${encodeURIComponent(
      category
    )}&pageNumber=${pageNumber}&pageSize=${pageSize}`,

  DELETE_PRODUCT_BY_ID: (id: number) =>
    `${BASE_URL}/Products/DeleteProductById/${id}`,
} as const;
