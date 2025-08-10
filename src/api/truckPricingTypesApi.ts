// src/api/truckPricingTypesApi.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "@/constants/config";
import type { TruckPricingType } from "@/types/models/carrier/truckpricingtype";

export const truckPricingTypesApi = createApi({
  reducerPath: "truckPricingTypesApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${BASE_URL}/truck-pricing-types`,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as any).authToken?.token;
      if (token) headers.set("Authorization", `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: ["TruckPricingType"],
  endpoints: (builder) => ({
    getTruckPricingTypes: builder.query<TruckPricingType[], void>({
      query: () => "/",
      providesTags: ["TruckPricingType"],
    }),
    getTruckPricingTypeById: builder.query<TruckPricingType, string>({
      query: (id) => `/${id}`,
      providesTags: (_, __, id) => [{ type: "TruckPricingType", id }],
    }),
    createTruckPricingType: builder.mutation<
      TruckPricingType,
      Partial<TruckPricingType>
    >({
      query: (body) => ({
        url: "/",
        method: "POST",
        body,
      }),
      invalidatesTags: ["TruckPricingType"],
    }),
    updateTruckPricingType: builder.mutation<
      TruckPricingType,
      { id: string; updates: Partial<TruckPricingType> }
    >({
      query: ({ id, updates }) => ({
        url: `/${id}`,
        method: "PUT",
        body: updates,
      }),
      invalidatesTags: (_, __, { id }) => [
        "TruckPricingType",
        { type: "TruckPricingType", id },
      ],
    }),
    deleteTruckPricingType: builder.mutation<void, string>({
      query: (id) => ({
        url: `/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_, __, id) => [
        "TruckPricingType",
        { type: "TruckPricingType", id },
      ],
    }),
  }),
});

export const {
  useGetTruckPricingTypesQuery,
  useGetTruckPricingTypeByIdQuery,
  useCreateTruckPricingTypeMutation,
  useUpdateTruckPricingTypeMutation,
  useDeleteTruckPricingTypeMutation,
} = truckPricingTypesApi;
