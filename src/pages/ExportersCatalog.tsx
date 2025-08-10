import React from "react";
import ExportersTable from "@/components/tables/ExportersTable";

const ExportersCatalog: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <ExportersTable />
    </div>
  );
};

export default ExportersCatalog;
