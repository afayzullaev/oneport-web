// src/pages/Login.tsx
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import type { SerializedError } from "@reduxjs/toolkit";
import { Truck, Shield } from "lucide-react";
import {
  useResendEmailOtpMutation,
  useSendEmailOtpMutation,
  useVerifyEmailOtpMutation,
} from "@/api/authApi";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { setToken } from "@/store/store";

type AuthStep = "email" | "code";

const isValidEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());

const isFetchError = (error: unknown): error is FetchBaseQueryError =>
  typeof error === "object" && error !== null && "status" in error;

const isSerializedError = (error: unknown): error is SerializedError =>
  typeof error === "object" && error !== null && "message" in error;

const getErrorMessage = (
  error: FetchBaseQueryError | SerializedError | undefined,
  fallback = "Произошла ошибка. Попробуйте еще раз."
) => {
  if (!error) return null;

  if (isFetchError(error)) {
    const data = error.data as { message?: string; error?: string } | undefined;
    if (data?.message) return data.message;
    if (data?.error) return data.error;
    if ("error" in error && typeof error.error === "string") {
      return error.error;
    }
  } else if (isSerializedError(error)) {
    return error.message ?? fallback;
  }

  return fallback;
};

const getRetryAfterSeconds = (error: FetchBaseQueryError | SerializedError | undefined) => {
  if (!isFetchError(error)) return null;
  const data = error.data as { retryAfter?: number | string } | undefined;
  const retryAfter = data?.retryAfter;
  if (typeof retryAfter === "number") return retryAfter;
  if (typeof retryAfter === "string") {
    const parsed = parseInt(retryAfter, 10);
    return Number.isNaN(parsed) ? null : parsed;
  }
  return null;
};

export default function Login() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [email, setEmail] = useState("");
  const [step, setStep] = useState<AuthStep>("email");
  const [codeDigits, setCodeDigits] = useState(["", "", "", "", "", ""]);
  const [countdown, setCountdown] = useState(0);
  const [validationMessage, setValidationMessage] = useState<string | null>(null);

  const otpRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  const [sendEmailOtp, { isLoading: sendingOtp, error: sendError }] = useSendEmailOtpMutation();
  const [resendEmailOtp, { isLoading: resendingOtp, error: resendError }] =
    useResendEmailOtpMutation();
  const [verifyEmailOtp, { isLoading: verifyingOtp, error: verifyError }] = useVerifyEmailOtpMutation();

  const normalizedEmail = email.trim().toLowerCase();
  const codeValue = codeDigits.join("");
  const isCodeComplete = codeValue.length === 6;

  const resetCodeInput = () => {
    setCodeDigits(["", "", "", "", "", ""]);
    otpRefs[0].current?.focus();
  };

  const handleSendOtp = async () => {
    if (!isValidEmail(email)) {
      setValidationMessage("Введите корректный email адрес");
      return;
    }

    setValidationMessage(null);
    const result = await sendEmailOtp({ email: normalizedEmail });
    const data = "data" in result ? result.data : undefined;
    if (data?.success) {
      setStep("code");
      setCountdown(60);
      resetCodeInput();
      return;
    }

    if ("error" in result) {
      const retryAfter = getRetryAfterSeconds(result.error);
      if (retryAfter) setCountdown(retryAfter);
    }
  };

  const handleResendOtp = async () => {
    if (countdown > 0 || resendingOtp) return;
    const result = await resendEmailOtp({ email: normalizedEmail });
    const data = "data" in result ? result.data : undefined;
    if (data?.success) {
      setCountdown(60);
      resetCodeInput();
      return;
    }

    if ("error" in result) {
      const retryAfter = getRetryAfterSeconds(result.error);
      if (retryAfter) setCountdown(retryAfter);
    }
  };

  const handleVerifyOtp = async () => {
    if (!isCodeComplete || verifyingOtp) return;
    const result = await verifyEmailOtp({ email: normalizedEmail, code: codeValue });
    const data = "data" in result ? result.data : undefined;
    if (data?.success) {
      dispatch(setToken(data.token || ""));
      navigate("/");
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    const digit = value.replace(/\D/g, "").slice(-1);
    const updatedDigits = [...codeDigits];
    updatedDigits[index] = digit;
    setCodeDigits(updatedDigits);

    if (digit && index < otpRefs.length - 1) {
      otpRefs[index + 1].current?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !codeDigits[index] && index > 0) {
      otpRefs[index - 1].current?.focus();
    }
  };

  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setTimeout(() => setCountdown((prev) => (prev > 0 ? prev - 1 : 0)), 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  useEffect(() => {
    if (step !== "code") return;
    const timer = setTimeout(() => otpRefs[0].current?.focus(), 100);
    return () => clearTimeout(timer);
  }, [step]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full">
        {/* Logo and Header */}
        <div className="flex items-center mb-8 gap-2 justify-center">
          <p className="text-black text-2xl font-bold">Добро пожаловать в 1Port</p>
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600">
            <Truck size={22} className="text-white" strokeWidth={2.5} />
          </span>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="px-8 py-6">
            {step === "email" ? (
              <>
                {/* Email Step */}
                <div className="text-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">Вход в систему</h2>
                  <p className="text-gray-600 text-sm">
                    Введите корпоративный email, чтобы получить код подтверждения
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      placeholder="you@company.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
                      disabled={sendingOtp}
                    />
                    {validationMessage && (
                      <p className="text-sm text-red-600 mt-1">{validationMessage}</p>
                    )}
                  </div>

                  <button
                    onClick={handleSendOtp}
                    disabled={sendingOtp || !email.trim() || countdown > 0}
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
                  >
                    {sendingOtp ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                        Отправка...
                      </>
                    ) : (
                      "Получить код"
                    )}
                  </button>

                  {countdown > 0 && (
                    <p className="text-sm text-gray-600 text-center">
                      Можно запросить повторно через {countdown} с
                    </p>
                  )}

                  {sendError && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                      <p className="text-red-600 text-sm text-center">
                        {getErrorMessage(sendError)}
                      </p>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                {/* OTP Step */}
                <div className="text-center mb-6">
                  <div className="flex justify-center mb-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100">
                      <Shield size={24} className="text-green-600" />
                    </div>
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">Подтверждение</h2>
                  <p className="text-gray-600 text-sm">
                    Код отправлен на адрес
                    <br />
                    <span className="font-medium text-gray-900">{normalizedEmail}</span>
                  </p>
                </div>

                <div className="space-y-6">
                  {/* OTP Input Grid */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3 text-center">
                      Введите 6-значный код
                    </label>
                    <div className="flex justify-center gap-3 mb-4">
                      {codeDigits.map((digit, index) => (
                        <input
                          key={index}
                          ref={otpRefs[index]}
                          type="text"
                          inputMode="numeric"
                          maxLength={1}
                          value={digit}
                          onChange={(e) => handleOtpChange(index, e.target.value)}
                          onKeyDown={(e) => handleOtpKeyDown(index, e)}
                          className="w-12 h-12 text-center text-2xl font-bold border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          disabled={verifyingOtp}
                        />
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={handleVerifyOtp}
                    disabled={verifyingOtp || !isCodeComplete}
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
                  >
                    {verifyingOtp ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                        Проверка...
                      </>
                    ) : (
                      "Подтвердить код"
                    )}
                  </button>

                  {verifyError && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                      <p className="text-red-600 text-sm text-center">
                        {getErrorMessage(
                          verifyError,
                          "Код неверный или устарел. Запросите новый."
                        )}
                      </p>
                    </div>
                  )}

                  <div className="text-center text-sm text-gray-600">
                    Не получили письмо?{" "}
                    <button
                      type="button"
                      onClick={handleResendOtp}
                      disabled={countdown > 0 || resendingOtp}
                      className="text-blue-600 font-medium disabled:text-gray-400"
                    >
                      {resendingOtp
                        ? "Повторная отправка..."
                        : countdown > 0
                        ? `Отправить повторно через ${countdown} c`
                        : "Отправить еще раз"}
                    </button>
                  </div>

                  {resendError && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                      <p className="text-red-600 text-sm text-center">
                        {getErrorMessage(resendError)}
                      </p>
                    </div>
                  )}

                  {/* Back to email */}
                  <button
                    onClick={() => {
                      setStep("email");
                      setCodeDigits(["", "", "", "", "", ""]);
                      setCountdown(0);
                      setValidationMessage(null);
                    }}
                    className="w-full text-blue-600 hover:text-blue-700 font-medium py-2 transition-colors duration-200"
                  >
                    ← Изменить email
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-gray-500 text-sm">
            Продолжая, вы соглашаетесь с условиями использования платформы 1Port
          </p>
        </div>
      </div>
    </div>
  );
}
