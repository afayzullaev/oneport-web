// src/api/loadPackagesApi.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "@/constants/config";
import type { LoadPackage } from "@/types/models/cargoOwner/loadPackage";

export const loadPackagesApi = createApi({
  reducerPath: "loadPackagesApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${BASE_URL}/load-packages`,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as any).authToken?.token;
      if (token) headers.set("Authorization", `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: ["LoadPackage"],
  endpoints: (builder) => ({
    getLoadPackages: builder.query<LoadPackage[], void>({
      query: () => "/",
      providesTags: ["LoadPackage"],
    }),
    getLoadPackageById: builder.query<LoadPackage, string>({
      query: (id) => `/${id}`,
      providesTags: (_, __, id) => [{ type: "LoadPackage", id }],
    }),
    createLoadPackage: builder.mutation<LoadPackage, Partial<LoadPackage>>({
      query: (body) => ({
        url: "/",
        method: "POST",
        body,
      }),
      invalidatesTags: ["LoadPackage"],
    }),
    updateLoadPackage: builder.mutation<
      LoadPackage,
      { id: string; updates: Partial<LoadPackage> }
    >({
      query: ({ id, updates }) => ({
        url: `/${id}`,
        method: "PUT",
        body: updates,
      }),
      invalidatesTags: (_, __, { id }) => [
        "LoadPackage",
        { type: "LoadPackage", id },
      ],
    }),
    deleteLoadPackage: builder.mutation<void, string>({
      query: (id) => ({
        url: `/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_, __, id) => [
        "LoadPackage",
        { type: "LoadPackage", id },
      ],
    }),
  }),
});

export const {
  useGetLoadPackagesQuery,
  useGetLoadPackageByIdQuery,
  useCreateLoadPackageMutation,
  useUpdateLoadPackageMutation,
  useDeleteLoadPackageMutation,
} = loadPackagesApi;
