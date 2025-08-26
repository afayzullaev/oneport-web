import React from "react";
import TruckDataGridTable from "@/components/tables/TruckDataGridTable";

const Trucks: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <TruckDataGridTable />
    </div>
  );
};

export default Trucks;
