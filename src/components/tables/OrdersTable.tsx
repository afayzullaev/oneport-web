import * as React from "react";
import { useNavigate } from "react-router-dom";
import { useGetAllOrdersQuery, useFilterOrdersQuery } from "@/api/ordersApi";
import type { Order } from "@/types/models/cargoOwner/order";
import { useLocalization } from "@/hooks/useLocalization";
import OrdersFilter from "@/components/filters/OrdersFilter";
import { useOrdersFilter } from "@/hooks/useOrdersFilter";
import type { LoadPackage } from "@/types/models/cargoOwner/loadPackage";
import type { LoadType } from "@/types/models/cargoOwner/loadType";

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

const OrdersTable: React.FC = () => {
  const navigate = useNavigate();
  const { t, getLocalizedText, formatWeight } = useLocalization();

  const { filters, cleanFilters, hasActiveFilters, updateFilters } = useOrdersFilter();

  const {
    data: filteredOrders,
    isLoading: isFilterLoading,
    error: filterError,
  } = useFilterOrdersQuery(cleanFilters, {
    skip: !hasActiveFilters,
  });

  const {
    data: allOrders,
    isLoading: isAllLoading,
    error: allError,
  } = useGetAllOrdersQuery(undefined, {
    skip: hasActiveFilters,
  });

  const orders = hasActiveFilters ? filteredOrders || [] : allOrders || [];
  const isLoading = hasActiveFilters ? isFilterLoading : isAllLoading;
  const error = hasActiveFilters ? filterError : allError;

  const formatDimensions = (dimensions: Order["dimensions"]) => {
    if (!dimensions || typeof dimensions !== "object") return t.common.notDimensioned;
    const { length, width, height } = dimensions;
    if (!length || !width || !height) return t.common.notDimensioned;
    return `${length} м x ${width} м x ${height}м`;
  };

  const formatPrice = (pricing: Order["pricing"]) => {
    if (!pricing) return t.common.negotiable || "договорная";

    const pricingTypeText = pricing.pricingType
      ? typeof pricing.pricingType === "string"
        ? pricing.pricingType
        : typeof pricing.pricingType === "object" && pricing.pricingType.name
        ? getLocalizedText(pricing.pricingType.name)
        : pricing.pricingType._id || "Pricing Type"
      : "$";

    if (pricing.withVat) {
      return `${pricing.withVat.toLocaleString()} ${pricingTypeText}`;
    } else if (pricing.withoutVat) {
      return `${pricing.withoutVat.toLocaleString()} ${pricingTypeText}`;
    }
    return t.common.negotiable || "договорная";
  };

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

  const renderEmptyState = () => (
    <div className="bg-white shadow-sm rounded-lg overflow-hidden">
      <div className="text-center py-12">
        <div className="text-gray-400 text-6xl mb-4">📦</div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          {hasActiveFilters
            ? t.ordersTable.empty.message || "Ничего не найдено"
            : t.ordersTable.empty.title}
        </h3>
        <p className="text-gray-500">
          {hasActiveFilters
            ? t.ordersTable.empty.message || "Попробуйте изменить параметры поиска"
            : t.ordersTable.empty.message}
        </p>
      </div>
    </div>
  );

  return (
    <div className="p-6">
      <OrdersFilter
        currentFilters={filters}
        onFiltersChange={updateFilters}
      />

      {!orders || orders.length === 0 ? (
        renderEmptyState()
      ) : (
        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-200">
                    {t.ordersTable.headers.direction || "Направление"}
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-200">
                    {t.ordersTable.headers.trucktype || "Тип Грузовика"}
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-200">
                    {t.ordersTable.headers.cargo || "Груз"}
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-200">
                    {t.ordersTable.headers.characteristics || "Характеристика груза"}
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-200">
                    {t.ordersTable.headers.loadType || "Вид погрузки"}
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-200">
                    {t.ordersTable.headers.price || "Ставка"}
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    {t.ordersTable.headers.actions || "Действие"}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {orders.map((order, index) => (
                  <tr
                    key={order._id || `order-${index}`}
                    className="hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() => navigate(`/orders/${order._id}`)}
                  >
                    <td className="px-4 py-4 whitespace-nowrap border-r border-gray-200">
                      <div className="space-y-2">
                        <div className="text-sm text-gray-900 font-extrabold text-center">
                          {order.loadAddress?.country_code ||
                            order.loadAddress?.display_place ||
                            t.common.notSpecified}{" "}
                          -{" "}
                          {order.unloadAddress?.country_code ||
                            order.unloadAddress?.display_place ||
                            t.common.notSpecified}
                        </div>
                        <div className="text-sm text-gray-600 text-center">
                          {order.loadAddress?.county ||
                            order.loadAddress?.display_place ||
                            t.common.notSpecified}{" "}
                          -{" "}
                          {order.unloadAddress?.county ||
                            order.unloadAddress?.display_place ||
                            t.common.notSpecified}
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-2 border-r border-gray-200">
                      <div className="flex flex-col gap-1">
                        {order.truckOptions && order.truckOptions.length > 0 ? (
                          <>
                            {order.truckOptions.slice(0, 2).map((truckOption) => (
                              <span
                                key={truckOption?._id}
                                className="inline-flex items-center px-2.5 py-0 rounded-full text-xs font-medium bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 border border-blue-200 shadow-sm"
                              >
                                <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mr-1.5"></div>
                                {truckOption?.name.ru || t.common.notSpecified}
                              </span>
                            ))}
                            {order.truckOptions.length > 2 && (
                              <span className="inline-flex items-center px-2.5 py-0 rounded-full text-xs font-medium bg-gradient-to-r from-gray-50 to-gray-100 text-gray-600 border border-gray-200 shadow-sm">
                                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-1.5"></div>
                                +{order.truckOptions.length - 2} еще
                              </span>
                            )}
                          </>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0 rounded-full text-xs font-medium bg-gradient-to-r from-gray-50 to-gray-100 text-gray-500 border border-gray-200 shadow-sm">
                            <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-1.5"></div>
                            {t.common.notSpecified}
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="px-4 py-4 border-r border-gray-200">
                      <div className="space-y-1">
                        <div className="text-sm text-gray-900">
                          <span className="font-bold">{t.ordersTable.cargoType}</span>{" "}
                          <LoadTypeName loadType={order.loadType} />
                        </div>
                        <div className="text-sm text-gray-900">
                          <span className="font-bold">{t.ordersTable.packaging}</span>{" "}
                          <LoadPackageName loadPackage={order.loadPackage} />
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-4 border-r border-gray-200">
                      <div className="space-y-1 text-sm text-gray-900">
                        <div>
                          ⚖️ {formatWeight(order.weight, order.weightUnit)} / 📦{" "}
                          {order.volume || "0"} м³ / 📐{" "}
                          {formatDimensions(order.dimensions)}
                        </div>
                      </div>
                    </td>

                    <td className="px-2 py-2 border-r border-gray-200">
                      <div className="flex flex-wrap gap-1.5 max-w-[200px]">
                        {order.loadTypes && order.loadTypes.length > 0 ? (
                          <>
                            {order.loadTypes.slice(0, 2).map((loadType, index) => (
                              <span
                                key={loadType?._id || index}
                                className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 border border-green-200 shadow-sm"
                              >
                                <div className="w-1.5 h-1.5 bg-green-400 rounded-full mr-1.5"></div>
                                {loadType?.name?.ru || t.common.notSpecified}
                              </span>
                            ))}
                            {order.loadTypes.length > 2 && (
                              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-orange-50 to-amber-50 text-orange-600 border border-orange-200 shadow-sm">
                                <div className="w-1.5 h-1.5 bg-orange-400 rounded-full mr-1.5"></div>
                                +{order.loadTypes.length - 2} еще
                              </span>
                            )}
                          </>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-gray-50 to-gray-100 text-gray-500 border border-gray-200 shadow-sm">
                            <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-1.5"></div>
                            {t.common.notSpecified}
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="px-4 py-4 border-r border-gray-200">
                      <div className="text-sm font-medium text-blue-600">
                        {formatPrice(order.pricing)}
                      </div>
                    </td>

                    <td className="px-4 py-4">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/orders/${order._id}`);
                        }}
                        className="text-blue-600 hover:text-blue-800 font-medium text-sm bg-blue-50 hover:bg-blue-100 px-3 py-1 rounded transition-colors"
                      >
                        Подробнее
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="mt-4 flex items-center justify-between">
        <div className="text-sm text-gray-700">
          {hasActiveFilters ? (
            <>
              Найдено <span className="font-medium">{orders?.length || 0}</span> заказов
              по фильтрам
            </>
          ) : (
            <>
              {t.ordersTable.summary}{" "}
              <span className="font-medium">{orders?.length || 0}</span>{" "}
              {t.ordersTable.orders}
            </>
          )}
        </div>
        <div className="text-sm text-gray-500">
          {hasActiveFilters ? "Результаты фильтрации" : t.ordersTable.updated}
        </div>
      </div>
    </div>
  );
};

export default OrdersTable;
