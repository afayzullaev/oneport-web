import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  useGetMyOrdersQuery,
  useUpdateOrderMutation,
  useDeleteOrderMutation,
} from "@/api/ordersApi";
import type { Order } from "@/types/models/cargoOwner/order";
import { useLocalization } from "@/hooks/useLocalization";
import type { LoadPackage } from "@/types/models/cargoOwner/loadPackage";
import type { LoadType } from "@/types/models/cargoOwner/loadType";
import OrderUpdateForm from "@/components/forms/OrderUpdateForm";

// Component for displaying loadType name
const LoadTypeName: React.FC<{ loadType?: Order["loadType"] }> = ({ loadType }) => {
  const { getLocalizedText, t } = useLocalization();

  const loadTypeData: LoadType = loadType as LoadType;

  if (!loadType) return <span>{t.common.notSpecified}</span>;

  if (typeof loadType === "object") {
    return <span>{getLocalizedText(loadType.name, t.common.notSpecified)}</span>;
  }

  if (typeof loadType === "string" && loadTypeData) {
    return <span>{getLocalizedText(loadTypeData.name, t.common.notSpecified)}</span>;
  }

  return <span>{loadType}</span>;
};

// Component for displaying loadPackage name
const LoadPackageName: React.FC<{ loadPackage?: Order["loadPackage"] }> = ({
  loadPackage,
}) => {
  const { getLocalizedText, t } = useLocalization();

  const loadPackageData: LoadPackage = loadPackage as LoadPackage;

  if (!loadPackage) return <span>{t.common.standard}</span>;

  if (typeof loadPackage === "object") {
    return <span>{getLocalizedText(loadPackage.name, t.common.standard)}</span>;
  }

  if (typeof loadPackage === "string" && loadPackageData) {
    return <span>{getLocalizedText(loadPackageData.name, t.common.standard)}</span>;
  }

  return <span>{loadPackage}</span>;
};

const MyOrdersTable: React.FC = () => {
  const navigate = useNavigate();
  const { t, getLocalizedText } = useLocalization();
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);

  // Get user's own orders
  const { data: orders, isLoading, error } = useGetMyOrdersQuery();

  // Mutations
  const [updateOrder, { isLoading: isUpdating }] = useUpdateOrderMutation();
  const [deleteOrder, { isLoading: isDeleting }] = useDeleteOrderMutation();

  const handleOrderClick = (orderId: string) => {
    navigate(`/orders/${orderId}`);
  };

  const handleEditClick = (order: Order) => {
    setEditingOrder(order);
  };

  const closeEditModal = () => {
    setEditingOrder(null);
  };

  const handleUpdateOrder = async (updates: Partial<Order>) => {
    if (!editingOrder?._id) return;

    try {
      await updateOrder({ id: editingOrder._id, updates }).unwrap();
      closeEditModal();
    } catch (error) {
      console.error("Failed to update order:", error);
    }
  };

  const handleDeleteOrder = async (orderId: string) => {
    if (!window.confirm(t.myItems.actions.confirmDelete)) return;

    try {
      await deleteOrder(orderId).unwrap();
    } catch (error) {
      console.error("Failed to delete order:", error);
    }
  };

  const formatWeight = (weight?: number, weightUnit?: string) => {
    if (!weight) return t.common.notSpecified;
    return weightUnit === "ton" || weight >= 1000
      ? `${weight >= 1000 ? weight / 1000 : weight} ${t.common.ton}`
      : `${weight} ${t.common.kg}`;
  };

  const formatPrice = (order: Order) => {
    if (!order.pricing) return t.common.negotiable;
    const price = order.pricing.withVat || order.pricing.withoutVat;
    if (!price) return t.common.negotiable;
    return `${price} ${t.common.som} ${
      order.pricing.withVat ? t.common.withVat : t.common.withoutVat
    }`;
  };

  const getStatusText = (loadStatus?: Order["loadStatus"]) => {
    if (!loadStatus) return t.status.notSpecified;

    switch (loadStatus.state) {
      case "ready_from":
        return t.status.readyFrom;
      case "always":
        return t.status.always;
      case "not_ready":
        return t.status.notReady;
      default:
        return t.status.statusError;
    }
  };

  const getObjectName = (obj: any, fallback: string = t.common.notSpecified): string => {
    if (!obj) return fallback;

    if (typeof obj === "string") return obj;

    if (typeof obj === "object") {
      if (obj.name) {
        if (typeof obj.name === "string") return obj.name;
        if (typeof obj.name === "object") {
          return getLocalizedText(obj.name, fallback);
        }
      }

      if (obj.ru || obj.en || obj.uz || obj.kz || obj.kaa) {
        return getLocalizedText(obj, fallback);
      }
    }

    return fallback;
  };

  // const getTypesBadges = (
  //   types?: (string | { _id: string; name: LocalizedString; __v?: number })[]
  // ) => {
  //   if (!types || types.length === 0) return null;

  //   return (
  //     <div className="flex flex-wrap gap-1 mt-1">
  //       {types.slice(0, 2).map((type, index) => (
  //         <span
  //           key={index}
  //           className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-700"
  //         >
  //           {getObjectName(type, t.common.typeLabel)}
  //         </span>
  //       ))}
  //       {types.length > 2 && (
  //         <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-gray-200 text-gray-600">
  //           +{types.length - 2}
  //         </span>
  //       )}
  //     </div>
  //   );
  // };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="h-16 bg-gray-200 rounded"
              ></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <h3 className="text-red-800 font-medium">{t.ordersTable.error.title}</h3>
          <p className="text-red-600 text-sm mt-1">{t.ordersTable.error.message}</p>
        </div>
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">📦</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {t.myItems.orders.emptyTitle}
          </h3>
          <p className="text-gray-500 mb-4">{t.myItems.orders.emptyMessage}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-sm rounded-lg overflow-hidden">
      {/* Table Header */}
      <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
        <div>
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            {t.myItems.orders.title}
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            {t.myItems.orders.subtitle}
            {orders.length}
          </p>
        </div>
      </div>

      {/* Edit Modal */}
      {editingOrder && (
        <OrderUpdateForm
          order={editingOrder}
          isOpen={!!editingOrder}
          onClose={closeEditModal}
          onSave={handleUpdateOrder}
          isLoading={isUpdating}
        />
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                {t.ordersTable.headers.cargo}
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider w-1/3">
                {t.ordersTable.headers.characteristics}
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                {t.ordersTable.headers.price}
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                {t.ordersTable.headers.from}
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                {t.ordersTable.headers.to}
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                {t.ordersTable.headers.status}
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                {t.ordersTable.headers.actions}
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {orders.map((order) => (
              <tr
                key={order._id}
                className="hover:bg-gray-50 transition-colors cursor-pointer"
                onClick={() => order._id && handleOrderClick(order._id)}
              >
                {/* Cargo */}
                <td className="px-4 py-4">
                  <div className="flex flex-col">
                    <div className="text-sm font-medium text-gray-900">
                      <LoadTypeName loadType={order.loadType} />
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      <LoadPackageName loadPackage={order.loadPackage} />
                    </div>
                    <div className="text-xs font-medium text-blue-600 mt-1">
                      {formatWeight(order.weight, order.weightUnit)}
                    </div>
                  </div>
                </td>

                {/* Characteristics */}
                {/* <td className="px-6 py-4">
                  <div className="space-y-1">
                    {order.loadTypes && (
                      <div>
                        <span className="text-xs text-gray-500">
                          {t.ordersTable.cargoType}:
                        </span>
                        {getTypesBadges(order.loadTypes)}
                      </div>
                    )}
                    {order.unloadTypes && order.unloadTypes.length > 0 && (
                      <div>
                        <span className="text-xs text-gray-500">Unload:</span>
                        {getTypesBadges(order.unloadTypes)}
                      </div>
                    )}
                  </div>
                </td> */}

                {/* Price */}
                <td className="px-4 py-4">
                  <div className="text-sm font-medium text-gray-900">
                    {formatPrice(order)}
                  </div>
                  {order.pricing?.pricingType && (
                    <div className="text-xs text-gray-500 mt-1">
                      {getObjectName(order.pricing.pricingType, t.common.pricingType)}
                    </div>
                  )}
                </td>

                {/* From */}
                <td className="px-4 py-4">
                  <div className="text-sm text-gray-900">
                    {order.loadAddress?.display_name || t.common.notSpecified}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {order.loadAddress?.display_place}
                  </div>
                </td>

                {/* To */}
                <td className="px-4 py-4">
                  <div className="text-sm text-gray-900">
                    {order.unloadAddress?.display_name || t.common.notSpecified}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {order.unloadAddress?.display_place}
                  </div>
                </td>

                {/* Status */}
                <td className="px-4 py-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    {getStatusText(order.loadStatus)}
                  </span>
                  {order.loadStatus.interval && (
                    <div className="text-xs text-gray-500 mt-1">
                      {order.loadStatus.interval.replace(/_/g, " ")}
                    </div>
                  )}
                </td>

                {/* Actions */}
                <td
                  className="px-4 py-4"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex flex-col space-y-1">
                    <button
                      className="text-green-600 hover:text-green-800 text-sm font-medium text-left disabled:opacity-50"
                      onClick={() => handleEditClick(order)}
                      disabled={isUpdating}
                    >
                      {t.myItems.actions.edit}
                    </button>
                    <button
                      className="text-red-600 hover:text-red-800 text-sm font-medium text-left disabled:opacity-50"
                      onClick={() => order._id && handleDeleteOrder(order._id)}
                      disabled={isDeleting}
                    >
                      {isDeleting ? "Deleting..." : t.myItems.actions.delete}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Summary */}
      <div className="bg-gray-50 px-4 py-3 border-t border-gray-200">
        <div className="text-sm text-gray-700">
          {t.myItems.orders.yourOrders}
          <span className="font-medium">{orders.length}</span>
        </div>
      </div>
    </div>
  );
};

export default MyOrdersTable;
