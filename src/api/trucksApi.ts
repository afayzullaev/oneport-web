// src/api/trucksApi.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "@/constants/config";
import type { Truck } from "@/types/models/carrier/truck";

export interface TrucksFilterParams {
  // 📍 Location filters
  fromCountry?: string; // Страна отправления
  toCountry?: string; // Страна назначения

  // 📏 Capacity and volume filters
  minLoadCapacity?: number; // Минимальная грузоподъемность
  maxLoadCapacity?: number; // Максимальная грузоподъемность

  // 💰 Pricing filters - matching backend parameter names
  minPriceWithVat?: number; // Минимальная цена с НДС
  maxPriceWithVat?: number; // Максимальная цена с НДС
  minPriceWithoutVat?: number; // Минимальная цена без НДС
  maxPriceWithoutVat?: number; // Максимальная цена без НДС

  // 🔄 Additional filters (for future use)
  minVolume?: number;
  maxVolume?: number;
  truckOption?: string;
  loadTypes?: string[];
  trailerType?: "truck" | "trailer" | "semi_trailer";
  bid?: "yes" | "ask";
  isActive?: boolean;
}

export interface UpdateTruckStatusRequest {
  id: string;
  isActive: boolean;
}

export const trucksApi = createApi({
  reducerPath: "trucksApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${BASE_URL}/trucks`,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as any).authToken?.token;
      if (token) headers.set("Authorization", `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: ["Truck", "MyTrucks"],
  endpoints: (builder) => ({
    getAllTrucks: builder.query<Truck[], void>({
      query: () => "/",
      providesTags: ["Truck"],
    }),
    filterTrucks: builder.query<Truck[], TrucksFilterParams>({
      query: (params) => ({
        url: "/filter",
        params,
      }),
      transformResponse: (response: any) => {
        // Извлекаем массив грузовиков из структуры ответа
        if (response?.success && response?.data?.trucks) {
          return response.data.trucks;
        } else if (Array.isArray(response)) {
          return response;
        } else if (Array.isArray(response?.data)) {
          return response.data;
        }
        return [];
      },
      providesTags: ["Truck"],
    }),
    getTruckById: builder.query<Truck, string>({
      query: (id) => `/${id}`,
      providesTags: (_, __, id) => [{ type: "Truck", id }],
    }),
    getMyTrucks: builder.query<Truck[], void>({
      query: () => "/owner/me",
      providesTags: ["MyTrucks"],
    }),
    createTruck: builder.mutation<Truck, Partial<Truck>>({
      query: (body) => ({
        url: "/",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Truck", "MyTrucks"],
    }),
    updateTruck: builder.mutation<
      Truck,
      { id: string; updates: Partial<Truck> }
    >({
      query: ({ id, updates }) => ({
        url: `/${id}`,
        method: "PUT",
        body: updates,
      }),
      invalidatesTags: (_, __, { id }) => [
        "Truck",
        "MyTrucks",
        { type: "Truck", id },
      ],
    }),
    deleteTruck: builder.mutation<void, string>({
      query: (id) => ({
        url: `/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_, __, id) => [
        "Truck",
        "MyTrucks",
        { type: "Truck", id },
      ],
    }),
    updateTruckStatus: builder.mutation<Truck, UpdateTruckStatusRequest>({
      query: ({ id, isActive }) => ({
        url: `/${id}/status`,
        method: "PATCH",
        body: { isActive },
      }),
      invalidatesTags: (_, __, { id }) => [
        "Truck",
        "MyTrucks",
        { type: "Truck", id },
      ],
    }),
  }),
});

export const {
  useGetAllTrucksQuery,
  useFilterTrucksQuery,
  useGetTruckByIdQuery,
  useGetMyTrucksQuery,
  useCreateTruckMutation,
  useUpdateTruckMutation,
  useDeleteTruckMutation,
  useUpdateTruckStatusMutation,
} = trucksApi;
