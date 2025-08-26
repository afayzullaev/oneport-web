import React from "react";
import { useNavigate } from "react-router-dom";
import { useGetAllOrdersQuery, useFilterOrdersQuery } from "@/api/ordersApi";
import type { Order, LocalizedString } from "@/types/models/cargoOwner/order";
import { useLocalization } from "@/hooks/useLocalization";
import OrdersFilter from "@/components/filters/OrdersFilter";
import { useOrdersFilter } from "@/hooks/useOrdersFilter";
import type { LoadPackage } from "@/types/models/cargoOwner/loadPackage";
import type { LoadType } from "@/types/models/cargoOwner/loadType";

// Компонент для отображения названия loadType (с загрузкой по ID если нужно)
const LoadTypeName: React.FC<{ loadType?: Order["loadType"] }> = ({
  loadType,
}) => {
  const { getLocalizedText, t } = useLocalization();

  const loadTypeData: LoadType = loadType as LoadType;

  if (!loadType) return <span>{t.common.notSpecified}</span>;

  // Если это объект, используем его напрямую
  if (typeof loadType === "object") {
    return (
      <span>{getLocalizedText(loadType.name, t.common.notSpecified)}</span>
    );
  }

  // Если это строка и мы получили данные, используем их
  if (typeof loadType === "string" && loadTypeData) {
    return (
      <span>{getLocalizedText(loadTypeData.name, t.common.notSpecified)}</span>
    );
  }

  // Fallback - показываем ID
  return <span>{loadType}</span>;
};

// Компонент для отображения названия loadPackage (с загрузкой по ID если нужно)
const LoadPackageName: React.FC<{ loadPackage?: Order["loadPackage"] }> = ({
  loadPackage,
}) => {
  const { getLocalizedText, t } = useLocalization();

  const loadPackageData: LoadPackage = loadPackage as LoadPackage;

  if (!loadPackage) return <span>{t.common.standard}</span>;

  // Если это объект, используем его напрямую
  if (typeof loadPackage === "object") {
    return <span>{getLocalizedText(loadPackage.name, t.common.standard)}</span>;
  }

  // Если это строка и мы получили данные, используем их
  if (typeof loadPackage === "string" && loadPackageData) {
    return (
      <span>{getLocalizedText(loadPackageData.name, t.common.standard)}</span>
    );
  }

  // Fallback - показываем ID
  return <span>{loadPackage}</span>;
};

// Компонент для отображения названия компании по userId owner'а
const CompanyName: React.FC<{
  profile: Order["profile"];
}> = ({ profile }) => {
  if (profile?.companyName) {
    return (
      <div className="text-xs text-gray-600">🏢 {profile.companyName || profile.fullName}</div>
    );
  }else if (profile?.fullName) {
    return (
      <div className="text-xs text-gray-600">👤 {profile.fullName}</div>
    );
  }
};

const OrdersTable: React.FC = () => {
  const navigate = useNavigate();
  const { t, getLocalizedText, formatWeight } = useLocalization();

  // Фильтры
  const { filters, cleanFilters, hasActiveFilters, updateFilters } =
    useOrdersFilter();

  // Условные запросы - либо с фильтрами, либо все заказы
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

  // Определяем какие данные использовать (теперь API возвращает правильный формат)

  const orders = hasActiveFilters ? filteredOrders || [] : allOrders || [];
  const isLoading = hasActiveFilters ? isFilterLoading : isAllLoading;
  const error = hasActiveFilters ? filterError : allError;

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <div
key={i}
className="h-16 bg-gray-200 rounded"></div>
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
          <h3 className="text-red-800 font-medium">
            {t.ordersTable.error.title}
          </h3>
          <p className="text-red-600 text-sm mt-1">
            {t.ordersTable.error.message}
          </p>
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
            {t.ordersTable.empty.title}
          </h3>
          <p className="text-gray-500">{t.ordersTable.empty.message}</p>
        </div>
      </div>
    );
  }

  const formatDimensions = (dimensions: Order["dimensions"]) => {
    if (!dimensions || typeof dimensions !== "object")
      return t.common.notDimensioned;
    const { length, width, height } = dimensions;
    if (!length || !width || !height) return t.common.notDimensioned;
    return `${length}×${width}×${height}м`;
  };

  const getStatusText = (status: Order["loadStatus"]) => {
    if (!status || !status.state) return t.status.notSpecified;
    try {
      switch (status.state) {
        case "ready_from":
          return (
            t.status.readyFrom +
            " " +
            (status.readyFrom
              ? new Date(status.readyFrom).toLocaleDateString()
              : "")
          );
        case "always":
          return t.status.always;
        case "not_ready":
          return t.status.notReady;
        default:
          return status.state;
      }
    } catch (error) {
      return t.status.statusError;
    }
  };

  const getObjectName = (
    obj: any,
    fallback: string = t.common.notSpecified
  ): string => {
    if (!obj) return fallback;
    if (typeof obj === "string") return obj;

    if (typeof obj === "object") {
      // If obj has a name property (it's always LocalizedString now)
      if (obj.name && typeof obj.name === "object") {
        return getLocalizedText(obj.name, fallback);
      }

      // If obj itself is a localized object (has language keys)
      if (obj.ru || obj.en || obj.uz || obj.kz || obj.kaa) {
        return getLocalizedText(obj, fallback);
      }
    }

    return fallback;
  };

  const getTypesBadges = (
    types?: (string | { _id: string; name: LocalizedString; __v?: number })[]
  ) => {
    if (!types || types.length === 0) return null;

    return (
      <div className="flex flex-wrap gap-1 mt-1">
        {types.slice(0, 2).map((type, index) => (
          <span
            key={index}
            className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-700"
          >
            {getObjectName(type, t.common.typeLabel)}
          </span>
        ))}
        {types.length > 2 && (
          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-gray-200 text-gray-600">
            +{types.length - 2}
          </span>
        )}
      </div>
    );
  };

  return (
    <div className="p-6">
      {/* Фильтры заказов */}
      <OrdersFilter
currentFilters={filters}
onFiltersChange={updateFilters} />
      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider w-1/5">
                  {t.ordersTable.headers.cargo}
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider w-9/30">
                  {t.ordersTable.headers.characteristics}
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider w-1/10">
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
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {Array.isArray(orders) &&
                orders.map((order, index) => (
                  <tr
                    key={order._id || `order-${index}`}
                    className="hover:bg-blue-50 transition-colors duration-150 border-b border-gray-200 cursor-pointer"
                    onClick={() => {
                      navigate(`/orders/${order._id}`);
                    }}
                  >
                    {/* Название груза */}
                    <td className="px-4 py-3">
                      <div className="text-sm font-medium text-gray-900">
                        {order.loadName || t.common.noTitle}
                      </div>
                      <div className="mt-1">
                        <CompanyName profile={order.profile} />
                      </div>
                    </td>

                    {/* Характеристики (вес + размеры + тип) */}
                    <td className="px-6 py-3">
                      <div className="text-sm text-gray-900">
                        <div className="flex items-center justify-between">
                          ⚖️ {formatWeight(order.weight, order.weightUnit)}
                          <div className="flex items-center gap-2">
                            <span className="font-bold">
                              {t.ordersTable.cargoType}
                            </span>{" "}
                            <LoadTypeName loadType={order.loadType} />{" "}
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          📐 {formatDimensions(order.dimensions)}
                          <div className="flex items-center gap-2">
                            <span className="font-bold">
                              {t.ordersTable.packaging}
                            </span>{" "}
                            <LoadPackageName loadPackage={order.loadPackage} />
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Цена */}
                    <td className="px-4 py-3">
                      <div className="text-x text-green-600">
                        {(() => {
                          if (!order.pricing) return t.common.notSpecified;

                          const pricingTypeText = order.pricing.pricingType
                            ? typeof order.pricing.pricingType === "string"
                              ? order.pricing.pricingType
                              : typeof order.pricing.pricingType === "object" &&
                                order.pricing.pricingType.name
                              ? getLocalizedText(order.pricing.pricingType.name)
                              : order.pricing.pricingType._id || "Pricing Type"
                            : t.common.som;

                          if (order.pricing.withVat) {
                            return (
                              <span>
                                {order.pricing.withVat.toLocaleString()}
                                <span className="text-xs text-gray-500">
                                  {" "}
                                  {pricingTypeText}
                                </span>
                              </span>
                            );
                          }
                          if (order.pricing.withoutVat) {
                            return (
                              <span>
                                {order.pricing.withoutVat.toLocaleString()}
                                <span className="text-xs text-gray-500">
                                  {" "}
                                  {pricingTypeText}
                                </span>
                              </span>
                            );
                          }
                          return t.common.negotiable;
                        })()}
                      </div>
                      {order.pricing &&
                        (order.pricing.withVat || order.pricing.withoutVat) && (
                          <div className="text-xs text-gray-500 mt-1">
                            {order.pricing.withVat
                              ? t.common.withVat
                              : t.common.withoutVat}
                          </div>
                        )}
                    </td>

                    {/* Откуда */}
                    <td className="px-4 py-3">
                      <div className="text-sm text-gray-900">
                        {order.loadAddress?.display_place ||
                          t.common.notSpecified}
                        {order.loadAddress?.country &&
                          order.loadAddress?.country !== "-" && (
                            <span className="text-xs text-gray-500 ml-1">
                              ({order.loadAddress.country})
                            </span>
                          )}
                      </div>
                      <div className="mt-1">
                        {getTypesBadges(order.loadTypes)}
                      </div>
                    </td>

                    {/* Куда */}
                    <td className="px-4 py-3">
                      <div className="text-sm text-gray-900">
                        {order.unloadAddress?.display_place ||
                          t.common.notSpecified}
                        {order.unloadAddress?.country &&
                          order.unloadAddress?.country !== "-" && (
                            <span className="text-xs text-gray-500 ml-1">
                              ({order.unloadAddress.country})
                            </span>
                          )}
                      </div>
                      <div className="mt-1">
                        {getTypesBadges(order.unloadTypes)}
                      </div>
                    </td>

                    {/* Статус */}
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">
                        {getStatusText(order.loadStatus)}
                      </span>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div className="text-sm text-gray-700">
          {hasActiveFilters ? (
            <>
              Найдено <span className="font-medium">{orders?.length || 0}</span>{" "}
              заказов по фильтрам
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
