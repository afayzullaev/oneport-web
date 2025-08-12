import React from "react";
//import OrdersTable from "@/components/tables/OrdersTable";
import CustomTable from "../components/tables/CustomTable"

const Orders: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* <OrdersTable /> */}
      <CustomTable />
    </div>
  );
};

export default Orders;
