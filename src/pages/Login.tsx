// src/pages/Login.tsx
import { useState, useRef, useEffect } from "react";
import { useSendOtpMutation, useVerifyOtpMutation } from "../api/authApi";
import { useAppDispatch } from "../hooks/useAppDispatch";
import { setToken } from "../store/store";
import { useNavigate } from "react-router-dom";
import { Truck, Shield } from "lucide-react";

export default function Login() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [otpDigits, setOtpDigits] = useState(["", "", "", ""]);
  const otpRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  const [sendOtp, { isLoading: sendingOtp, error: sendError }] =
    useSendOtpMutation();
  const [verifyOtp, { isLoading: verifyingOtp, error: verifyError }] =
    useVerifyOtpMutation();

  // Format phone number as XX XXX-XX-XX
  const formatPhoneNumber = (value: string) => {
    // Remove all non-digit characters
    const digits = value.replace(/\D/g, "");
    
    // Limit to 9 digits (without +998)
    const limitedDigits = digits.substring(0, 9);
    
    // Format as XX XXX-XX-XX
    if (limitedDigits.length <= 2) {
      return limitedDigits;
    } else if (limitedDigits.length <= 5) {
      return `${limitedDigits.substring(0, 2)} ${limitedDigits.substring(2)}`;
    } else if (limitedDigits.length <= 7) {
      return `${limitedDigits.substring(0, 2)} ${limitedDigits.substring(2, 5)}-${limitedDigits.substring(5)}`;
    } else {
      return `${limitedDigits.substring(0, 2)} ${limitedDigits.substring(2, 5)}-${limitedDigits.substring(5, 7)}-${limitedDigits.substring(7)}`;
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setPhone(formatted);
  };

  const handleSendOtp = async () => {
    const fullPhone = `+998${phone.replace(/\D/g, "")}`; // Add +998 prefix and remove non-digits
    const result = await sendOtp({ phone: fullPhone });
    if ("data" in result) setStep("otp");
  };

  const handleVerifyOtp = async () => {
    const fullPhone = `+998${phone.replace(/\D/g, "")}`; // Add +998 prefix and remove non-digits
    const result = await verifyOtp({ phone: fullPhone, otp });
    if ("data" in result) {
      dispatch(setToken(result.data?.token || ""));
      navigate("/");
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return; // Only allow single digit

    const newOtpDigits = [...otpDigits];
    newOtpDigits[index] = value;
    setOtpDigits(newOtpDigits);
    setOtp(newOtpDigits.join(""));

    // Auto-focus next input
    if (value && index < 3) {
      otpRefs[index + 1].current?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otpDigits[index] && index > 0) {
      otpRefs[index - 1].current?.focus();
    }
  };

  // Auto-focus first OTP input when step changes
  useEffect(() => {
    if (step === "otp") {
      setTimeout(() => otpRefs[0].current?.focus(), 100);
    }
  }, [step]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full">
        {/* Logo and Header */}
        <div className="flex items-center mb-8 gap-2 justify-center">
          <p className="text-black text-2xl font-bold">
            Добро пожаловать в 1Port
          </p>
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600">
            <Truck
size={22}
className="text-white"
strokeWidth={2.5} />
          </span>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="px-8 py-6">
            {step === "phone" ? (
              <>
                {/* Phone Step */}
                <div className="text-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">
                    Вход в систему
                  </h2>
                  <p className="text-gray-600 text-sm">
                    Введите номер телефона для получения кода подтверждения
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Номер телефона
                    </label>
                    <input
                      type="tel"
                      placeholder="90 123-45-67"
                      value={phone}
                      onChange={handlePhoneChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                      disabled={sendingOtp}
                    />
                  </div>

                  <button
                    onClick={handleSendOtp}
                    disabled={sendingOtp || !phone.trim()}
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
                  >
                    {sendingOtp ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        Отправка...
                      </>
                    ) : (
                      "Получить код"
                    )}
                  </button>

                  {sendError && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                      <p className="text-red-600 text-sm text-center">
                        Ошибка при отправке кода. Попробуйте еще раз.
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
                      <Shield
size={24}
className="text-green-600" />
                    </div>
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">
                    Подтверждение
                  </h2>
                  <p className="text-gray-600 text-sm">
                    Код отправлен на номер
                    <br />
                    <span className="font-medium text-gray-900">+998 {phone}</span>
                  </p>
                </div>

                <div className="space-y-6">
                  {/* OTP Input Grid */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3 text-center">
                      Введите 4-значный код
                    </label>
                    <div className="flex justify-center gap-3 mb-4">
                      {otpDigits.map((digit, index) => (
                        <input
                          key={index}
                          ref={otpRefs[index]}
                          type="text"
                          inputMode="numeric"
                          maxLength={1}
                          value={digit}
                          onChange={(e) =>
                            handleOtpChange(
                              index,
                              e.target.value.replace(/\D/g, "")
                            )
                          }
                          onKeyDown={(e) => handleOtpKeyDown(index, e)}
                          className="w-14 h-14 text-center text-2xl font-bold border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          disabled={verifyingOtp}
                        />
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={handleVerifyOtp}
                    disabled={verifyingOtp || otp.length !== 4}
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
                  >
                    {verifyingOtp ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        Проверка...
                      </>
                    ) : (
                      "Подтвердить код"
                    )}
                  </button>

                  {verifyError && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                      <p className="text-red-600 text-sm text-center">
                        Неверный код. Проверьте и попробуйте еще раз.
                      </p>
                    </div>
                  )}

                  {/* Back to phone */}
                  <button
                    onClick={() => {
                      setStep("phone");
                      setOtpDigits(["", "", "", ""]);
                      setOtp("");
                    }}
                    className="w-full text-blue-600 hover:text-blue-700 font-medium py-2 transition-colors duration-200"
                  >
                    ← Изменить номер телефона
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-gray-500 text-sm">
            Продолжая, вы соглашаетесь с условиями использования
          </p>
        </div>
      </div>
    </div>
  );
}
