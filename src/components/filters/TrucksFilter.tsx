// src/components/filters/TrucksFilter.tsx
import React, { useState, useEffect } from "react";
import type { TrucksFilterParams } from "@/api/trucksApi";
import LocationSelect from "@/components/ui/LocationSelect";
import type { LocationResult } from "@/api/locationApi";
import { useLocalization } from "@/hooks/useLocalization";

interface TrucksFilterProps {
  onFiltersChange: (filters: TrucksFilterParams) => void;
  currentFilters: TrucksFilterParams;
}

const TrucksFilter: React.FC<TrucksFilterProps> = ({
  onFiltersChange,
  currentFilters,
}) => {
  const { t } = useLocalization();

  // Локальное состояние для полей ввода
  const [localFilters, setLocalFilters] = useState<TrucksFilterParams>(currentFilters);

  // Синхронизируем локальное состояние с внешними фильтрами
  useEffect(() => {
    setLocalFilters(currentFilters);
  }, [currentFilters]);

  const handleInputChange =
    (field: keyof TrucksFilterParams) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const value =
        e.target.type === "number"
          ? +e.target.value || undefined
          : e.target.value || undefined;

      setLocalFilters({
        ...localFilters,
        [field]: value,
      });
    };

  const handleLocationSelect =
    (field: "fromCountry" | "toCountry") => (location: LocationResult | null) => {
      const countryCode = location?.address?.country_code || "";

      setLocalFilters({
        ...localFilters,
        [field]: countryCode || undefined,
      });
    };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleSearch = () => {
    onFiltersChange(localFilters);
  };

  const handleReset = () => {
    const emptyFilters = {};
    setLocalFilters(emptyFilters);
    onFiltersChange(emptyFilters);
  };

  const removeFilter = (filterKey: string) => {
    const updatedFilters = { ...currentFilters };
    delete updatedFilters[filterKey as keyof TrucksFilterParams];
    setLocalFilters(updatedFilters);
    onFiltersChange(updatedFilters);
  };

  const activeFiltersCount = Object.keys(currentFilters).filter(
    (key) =>
      currentFilters[key as keyof TrucksFilterParams] !== undefined &&
      currentFilters[key as keyof TrucksFilterParams] !== null &&
      currentFilters[key as keyof TrucksFilterParams] !== ""
  ).length;

  return (
    <div className="bg-white shadow-sm rounded-lg border border-gray-200 mb-4">
      <div className="p-3">
        {/* Компактная сетка в 1 строку */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 items-end">
          <div>
            <LocationSelect
              label={t.filterTrucks.location.pickupLocation}
              placeholder={t.filterTrucks.location.pickupPlaceholder}
              onSelect={handleLocationSelect("fromCountry")}
              showCountryOnly={true}
              className="text-sm"
            />
          </div>

          <div>
            <LocationSelect
              label={t.filterTrucks.location.deliveryLocation}
              placeholder={t.filterTrucks.location.deliveryPlaceholder}
              onSelect={handleLocationSelect("toCountry")}
              showCountryOnly={true}
              className="text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              {t.filterTrucks.truckDetails.weight} (min)
            </label>
            <input
              type="number"
              placeholder={t.filterTrucks.truckDetails.weightPlaceholder}
              min="0"
              value={localFilters.minLoadCapacity || ""}
              onChange={handleInputChange("minLoadCapacity")}
              onKeyPress={handleKeyPress}
              className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              {t.filterTrucks.truckDetails.weight} (max)
            </label>
            <input
              type="number"
              placeholder="50"
              min="0"
              value={localFilters.maxLoadCapacity || ""}
              onChange={handleInputChange("maxLoadCapacity")}
              onKeyPress={handleKeyPress}
              className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              {t.filterTrucks.truckDetails.price} (min, {t.common.som})
            </label>
            <input
              type="number"
              placeholder={t.filterTrucks.truckDetails.pricePlaceholder}
              min="0"
              value={
                localFilters.minPriceWithVat || localFilters.minPriceWithoutVat || ""
              }
              onChange={(e) => {
                const value = +e.target.value || undefined;
                setLocalFilters({
                  ...localFilters,
                  minPriceWithVat: value,
                  minPriceWithoutVat: value,
                });
              }}
              onKeyPress={handleKeyPress}
              className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              {t.filterTrucks.truckDetails.price} (max, {t.common.som})
            </label>
            <input
              type="number"
              placeholder="100000"
              min="0"
              value={
                localFilters.maxPriceWithVat || localFilters.maxPriceWithoutVat || ""
              }
              onChange={(e) => {
                const value = +e.target.value || undefined;
                setLocalFilters({
                  ...localFilters,
                  maxPriceWithVat: value,
                  maxPriceWithoutVat: value,
                });
              }}
              onKeyPress={handleKeyPress}
              className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Кнопки управления */}
        <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-100">
          <div className="flex items-center gap-2">
            <div className="text-xs text-gray-500">
              {activeFiltersCount > 0
                ? `${t.exportersCatalog.search.searchButton}: ${activeFiltersCount}`
                : t.pages.trucks}
            </div>
            {activeFiltersCount > 0 && (
              <div className="flex flex-wrap gap-1">
                {Object.entries(currentFilters)
                  .filter(
                    ([, value]) => value !== undefined && value !== null && value !== ""
                  )
                  .map(([key, value]) => (
                    <span
                      key={key}
                      className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                    >
                      <span>
                        {key}: {value}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeFilter(key);
                        }}
                        className="text-blue-600 hover:text-blue-800 hover:bg-blue-200 rounded-full p-0.5 transition-colors"
                        title="Убрать фильтр"
                      >
                        <svg
                          className="w-3 h-3"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                    </span>
                  ))}
              </div>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleReset}
              className="px-3 py-1 text-xs text-gray-600 bg-gray-100 hover:bg-gray-200 rounded transition-colors"
            >
              {t.exportersCatalog.search.clearFilters}
            </button>
            <button
              onClick={handleSearch}
              className="px-3 py-1 text-xs text-white bg-blue-600 hover:bg-blue-700 rounded transition-colors"
            >
              {t.exportersCatalog.search.searchButton}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrucksFilter;
