import * as React from "react";
import { useNavigate } from "react-router-dom";
import { useGetAllOrdersQuery, useFilterOrdersQuery } from "@/api/ordersApi";
import type { Order } from "@/types/models/cargoOwner/order";
import type { LoadPackage } from "@/types/models/cargoOwner/loadPackage";
import type { LoadType } from "@/types/models/cargoOwner/loadType";
import { useLocalization } from "@/hooks/useLocalization";
import OrdersFilter from "@/components/filters/OrdersFilter";
import { useOrdersFilter } from "@/hooks/useOrdersFilter";
import {
  Package,
  Weight,
  MapPin,
  Building,
  User,
  XCircle,
  ChevronDown,
  Filter,
  Truck,
} from "lucide-react";

// Component for displaying load type name
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

// Component for displaying load package name
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

// Component for displaying owner name
const OwnerName: React.FC<{
  profile: Order["profile"];
}> = ({ profile }) => {
  const { t } = useLocalization();

  if (!profile) return <span>{t.common.notSpecified}</span>;

  if (typeof profile === "object") {
    if (profile.companyName) {
      return (
        <div className="flex items-center gap-1 text-xs text-gray-600">
          <Building size={12} />
          {profile.companyName}
        </div>
      );
    } else if (profile.fullName) {
      return (
        <div className="flex items-center gap-1 text-xs text-gray-600">
          <User size={12} />
          {profile.fullName}
        </div>
      );
    }
  }

  return <span>{t.common.notSpecified}</span>;
};

const OrdersMobileCard: React.FC = () => {
  const navigate = useNavigate();
  const { t, getLocalizedText, formatWeight } = useLocalization();
  const [showFilters, setShowFilters] = React.useState(false);

  // Filters
  const { filters, cleanFilters, hasActiveFilters, updateFilters } = useOrdersFilter();

  // Conditional queries - either with filters or all orders
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

  // Determine which data to use
  const orders = hasActiveFilters ? filteredOrders || [] : allOrders || [];
  const isLoading = hasActiveFilters ? isFilterLoading : isAllLoading;
  const error = hasActiveFilters ? filterError : allError;

  const handleOrderClick = (orderId: string) => {
    navigate(`/orders/${orderId}`);
  };

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

  const getPricingType = (order: Order) => {
    if (!order.pricing?.pricingType) return null;
    if (typeof order.pricing.pricingType === "object" && order.pricing.pricingType.name) {
      return getLocalizedText(order.pricing.pricingType.name, "");
    }
    if (typeof order.pricing.pricingType === "string") {
      return order.pricing.pricingType;
    }
    return null;
  };

  if (isLoading) {
    return (
      <div className="p-4 space-y-4">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-lg border border-gray-200 p-4"
              >
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <XCircle
              className="text-red-500 mr-2"
              size={20}
            />
            <h3 className="text-red-800 font-medium">{t.common.error}</h3>
          </div>
          <p className="text-red-600 text-sm mt-1">{t.common.error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Filter Toggle Button */}
      <div className="p-4 pb-2">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="w-full flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Filter
              size={16}
              className="text-gray-600"
            />
            <span className="text-sm font-medium text-gray-700">Фильтры</span>
            {hasActiveFilters && (
              <span className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full">
                {Object.keys(cleanFilters).length}
              </span>
            )}
          </div>
          <ChevronDown
            size={16}
            className={`text-gray-600 transition-transform ${
              showFilters ? "rotate-180" : ""
            }`}
          />
        </button>

        {/* Collapsible Filter Section */}
        {showFilters && (
          <div className="mt-2">
            <OrdersFilter
              currentFilters={filters}
              onFiltersChange={updateFilters}
            />
          </div>
        )}
      </div>

      {/* Results Count */}
      <div className="px-4 py-2">
        <p className="text-sm text-gray-600">
          {orders.length} {orders.length === 1 ? "заказ" : "заказов"}
          {hasActiveFilters && " • отфильтровано"}
        </p>
      </div>

      {/* Orders List */}
      {orders.length === 0 ? (
        <div className="p-6">
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📦</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {hasActiveFilters ? "Ничего не найдено" : "Нет доступных заказов"}
            </h3>
            <p className="text-gray-500">
              {hasActiveFilters
                ? "Попробуйте изменить параметры поиска"
                : "Пока что нет доступных заказов"}
            </p>
          </div>
        </div>
      ) : (
        <div className="p-4 pt-0 space-y-3">
          {orders.map((order) => (
            <div
              key={order._id}
              onClick={() => order._id && handleOrderClick(order._id)}
              className="bg-white rounded-lg border border-gray-200 p-3 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
            >
              {/* Header - Route & Price */}
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Package
                      className="text-blue-600"
                      size={16}
                    />
                    <h3 className="font-semibold text-gray-900 text-base">
                      {order.loadAddress?.country_code ||
                        order.loadAddress?.display_place ||
                        t.common.notSpecified}
                      {" → "}
                      {order.unloadAddress?.country_code ||
                        order.unloadAddress?.display_place ||
                        t.common.notSpecified}
                    </h3>
                  </div>
                  <div className="text-sm text-gray-600">
                    <div className="flex items-center gap-1 mb-1">
                      <MapPin size={12} />
                      <span>
                        {order.loadAddress?.county ||
                          order.loadAddress?.display_place ||
                          t.common.notSpecified}
                        {" → "}
                        {order.unloadAddress?.county ||
                          order.unloadAddress?.display_place ||
                          t.common.notSpecified}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-blue-600">
                    {formatPrice(order.pricing)}
                  </div>
                  {(() => {
                    const pricingType = getPricingType(order);
                    const vatInfo = order.pricing?.withVat
                      ? t.common.withVat
                      : order.pricing?.withoutVat
                      ? t.common.withoutVat
                      : null;

                    return (
                      <div className="text-xs text-gray-500 mt-1 space-y-0.5">
                        {pricingType && <div>{pricingType}</div>}
                        {vatInfo && <div>{vatInfo}</div>}
                      </div>
                    );
                  })()}
                </div>
              </div>

              {/* Cargo Details - Compact */}
              <div className="space-y-2 mb-2">
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span className="flex items-center gap-1">
                    <Weight size={12} />
                    {formatWeight(order.weight, order.weightUnit)}
                  </span>
                  <span className="flex items-center gap-1">
                    <Package size={12} />
                    {order.volume || "0"} м³
                  </span>
                  <span className="text-xs">
                    📐 {formatDimensions(order.dimensions)}
                  </span>
                </div>

                {/* Cargo Type & Package */}
                <div className="text-sm text-gray-900">
                  <span className="font-medium">Груз: </span>
                  <LoadTypeName loadType={order.loadType} />
                  <span className="mx-2">•</span>
                  <span className="font-medium">Упаковка: </span>
                  <LoadPackageName loadPackage={order.loadPackage} />
                </div>
              </div>

              {/* Truck Options Required */}
              {order.truckOptions && order.truckOptions.length > 0 && (
                <div className="mb-2">
                  <div className="text-xs text-gray-500 mb-1">Требуемые грузовики:</div>
                  <div className="flex flex-wrap gap-1.5">
                    {order.truckOptions.slice(0, 3).map((truckOption) => (
                      <span
                        key={truckOption?._id}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 border border-blue-200 shadow-sm"
                      >
                        <Truck size={10} className="mr-1" />
                        {truckOption?.name.ru || t.common.notSpecified}
                      </span>
                    ))}
                    {order.truckOptions.length > 3 && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gradient-to-r from-gray-50 to-gray-100 text-gray-600 border border-gray-200 shadow-sm">
                        +{order.truckOptions.length - 3} еще
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Load Types */}
              {order.loadTypes && order.loadTypes.length > 0 && (
                <div className="mb-2">
                  <div className="text-xs text-gray-500 mb-1">Виды погрузки:</div>
                  <div className="flex flex-wrap gap-1.5">
                    {order.loadTypes.slice(0, 3).map((loadType, index) => (
                      <span
                        key={loadType?._id || index}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 border border-green-200 shadow-sm"
                      >
                        <div className="w-1.5 h-1.5 bg-green-400 rounded-full mr-1.5"></div>
                        {loadType?.name?.ru || t.common.notSpecified}
                      </span>
                    ))}
                    {order.loadTypes.length > 3 && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gradient-to-r from-orange-50 to-amber-50 text-orange-600 border border-orange-200 shadow-sm">
                        +{order.loadTypes.length - 3} еще
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Footer - Owner info */}
              <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                <OwnerName profile={order.profile} />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    order._id && handleOrderClick(order._id);
                  }}
                  className="text-blue-600 hover:text-blue-800 font-medium text-sm bg-blue-50 hover:bg-blue-100 px-3 py-1 rounded transition-colors"
                >
                  Подробнее
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrdersMobileCard;