// src/api/authApi.ts
import { BASE_URL } from "@/constants/config";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

interface EmailOtpRequest {
  email: string;
}

interface EmailOtpVerifyRequest extends EmailOtpRequest {
  code: string;
}

interface EmailOtpResponse {
  success: boolean;
  message: string;
  expiresIn?: number;
  retryAfter?: number;
}

interface VerifyEmailOtpResponse {
  success: boolean;
  message: string;
  token: string;
  user: { _id: string; email: string };
}

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    prepareHeaders: (headers) => {
      headers.set("Content-Type", "application/json");
      return headers;
    },
  }),
  endpoints: (builder) => ({
    sendEmailOtp: builder.mutation<EmailOtpResponse, EmailOtpRequest>({
      query: (body) => ({
        url: "auth/otp/send",
        method: "POST",
        body,
      }),
    }),
    resendEmailOtp: builder.mutation<EmailOtpResponse, EmailOtpRequest>({
      query: (body) => ({
        url: "auth/otp/resend",
        method: "POST",
        body,
      }),
    }),
    verifyEmailOtp: builder.mutation<
      VerifyEmailOtpResponse,
      EmailOtpVerifyRequest
    >({
      query: (body) => ({
        url: "auth/otp/verify",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const {
  useSendEmailOtpMutation,
  useResendEmailOtpMutation,
  useVerifyEmailOtpMutation,
} = authApi;
