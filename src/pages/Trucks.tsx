import React from "react";
import TrucksTable from "@/components/tables/TrucksTable";

const Trucks: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <TrucksTable />
    </div>
  );
};

export default Trucks;
