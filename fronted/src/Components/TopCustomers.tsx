import React, { useEffect, useState } from "react";

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
    fetch("https://localhost:7157/api/Customer/GetTop3CustomerOrderCount")
      .then((res) => res.json())
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
