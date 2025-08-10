// src/api/truckLoadTypesApi.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "@/constants/config";
import type { TruckLoadType } from "@/types/models/carrier/truckloadtype";

export const truckLoadTypesApi = createApi({
  reducerPath: "truckLoadTypesApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${BASE_URL}/truck-load-types`,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as any).authToken?.token;
      if (token) headers.set("Authorization", `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: ["TruckLoadType"],
  endpoints: (builder) => ({
    getTruckLoadTypes: builder.query<TruckLoadType[], void>({
      query: () => "/",
      providesTags: ["TruckLoadType"],
    }),
    getTruckLoadTypeById: builder.query<TruckLoadType, string>({
      query: (id) => `/${id}`,
      providesTags: (_, __, id) => [{ type: "TruckLoadType", id }],
    }),
    createTruckLoadType: builder.mutation<
      TruckLoadType,
      Partial<TruckLoadType>
    >({
      query: (body) => ({
        url: "/",
        method: "POST",
        body,
      }),
      invalidatesTags: ["TruckLoadType"],
    }),
    updateTruckLoadType: builder.mutation<
      TruckLoadType,
      { id: string; updates: Partial<TruckLoadType> }
    >({
      query: ({ id, updates }) => ({
        url: `/${id}`,
        method: "PUT",
        body: updates,
      }),
      invalidatesTags: (_, __, { id }) => [
        "TruckLoadType",
        { type: "TruckLoadType", id },
      ],
    }),
    deleteTruckLoadType: builder.mutation<void, string>({
      query: (id) => ({
        url: `/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_, __, id) => [
        "TruckLoadType",
        { type: "TruckLoadType", id },
      ],
    }),
  }),
});

export const {
  useGetTruckLoadTypesQuery,
  useGetTruckLoadTypeByIdQuery,
  useCreateTruckLoadTypeMutation,
  useUpdateTruckLoadTypeMutation,
  useDeleteTruckLoadTypeMutation,
} = truckLoadTypesApi;
