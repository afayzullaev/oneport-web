// src/components/filters/OrdersFilter.tsx
import React, { useState, useEffect } from "react";
import type { OrdersFilterParams } from "@/api/ordersApi";
import LocationSelect from "@/components/ui/LocationSelect";
import type { LocationResult } from "@/api/locationApi";
import { useLocalization } from "@/hooks/useLocalization";

interface OrdersFilterProps {
  onFiltersChange: (filters: OrdersFilterParams) => void;
  currentFilters: OrdersFilterParams;
}

const OrdersFilter: React.FC<OrdersFilterProps> = ({
  onFiltersChange,
  currentFilters,
}) => {
  const { t } = useLocalization();
  
  // Локальное состояние для полей ввода
  const [localFilters, setLocalFilters] =
    useState<OrdersFilterParams>(currentFilters);

  // Синхронизируем локальное состояние с внешними фильтрами
  useEffect(() => {
    setLocalFilters(currentFilters);
  }, [currentFilters]);

  const handleInputChange =
    (field: keyof OrdersFilterParams) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value =
        e.target.type === "number"
          ? +e.target.value || undefined
          : e.target.value || undefined;

      setLocalFilters({
        ...localFilters,
        [field]: value,
      });
    };

  const handleLocationSelect = (field: 'loadCountry' | 'unloadCountry') => (location: LocationResult | null) => {
    const countryName = location?.address?.country || location?.display_place || '';
    
    setLocalFilters({
      ...localFilters,
      [field]: countryName || undefined,
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
    delete updatedFilters[filterKey as keyof OrdersFilterParams];
    setLocalFilters(updatedFilters);
    onFiltersChange(updatedFilters);
  };

  const activeFiltersCount = Object.keys(currentFilters).filter(
    (key) =>
      currentFilters[key as keyof OrdersFilterParams] !== undefined &&
      currentFilters[key as keyof OrdersFilterParams] !== null &&
      currentFilters[key as keyof OrdersFilterParams] !== ""
  ).length;

  return (
    <div className="bg-white shadow-sm rounded-lg border border-gray-200 mb-4">
      <div className="p-3">
        {/* Компактная сетка в 2 строки */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 items-end">
          {/* Первая строка */}
          <div>
            <LocationSelect
              label={t.filterCargo.location.pickupLocation}
              placeholder={t.filterCargo.location.pickupPlaceholder}
              value={localFilters.loadCountry || ""}
              onSelect={handleLocationSelect('loadCountry')}
              showCountryOnly={true}
              className="text-sm"
            />
          </div>

          <div>
            <LocationSelect
              label={t.filterCargo.location.deliveryLocation}
              placeholder={t.filterCargo.location.deliveryPlaceholder}
              value={localFilters.unloadCountry || ""}
              onSelect={handleLocationSelect('unloadCountry')}
              showCountryOnly={true}
              className="text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              {t.filterCargo.cargoDetails.weight} (min)
            </label>
            <input
              type="number"
              placeholder={t.filterCargo.cargoDetails.weightPlaceholder}
              min="0"
              value={localFilters.minWeight || ""}
              onChange={handleInputChange("minWeight")}
              onKeyPress={handleKeyPress}
              className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              {t.filterCargo.cargoDetails.weight} (max)
            </label>
            <input
              type="number"
              placeholder={t.filterCargo.cargoDetails.weightPlaceholder}
              min="0"
              value={localFilters.maxWeight || ""}
              onChange={handleInputChange("maxWeight")}
              onKeyPress={handleKeyPress}
              className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              {t.filterCargo.cargoDetails.price} (min, {t.common.som})
            </label>
            <input
              type="number"
              placeholder={t.filterCargo.cargoDetails.pricePlaceholder}
              min="0"
              value={localFilters.minPricing || ""}
              onChange={handleInputChange("minPricing")}
              onKeyPress={handleKeyPress}
              className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              {t.filterCargo.cargoDetails.price} (max, {t.common.som})
            </label>
            <input
              type="number"
              placeholder={t.filterCargo.cargoDetails.pricePlaceholder}
              min="0"
              value={localFilters.maxPricing || ""}
              onChange={handleInputChange("maxPricing")}
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
                : t.pages.orders}
            </div>
            {activeFiltersCount > 0 && (
              <div className="flex flex-wrap gap-1">
                {Object.entries(currentFilters)
                  .filter(
                    ([, value]) =>
                      value !== undefined && value !== null && value !== ""
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

export default OrdersFilter;
