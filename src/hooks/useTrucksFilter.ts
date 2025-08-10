import { useState, useMemo } from "react";
import type { TrucksFilterParams } from "@/api/trucksApi";

export const useTrucksFilter = () => {
  const [filters, setFilters] = useState<TrucksFilterParams>({});

  // Проверяем, есть ли активные фильтры
  const hasActiveFilters = useMemo(() => {
    return Object.values(filters).some((value) => {
      if (Array.isArray(value)) {
        return value.length > 0;
      }
      return value !== undefined && value !== null && value !== "";
    });
  }, [filters]);

  // Очищенные фильтры (убираем пустые значения)
  const cleanFilters = useMemo(() => {
    const cleaned: TrucksFilterParams = {};

    Object.entries(filters).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        if (value.length > 0) {
          cleaned[key as keyof TrucksFilterParams] = value as any;
        }
      } else if (value !== undefined && value !== null && value !== "") {
        cleaned[key as keyof TrucksFilterParams] = value as any;
      }
    });

    return cleaned;
  }, [filters]);

  const updateFilters = (newFilters: Partial<TrucksFilterParams>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const clearFilters = () => {
    setFilters({});
  };

  return {
    filters,
    cleanFilters,
    hasActiveFilters,
    updateFilters,
    clearFilters,
  };
};
