import React from "react";
import OrdersTable from "@/components/tables/OrdersTable";

const Orders: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <OrdersTable />
    </div>
  );
};

export default Orders;
