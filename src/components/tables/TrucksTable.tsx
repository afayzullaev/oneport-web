import React from "react";
import { useNavigate } from "react-router-dom";
import { useGetAllTrucksQuery, useFilterTrucksQuery } from "@/api/trucksApi";
import type { Truck, LocalizedString } from "@/types/models/carrier/truck";
import { useLocalization } from "@/hooks/useLocalization";
import TrucksFilter from "@/components/filters/TrucksFilter";
import { useTrucksFilter } from "@/hooks/useTrucksFilter";
import type { TruckOptions } from "@/types/models/carrier/truckoptions";

// Компонент для отображения названия truckOption
const TruckOptionName: React.FC<{ truckOption?: Truck["truckOption"] }> = ({
  truckOption,
}) => {
  const { getLocalizedText, t } = useLocalization();

  const truckOptionData: TruckOptions = truckOption as TruckOptions;

  if (!truckOption) return <span>{t.common.notSpecified}</span>;

  // Если это объект, используем его напрямую
  if (typeof truckOption === "object") {
    return (
      <span>{getLocalizedText(truckOption.name, t.common.notSpecified)}</span>
    );
  }

  // Если это строка и мы получили данные, используем их
  if (typeof truckOption === "string" && truckOptionData) {
    return (
      <span>
        {getLocalizedText(truckOptionData.name, t.common.notSpecified)}
      </span>
    );
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
    return (
      <div className="text-xs text-gray-600">
        👤 {profile.companyName || profile.fullName ||t.common.notSpecified}
      </div>
    );
  }

  return <span>{profile}</span>;
};

const TrucksTable: React.FC = () => {
  const navigate = useNavigate();
  const { t, getLocalizedText } = useLocalization();

  // Фильтры
  const { filters, cleanFilters, hasActiveFilters, updateFilters } =
    useTrucksFilter();

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
  console.log(trucks);
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
            Ошибка загрузки грузовиков
          </h3>
          <p className="text-red-600 text-sm mt-1">
            Не удалось загрузить список грузовиков. Попробуйте обновить
            страницу.
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
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Нет грузовиков
          </h3>
          <p className="text-gray-500">
            Грузовики появятся здесь, когда они будут добавлены.
          </p>
        </div>
      </div>
    );
  }

  const formatDimensions = (dimensions: Truck["dimensions"]) => {
    if (!dimensions || typeof dimensions !== "object")
      return t.common.notDimensioned;
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

  return (
    <div className="p-6">
      {/* Фильтры грузовиков */}
      <TrucksFilter
currentFilters={filters}
onFiltersChange={updateFilters} />
      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Грузовик
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider w-1/3">
                  Характеристики
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Цена
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Откуда
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Куда
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Статус
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {Array.isArray(trucks) &&
                trucks.map((truck, index) => (
                  <tr
                    key={truck._id || `truck-${index}`}
                    className="hover:bg-blue-50 transition-colors duration-150 border-b border-gray-200 cursor-pointer"
                    onClick={() => {
                      navigate(`/trucks/${truck._id}`);
                    }}
                  >
                    {/* Номер грузовика и тип */}
                    <td className="px-4 py-3">
                      <div className="text-sm font-medium text-gray-900">
                        {getTrailerTypeText(truck.trailerType)}
                      </div>
                      <div className="text-xs text-gray-500">
                        {truck.truckNumber || t.common.notSpecified}
                      </div>
                      <div className="mt-1">
                        <OwnerName profile={truck.profile} />
                      </div>
                    </td>

                    {/* Характеристики (грузоподъемность + объем + размеры + тип кузова) */}
                    <td className="px-6 py-3">
                      <div className="text-sm text-gray-900">
                        <div className="flex items-center justify-between">
                          ⚖️ {truck.loadCapacity} т
                          <div className="flex items-center gap-2">
                            <span className="font-bold">Тип кузова:</span>
                            <TruckOptionName truckOption={truck.truckOption} />
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          📦 {truck.volume} м³
                          <div className="flex items-center gap-2">
                            📐 {formatDimensions(truck.dimensions)}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Цена */}
                    <td className="px-4 py-3">
                      <div className="text-sm text-green-600">
                        {(() => {
                          if (!truck.pricing) return t.common.notSpecified;

                          const pricingTypeText = truck.pricing.pricingType
                            ? typeof truck.pricing.pricingType === "string"
                              ? truck.pricing.pricingType
                              : typeof truck.pricing.pricingType === "object" &&
                                truck.pricing.pricingType.name
                              ? getLocalizedText(truck.pricing.pricingType.name)
                              : truck.pricing.pricingType._id || "Pricing Type"
                            : t.common.som;

                          if (truck.pricing.withVat) {
                            return (
                              <span>
                                {truck.pricing.withVat.toLocaleString()}
                                <span className="text-xs text-gray-500">
                                  {" "}
                                  {pricingTypeText}
                                </span>
                              </span>
                            );
                          }
                          if (truck.pricing.withoutVat) {
                            return (
                              <span>
                                {truck.pricing.withoutVat.toLocaleString()}
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
                      {truck.pricing &&
                        (truck.pricing.withVat || truck.pricing.withoutVat) && (
                          <div className="text-xs text-gray-500 mt-1">
                            {truck.pricing.withVat
                              ? t.common.withVat
                              : t.common.withoutVat}
                          </div>
                        )}
                    </td>

                    {/* Откуда */}
                    <td className="px-4 py-3">
                      <div className="text-sm text-gray-900">
                        {truck.fromAddress?.display_place ||
                          t.common.notSpecified}
                        {truck.fromAddress?.country &&
                          truck.fromAddress?.country !== "-" && (
                            <span className="text-xs text-gray-500 ml-1">
                              ({truck.fromAddress.country})
                            </span>
                          )}
                        {truck.fromRadius && (
                          <div className="text-xs text-gray-500">
                            Радиус: {truck.fromRadius} км
                          </div>
                        )}
                      </div>
                      <div className="mt-1">
                        {getLoadTypesBadges(truck.loadTypes)}
                      </div>
                    </td>

                    {/* Куда */}
                    <td className="px-4 py-3">
                      <div className="text-sm text-gray-900">
                        {truck.toAddress?.display_place ||
                          t.common.notSpecified}
                        {truck.toAddress?.country &&
                          truck.toAddress?.country !== "-" && (
                            <span className="text-xs text-gray-500 ml-1">
                              ({truck.toAddress.country})
                            </span>
                          )}
                        <div className="text-xs text-gray-500">
                          Радиус: {truck.toRadius} км
                        </div>
                      </div>
                    </td>

                    {/* Статус */}
                    <td className="px-4 py-3">
                      <div className="flex flex-col gap-1">
                        <span
                          className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${
                            truck.isActive
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {truck.isActive ? "Активен" : "Неактивен"}
                        </span>
                        <span className="inline-flex items-center px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">
                          {getReadyTypeText(truck.readyType)}
                        </span>
                      </div>
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
              Найдено <span className="font-medium">{trucks?.length || 0}</span>{" "}
              грузовиков по фильтрам
            </>
          ) : (
            <>
              Показано{" "}
              <span className="font-medium">{trucks?.length || 0}</span>{" "}
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

export default TrucksTable;
