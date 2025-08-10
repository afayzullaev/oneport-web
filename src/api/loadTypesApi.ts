// src/api/loadTypesApi.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "@/constants/config";
import type { LoadType } from "@/types/models/cargoOwner/loadType";

export const loadTypesApi = createApi({
  reducerPath: "loadTypesApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${BASE_URL}/load-types`,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as any).authToken?.token;
      if (token) headers.set("Authorization", `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: ["LoadType"],
  endpoints: (builder) => ({
    getLoadTypes: builder.query<LoadType[], void>({
      query: () => "/",
      providesTags: ["LoadType"],
    }),
    getLoadTypeById: builder.query<LoadType, string>({
      query: (id) => `/${id}`,
      providesTags: (_, __, id) => [{ type: "LoadType", id }],
    }),
    createLoadType: builder.mutation<LoadType, Partial<LoadType>>({
      query: (body) => ({
        url: "/",
        method: "POST",
        body,
      }),
      invalidatesTags: ["LoadType"],
    }),
    updateLoadType: builder.mutation<
      LoadType,
      { id: string; updates: Partial<LoadType> }
    >({
      query: ({ id, updates }) => ({
        url: `/${id}`,
        method: "PUT",
        body: updates,
      }),
      invalidatesTags: (_, __, { id }) => [
        "LoadType",
        { type: "LoadType", id },
      ],
    }),
    deleteLoadType: builder.mutation<void, string>({
      query: (id) => ({
        url: `/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_, __, id) => [
        "LoadType",
        { type: "LoadType", id },
      ],
    }),
  }),
});

export const {
  useGetLoadTypesQuery,
  useGetLoadTypeByIdQuery,
  useCreateLoadTypeMutation,
  useUpdateLoadTypeMutation,
  useDeleteLoadTypeMutation,
} = loadTypesApi;
