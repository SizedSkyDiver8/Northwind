import React, { useEffect, useState } from "react";
import { APIRoutes } from "../Api";

interface TopCustomer {
  customerID: number;
  customerName: string;
  orderCount: number;
}

const TopCustomers: React.FC = () => {
  const [customers, setCustomers] = useState<TopCustomer[]>([]);
  const [error, setError] = useState("");

  // Fetches top 3 customers by order count on component mount
  useEffect(() => {
    fetch(APIRoutes.CUSTOMERS_TOP3)
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then(setCustomers)
      .catch(() => setError("Failed to load top customers."));
  }, []);

  return (
    <div className="summaryBox">
      <h2>Top 3 Customers</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <div className="customerCards">
        {customers.map((customer) => (
          <div className="customerCard" key={customer.customerID}>
            <strong>{customer.customerName}</strong>
            <p>{customer.orderCount} orders</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopCustomers;
