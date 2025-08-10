// src/hooks/useOrdersFilter.ts
import { useState, useCallback, useMemo } from "react";
import type { OrdersFilterParams } from "@/api/ordersApi";

export const useOrdersFilter = () => {
  const [filters, setFilters] = useState<OrdersFilterParams>({});

  const updateFilters = useCallback((newFilters: OrdersFilterParams) => {
    setFilters(newFilters);
  }, []);

  const resetFilters = useCallback(() => {
    setFilters({});
  }, []);

  // Очищаем пустые значения для API запроса
  const cleanFilters = useMemo(() => {
    const cleaned: OrdersFilterParams = {};

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        cleaned[key as keyof OrdersFilterParams] = value;
      }
    });

    return cleaned;
  }, [filters]);

  // Проверяем, есть ли активные фильтры
  const hasActiveFilters = useMemo(() => {
    return Object.keys(cleanFilters).length > 0;
  }, [cleanFilters]);

  return {
    filters,
    cleanFilters,
    hasActiveFilters,
    updateFilters,
    resetFilters,
  };
};
