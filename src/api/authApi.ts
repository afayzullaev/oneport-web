// src/api/authApi.ts
import { BASE_URL } from "@/constants/config";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
  endpoints: (builder) => ({
    sendOtp: builder.mutation<
      { message: string },
      { phone: string; language?: string }
    >({
      query: (body) => ({
        url: "auth/send-otp",
        method: "POST",
        body,
      }),
    }),
    verifyOtp: builder.mutation<
      { token: string; user: { _id: string; phone: string } },
      { phone: string; otp: string }
    >({
      query: (body) => ({
        url: "auth/verify-otp",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const { useSendOtpMutation, useVerifyOtpMutation } = authApi;
