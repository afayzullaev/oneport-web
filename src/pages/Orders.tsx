import React from "react";
//import OrdersTable from "@/components/tables/OrdersTable";
import OrderDataGridTable from "../components/tables/OrderDataGridTable";

const Orders: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* <OrdersTable /> */}
      <OrderDataGridTable />
    </div>
  );
};

export default Orders;
