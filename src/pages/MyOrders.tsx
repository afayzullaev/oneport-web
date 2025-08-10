import React from "react";
import { useLocalization } from "@/hooks/useLocalization";
import MyOrdersTable from "@/components/tables/MyOrdersTable";

const MyOrders: React.FC = () => {
  const { t } = useLocalization();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {t.pages.myOrders}
            </h1>
            <p className="mt-1 text-sm text-gray-600">
              {t.pages.myOrdersSubtitle}
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <MyOrdersTable />
      </div>
    </div>
  );
};

export default MyOrders;
