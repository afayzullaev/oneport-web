import React from "react";
import { useLocalization } from "@/hooks/useLocalization";
import MyTrucksTable from "@/components/tables/MyTrucksTable";

const MyTrucks: React.FC = () => {
  const { t } = useLocalization();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {t.pages.myTrucks}
            </h1>
            <p className="mt-1 text-sm text-gray-600">
              {t.pages.myTrucksSubtitle}
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <MyTrucksTable />
      </div>
    </div>
  );
};

export default MyTrucks;
