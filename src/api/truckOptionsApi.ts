// src/api/truckOptionsApi.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "@/constants/config";
import type { TruckOptions } from "@/types/models/carrier/truckoptions";

export const truckOptionsApi = createApi({
  reducerPath: "truckOptionsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${BASE_URL}/truck-options`,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as any).authToken?.token;
      if (token) headers.set("Authorization", `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: ["TruckOptions"],
  endpoints: (builder) => ({
    getTruckOptions: builder.query<TruckOptions[], void>({
      query: () => "/",
      providesTags: ["TruckOptions"],
    }),
    getTruckOptionById: builder.query<TruckOptions, string>({
      query: (id) => `/${id}`,
      providesTags: (_, __, id) => [{ type: "TruckOptions", id }],
    }),
    getTruckOptionsByParent: builder.query<TruckOptions[], string>({
      query: (parentId) => `/parent/${parentId}`,
      providesTags: (result, _, parentId) =>
        result
          ? [
              ...result.map(({ _id }) => ({
                type: "TruckOptions" as const,
                id: _id,
              })),
              { type: "TruckOptions", id: `PARENT_${parentId}` },
            ]
          : [{ type: "TruckOptions", id: `PARENT_${parentId}` }],
    }),
    createTruckOption: builder.mutation<TruckOptions, Partial<TruckOptions>>({
      query: (body) => ({
        url: "/",
        method: "POST",
        body,
      }),
      invalidatesTags: ["TruckOptions"],
    }),
    updateTruckOption: builder.mutation<
      TruckOptions,
      { id: string; updates: Partial<TruckOptions> }
    >({
      query: ({ id, updates }) => ({
        url: `/${id}`,
        method: "PUT",
        body: updates,
      }),
      invalidatesTags: (_, __, { id }) => [
        "TruckOptions",
        { type: "TruckOptions", id },
      ],
    }),
    deleteTruckOption: builder.mutation<void, string>({
      query: (id) => ({
        url: `/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_, __, id) => [
        "TruckOptions",
        { type: "TruckOptions", id },
      ],
    }),
  }),
});

export const {
  useGetTruckOptionsQuery,
  useGetTruckOptionByIdQuery,
  useGetTruckOptionsByParentQuery,
  useCreateTruckOptionMutation,
  useUpdateTruckOptionMutation,
  useDeleteTruckOptionMutation,
} = truckOptionsApi;
