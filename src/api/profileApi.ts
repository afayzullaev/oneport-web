// src/api/profilesApi.ts
import { BASE_URL } from "@/constants/config";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface Profile {
  _id: string;
  userId: string;
  type: "individual" | "legal_entity";
  businessType: "carrier" | "cargo_owner";
  fullName?: string;
  companyName?: string;
  companyTIN?: string;
  activityType?: string;
  goods?: string[];
  unit?: 'млн шт' | 'тонна' | 'шт' | 'млн долл. США' | 'кг' | 'м³' | 'литр' | 'метр' | 'м²';
  annualProductionCapacity?: number;
  representativeFullname?: string;
  phoneNumbers: string[];
  emails?: string[];
  country: string;
  postalCode: string;
  address: string;
  isVerified?: boolean;
  rating?: number;
}

export const profilesApi = createApi({
  reducerPath: "profilesApi",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as any).authToken?.token;
      if (token) headers.set("Authorization", `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: ["Profile"],
  endpoints: (builder) => ({
    getMyProfile: builder.query<Profile, void>({
      query: () => "profiles/me",
      providesTags: ["Profile"],
    }),
    createProfile: builder.mutation<Profile, Partial<Profile>>({
      query: (body) => ({
        url: "profiles",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Profile"],
    }),
    updateProfile: builder.mutation<
      Profile,
      { profileId: string; updates: Partial<Profile> }
    >({
      query: ({ profileId, updates }) => ({
        url: `profiles/${profileId}`,
        method: "PUT",
        body: updates,
      }),
      invalidatesTags: ["Profile"],
    }),
    getProfileByUserId: builder.query<Profile, string>({
      query: (userId) => `profiles/${userId}`,
      providesTags: (_, __, userId) => [{ type: "Profile", id: userId }],
    }),
    searchExporters: builder.query<Profile[], {
      country?: string;
      companyName?: string;
      limit?: number;
      offset?: number;
    }>({
      query: (params) => ({
        url: 'profiles/search',
        method: 'GET',
        params: {
          ...params,
          businessType: 'cargo_owner',
          type: 'legal_entity'
        }
      }),
      providesTags: ['Profile'],
    }),
  }),
});

export const {
  useGetMyProfileQuery,
  useCreateProfileMutation,
  useUpdateProfileMutation,
  useGetProfileByUserIdQuery,
  useSearchExportersQuery,
} = profilesApi;
