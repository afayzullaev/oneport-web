import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
import type { GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";
import { useGetAllTrucksQuery, useFilterTrucksQuery } from "@/api/trucksApi";
import type { Truck, LocalizedString } from "@/types/models/carrier/truck";
import { useLocalization } from "@/hooks/useLocalization";
import TrucksFilter from "@/components/filters/TrucksFilter";
import { useTrucksFilter } from "@/hooks/useTrucksFilter";
import type { TruckOptions } from "@/types/models/carrier/truckoptions";
import {
  Truck as TruckIcon,
  MapPin,
  DollarSign,
  Weight,
  Building,
  User,
  Package,
} from "lucide-react";

// Компонент для отображения названия truckOption
const TruckOptionName: React.FC<{ truckOption?: Truck["truckOption"] }> = ({
  truckOption,
}) => {
  const { getLocalizedText, t } = useLocalization();

  const truckOptionData: TruckOptions = truckOption as TruckOptions;

  if (!truckOption) return <span>{t.common.notSpecified}</span>;

  // Если это объект, используем его напрямую
  if (typeof truckOption === "object") {
    return <span>{getLocalizedText(truckOption.name, t.common.notSpecified)}</span>;
  }

  // Если это строка и мы получили данные, используем их
  if (typeof truckOption === "string" && truckOptionData) {
    return <span>{getLocalizedText(truckOptionData.name, t.common.notSpecified)}</span>;
  }

  // Fallback - показываем ID
  return <span>{truckOption}</span>;
};

// Компонент для отображения названия компании по userId owner'а
const OwnerName: React.FC<{
  profile: Truck["profile"];
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

const TruckDataGridTable: React.FC = () => {
  const navigate = useNavigate();
  const { t, getLocalizedText } = useLocalization();

  // Фильтры
  const { filters, cleanFilters, hasActiveFilters, updateFilters } = useTrucksFilter();

  // Условные запросы - либо с фильтрами, либо все грузовики
  const {
    data: filteredTrucks,
    isLoading: isFilterLoading,
    error: filterError,
  } = useFilterTrucksQuery(cleanFilters, {
    skip: !hasActiveFilters,
  });

  const {
    data: allTrucks,
    isLoading: isAllLoading,
    error: allError,
  } = useGetAllTrucksQuery(undefined, {
    skip: hasActiveFilters,
  });

  // Определяем какие данные использовать
  const trucks = hasActiveFilters ? filteredTrucks || [] : allTrucks || [];
  const isLoading = hasActiveFilters ? isFilterLoading : isAllLoading;
  const error = hasActiveFilters ? filterError : allError;

  const formatDimensions = (dimensions: Truck["dimensions"]) => {
    if (!dimensions || typeof dimensions !== "object") return t.common.notDimensioned;
    const { length, width, height } = dimensions;
    if (!length || !width || !height) return t.common.notDimensioned;
    return `${length}×${width}×${height}м`;
  };

  const getReadyTypeText = (readyType: Truck["readyType"]) => {
    if (!readyType || !readyType.type) return t.status.notSpecified;
    try {
      switch (readyType.type) {
        case "ready_from":
          return (
            t.status.readyFrom +
            " " +
            (readyType.readyFrom
              ? new Date(readyType.readyFrom).toLocaleDateString()
              : "")
          );
        case "always":
          return t.status.always;
        default:
          return readyType.type;
      }
    } catch (error) {
      return t.status.statusError;
    }
  };

  const getObjectName = (obj: any, fallback: string = t.common.notSpecified): string => {
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

  const getLoadTypesBadges = (
    types?: (string | { _id: string; name: LocalizedString; __v?: number })[]
  ) => {
    if (!types || types.length === 0) return null;

    return (
      <div className="flex flex-wrap gap-1 mt-1">
        {types.slice(0, 2).map((type, index) => (
          <span
            key={index}
            className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-700"
          >
            {getObjectName(type, t.common.typeLabel)}
          </span>
        ))}
        {types.length > 2 && (
          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-blue-200 text-blue-600">
            +{types.length - 2}
          </span>
        )}
      </div>
    );
  };

  const getTrailerTypeText = (trailerType: Truck["trailerType"]) => {
    switch (trailerType) {
      case "truck":
        return "Грузовик";
      case "trailer":
        return "Прицеп";
      case "semi_trailer":
        return "Полуприцеп";
      default:
        return trailerType;
    }
  };

  const columns: GridColDef[] = [
    {
      field: "truckInfo",
      headerName: "Грузовик",
      minWidth: 10,
      resizable: true,
      sortable: false,
      flex: 1.5,
      renderCell: (params: GridRenderCellParams) => (
        <div className="py-2">
          <div className="flex items-center gap-2">
            <TruckIcon
              size={16}
              className="text-blue-600"
            />
            <div>
              <div className="text-sm font-medium text-gray-900">
                {getTrailerTypeText(params.row.trailerType)}
              </div>
              <div className="text-xs text-gray-500">
                {params.row.truckNumber || t.common.notSpecified}
              </div>
            </div>
          </div>
          <OwnerName profile={params.row.profile} />
        </div>
      ),
    },
    {
      field: "characteristics",
      headerName: "Характеристики",
      minWidth: 10,
      flex: 1.5,
      resizable: true,
      sortable: false,
      renderCell: (params: GridRenderCellParams) => (
        <div className="py-2 text-sm text-gray-900 w-full">
          <div className="flex items-center justify-between mb-1 w-full">
            <div className="flex items-center gap-1 flex-shrink-0">
              <Weight size={14} />
              {params.row.loadCapacity} т
            </div>
            <div className="flex items-center gap-2 ml-auto text-right">
              <span className="font-bold">Тип кузова:</span>
              <TruckOptionName truckOption={params.row.truckOption} />
            </div>
          </div>
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-1 flex-shrink-0">
              <Package size={14} />
              {params.row.volume} м³
            </div>
            <div className="flex items-center gap-2 ml-auto text-right">
              📐 {formatDimensions(params.row.dimensions)}
            </div>
          </div>
        </div>
      ),
    },
    {
      field: "pricing",
      headerName: "Цена",
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
      field: "fromAddress",
      headerName: "Откуда",
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
              {params.row.fromAddress?.display_place || t.common.notSpecified}
              {params.row.fromAddress?.country &&
                params.row.fromAddress?.country !== "-" && (
                  <span className="text-xs text-gray-500 ml-1">
                    ({params.row.fromAddress.country})
                  </span>
                )}
            </span>
          </div>
          {getLoadTypesBadges(params.row.loadTypes)}
        </div>
      ),
    },
    {
      field: "toAddress",
      headerName: "Куда",
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
              {params.row.toAddress?.display_place || t.common.notSpecified}
              {params.row.toAddress?.country && params.row.toAddress?.country !== "-" && (
                <span className="text-xs text-gray-500 ml-1">
                  ({params.row.toAddress.country})
                </span>
              )}
            </span>
          </div>
        </div>
      ),
    },
    {
      field: "status",
      headerName: "Статус",
      minWidth: 10,
      flex: 0.6,
      resizable: true,
      sortable: false,
      renderCell: (params: GridRenderCellParams) => (
        <div className="py-2">
          <div className="flex flex-col gap-1">
            <span
              className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${
                params.row.isActive
                  ? "bg-green-100 text-green-800"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              {params.row.isActive ? "Активен" : "Неактивен"}
            </span>
            <span className="inline-flex items-center px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">
              {getReadyTypeText(params.row.readyType)}
            </span>
          </div>
        </div>
      ),
    },
  ];

  // Transform trucks data for DataGrid (add id field)
  const rows = trucks.map((truck, index) => ({
    ...truck,
    id: truck._id || `truck-${index}`,
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
          <h3 className="text-red-800 font-medium">Ошибка загрузки грузовиков</h3>
          <p className="text-red-600 text-sm mt-1">
            Не удалось загрузить список грузовиков. Попробуйте обновить страницу.
          </p>
        </div>
      </div>
    );
  }

  if (!trucks || trucks.length === 0) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">🚛</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Нет грузовиков</h3>
          <p className="text-gray-500">
            Грузовики появятся здесь, когда они будут добавлены.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Фильтры грузовиков */}
      <TrucksFilter
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
              navigate(`/trucks/${params.row._id}`);
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
              Найдено <span className="font-medium">{trucks?.length || 0}</span>{" "}
              грузовиков по фильтрам
            </>
          ) : (
            <>
              Показано <span className="font-medium">{trucks?.length || 0}</span>{" "}
              грузовиков
            </>
          )}
        </div>
        <div className="text-sm text-gray-500">
          {hasActiveFilters ? "Результаты фильтрации" : "Обновлено только что"}
        </div>
      </div>
    </div>
  );
};

export default TruckDataGridTable;
