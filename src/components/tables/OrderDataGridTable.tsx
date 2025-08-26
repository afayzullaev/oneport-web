import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
import type { GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";
import { useGetAllOrdersQuery, useFilterOrdersQuery } from "@/api/ordersApi";
import type { Order, LocalizedString } from "@/types/models/cargoOwner/order";
import { useLocalization } from "@/hooks/useLocalization";
import OrdersFilter from "@/components/filters/OrdersFilter";
import { useOrdersFilter } from "@/hooks/useOrdersFilter";
import type { LoadPackage } from "@/types/models/cargoOwner/loadPackage";
import type { LoadType } from "@/types/models/cargoOwner/loadType";
import { Package, MapPin, DollarSign, Weight, Building, User } from "lucide-react";

// Компонент для отображения названия loadType
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

// Компонент для отображения названия loadPackage
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

// Компонент для отображения названия компании
const CompanyName: React.FC<{
  profile: Order["profile"];
}> = ({ profile }) => {
  if (profile?.companyName) {
    return (
      <div className="flex items-center gap-1 text-xs text-gray-600">
        <Building size={12} />
        {profile.companyName || profile.fullName}
      </div>
    );
  } else if (profile?.fullName) {
    return (
      <div className="flex items-center gap-1 text-xs text-gray-600">
        <User size={12} />
        {profile.fullName}
      </div>
    );
  }
  return null;
};

const OrderDataGridTable: React.FC = () => {
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
            (status.readyFrom ? new Date(status.readyFrom).toLocaleDateString() : "")
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

  const getObjectName = (obj: any, fallback: string = t.common.notSpecified): string => {
    if (!obj) return fallback;
    if (typeof obj === "string") return obj;

    if (typeof obj === "object") {
      if (obj.name && typeof obj.name === "object") {
        return getLocalizedText(obj.name, fallback);
      }
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

  const columns: GridColDef[] = [
    {
      field: "loadName",
      headerName: t.ordersTable.headers.cargo,
      minWidth: 10,
      resizable: true,
      sortable: false,
      flex: 1.5,
      renderCell: (params: GridRenderCellParams) => (
        <div className="py-2">
          <div className="flex items-center gap-2">
            <Package
              size={16}
              className="text-blue-600"
            />
            <span className="text-sm font-medium text-gray-900">
              {params.value || t.common.noTitle}
            </span>
          </div>
          <CompanyName profile={params.row.profile} />
        </div>
      ),
    },
    {
      field: "characteristics",
      headerName: t.ordersTable.headers.characteristics,
      //width: getColumnWidth(30),
      minWidth: 10,
      flex: 1.5,
      resizable: true,
      sortable: false,
      renderCell: (params: GridRenderCellParams) => (
        <div className="py-2 text-sm text-gray-900 w-full">
          <div className="flex items-center justify-between mb-1 w-full">
            <div className="flex items-center gap-1 flex-shrink-0">
              <Weight size={14} />
              {formatWeight(params.row.weight, params.row.weightUnit)}
            </div>
            <div className="flex items-center gap-2 ml-auto text-right">
              <span className="font-bold">{t.ordersTable.cargoType}</span>
              <LoadTypeName loadType={params.row.loadType} />
            </div>
          </div>
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-1 flex-shrink-0">
              📐 {formatDimensions(params.row.dimensions)}
            </div>
            <div className="flex items-center gap-2 ml-auto text-right">
              <span className="font-bold">{t.ordersTable.packaging}</span>
              <LoadPackageName loadPackage={params.row.loadPackage} />
            </div>
          </div>
        </div>
      ),
    },
    {
      field: "pricing",
      headerName: t.ordersTable.headers.price,
      minWidth: 10,
      flex: 0.8,
      resizable: true,
      sortable: false,
      renderCell: (params: GridRenderCellParams) => {
        const pricing = params.row.pricing;
        if (!pricing)
          return <span className="text-gray-500">{t.common.notSpecified}</span>;

        const pricingTypeText = pricing.pricingType
          ? typeof pricing.pricingType === "string"
            ? pricing.pricingType
            : typeof pricing.pricingType === "object" && pricing.pricingType.name
            ? getLocalizedText(pricing.pricingType.name)
            : pricing.pricingType._id || "Pricing Type"
          : t.common.som;

        let priceDisplay;
        if (pricing.withVat) {
          priceDisplay = (
            <span>
              {pricing.withVat.toLocaleString()}
              <span className="text-xs text-gray-500"> {pricingTypeText}</span>
            </span>
          );
        } else if (pricing.withoutVat) {
          priceDisplay = (
            <span>
              {pricing.withoutVat.toLocaleString()}
              <span className="text-xs text-gray-500"> {pricingTypeText}</span>
            </span>
          );
        } else {
          priceDisplay = t.common.negotiable;
        }

        return (
          <div className="py-2">
            <div className="flex items-center gap-1 text-green-600">
              <DollarSign size={16} />
              <span className="text-sm">{priceDisplay}</span>
            </div>
            {pricing && (pricing.withVat || pricing.withoutVat) && (
              <div className="text-xs text-gray-500 mt-1">
                {pricing.withVat ? t.common.withVat : t.common.withoutVat}
              </div>
            )}
          </div>
        );
      },
    },
    {
      field: "loadAddress",
      headerName: t.ordersTable.headers.from,
      //width: getColumnWidth(15),
      minWidth: 10,
      flex: 1,
      resizable: true,
      sortable: false,
      renderCell: (params: GridRenderCellParams) => (
        <div className="py-2">
          <div className="flex items-center gap-1">
            <MapPin
              size={16}
              className="text-green-600"
            />
            <span className="text-sm text-gray-900">
              {params.row.loadAddress?.display_place || t.common.notSpecified}
              {params.row.loadAddress?.country &&
                params.row.loadAddress?.country !== "-" && (
                  <span className="text-xs text-gray-500 ml-1">
                    ({params.row.loadAddress.country})
                  </span>
                )}
            </span>
          </div>
          {getTypesBadges(params.row.loadTypes)}
        </div>
      ),
    },
    {
      field: "unloadAddress",
      headerName: t.ordersTable.headers.to,
      //width: getColumnWidth(15),
      minWidth: 10,
      flex: 1,
      resizable: true,
      sortable: false,
      renderCell: (params: GridRenderCellParams) => (
        <div className="py-2">
          <div className="flex items-center gap-1">
            <MapPin
              size={16}
              className="text-red-600"
            />
            <span className="text-sm text-gray-900">
              {params.row.unloadAddress?.display_place || t.common.notSpecified}
              {params.row.unloadAddress?.country &&
                params.row.unloadAddress?.country !== "-" && (
                  <span className="text-xs text-gray-500 ml-1">
                    ({params.row.unloadAddress.country})
                  </span>
                )}
            </span>
          </div>
          {getTypesBadges(params.row.unloadTypes)}
        </div>
      ),
    },
    {
      field: "loadStatus",
      headerName: t.ordersTable.headers.status,
      //width: getColumnWidth(10),
      minWidth: 10,
      flex: 0.6,
      resizable: true,
      sortable: false,
      renderCell: (params: GridRenderCellParams) => (
        <div className="py-2">
          <span className="inline-flex items-center px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">
            {getStatusText(params.row.loadStatus)}
          </span>
        </div>
      ),
    },
  ];

  // Transform orders data for DataGrid (add id field)
  const rows = orders.map((order, index) => ({
    ...order,
    id: order._id || `order-${index}`,
  }));

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
            {t.ordersTable.empty.title}
          </h3>
          <p className="text-gray-500">{t.ordersTable.empty.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Фильтры заказов */}
      <OrdersFilter
        currentFilters={filters}
        onFiltersChange={updateFilters}
      />

      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <div style={{ height: 600, width: "100%" }}>
          <DataGrid
            rows={rows}
            columns={columns}
            pageSizeOptions={[5, 10, 25, 50]}
            initialState={{
              pagination: {
                paginationModel: { pageSize: 10 },
              },
            }}
            disableColumnFilter={true}
            autoPageSize
            localeText={{
              // Column management texts
              columnMenuHideColumn: "Скрыть столбец",
              columnMenuManageColumns: "Управление столбцами",

              // Optional: other localization texts
              noRowsLabel: "Нет данных",
            }}
            onRowClick={(params) => {
              navigate(`/orders/${params.row._id}`);
            }}
            sx={{
              border: "none",
              "& .MuiDataGrid-cell": {
                borderBottom: "1px solid #f3f4f6",
                display: "flex",
                alignItems: "center",
              },
              "& .MuiDataGrid-virtualScroller": {
                overflowX: "hidden !important", // forcibly hide horizontal scroll
              },
              "& .MuiDataGrid-columnHeader": {
                backgroundColor: "#f9fafb",
                fontWeight: 600,
                fontSize: "0.75rem",
                color: "#374151",
                minHeight: "35px !important", // Decrease from default ~56px
                maxHeight: "35px !important",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                borderRight: "1px solid #dadde3ff",
                borderBottom: "2px solid #6b7280",
                "&:focus": {
                  outline: "none", // Remove focus outline
                  border: "none", // Remove focus border
                },
                "&:focus-within": {
                  outline: "none", // Remove focus-within outline
                },
                "&.Mui-focusVisible": {
                  outline: "none", // Remove focus-visible outline
                  backgroundColor: "#f9fafb", // Keep original background
                },
              },
              "& .MuiDataGrid-row": {
                cursor: "pointer",
                "&:hover": {
                  backgroundColor: "#dbeafe",
                },
              },
              "& .MuiDataGrid-columnSeparator": {
                display: "block",
              },
            }}
          />
        </div>
      </div>

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

export default OrderDataGridTable;
