import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "@/constants/config";
import type { Order } from "@/types/models/cargoOwner/order";

export interface OrdersFilterParams {
  // 📍 Основные фильтры
  loadCountry?: string; // Страна загрузки
  unloadCountry?: string; // Страна выгрузки
  minWeight?: number; // Минимальный вес
  maxWeight?: number; // Максимальный вес
  minPricing?: number; // Минимальная цена
  maxPricing?: number; // Максимальная цена

  // 🔄 Старые параметры для совместимости
  loadType?: string;
  loadPackage?: string;
  country?: string;
  state?: string;
  bid?: "yes" | "ask";
}

export interface UpdateOrderStatusRequest {
  id: string;
  status: Order["loadStatus"];
}

export const ordersApi = createApi({
  reducerPath: "ordersApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${BASE_URL}/orders`,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as any).authToken?.token;
      if (token) headers.set("Authorization", `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: ["Order", "MyOrders"],
  endpoints: (builder) => ({
    getAllOrders: builder.query<Order[], void>({
      query: () => "/",
      providesTags: ["Order"],
    }),
    filterOrders: builder.query<Order[], OrdersFilterParams>({
      query: (params) => ({
        url: "/filter",
        params,
      }),
      transformResponse: (response: any) => {
        // Извлекаем массив заказов из структуры ответа
        if (response?.success && response?.data?.orders) {
          return response.data.orders;
        } else if (Array.isArray(response)) {
          return response;
        } else if (Array.isArray(response?.data)) {
          return response.data;
        }
        return [];
      },
      providesTags: ["Order"],
    }),
    getOrderById: builder.query<Order, string>({
      query: (id) => `/${id}`,
      providesTags: (_, __, id) => [{ type: "Order", id }],
    }),
    getMyOrders: builder.query<Order[], void>({
      query: () => "/by-owner/me/list",
      providesTags: ["MyOrders"],
    }),
    createOrder: builder.mutation<Order, Partial<Order>>({
      query: (body) => ({
        url: "/",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Order", "MyOrders"],
    }),
    updateOrder: builder.mutation<
      Order,
      { id: string; updates: Partial<Order> }
    >({
      query: ({ id, updates }) => ({
        url: `/${id}`,
        method: "PUT",
        body: updates,
      }),
      invalidatesTags: (_, __, { id }) => [
        "Order",
        "MyOrders",
        { type: "Order", id },
      ],
    }),
    deleteOrder: builder.mutation<void, string>({
      query: (id) => ({
        url: `/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_, __, id) => [
        "Order",
        "MyOrders",
        { type: "Order", id },
      ],
    }),
    updateOrderStatus: builder.mutation<Order, UpdateOrderStatusRequest>({
      query: ({ id, status }) => ({
        url: `/${id}/status`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: (_, __, { id }) => [
        "Order",
        "MyOrders",
        { type: "Order", id },
      ],
    }),
  }),
});

export const {
  useGetAllOrdersQuery,
  useFilterOrdersQuery,
  useGetOrderByIdQuery,
  useGetMyOrdersQuery,
  useCreateOrderMutation,
  useUpdateOrderMutation,
  useDeleteOrderMutation,
  useUpdateOrderStatusMutation,
} = ordersApi;
