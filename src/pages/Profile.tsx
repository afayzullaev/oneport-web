import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGetMyProfileQuery } from "@/api/profileApi";
import { useAppSelector } from "@/hooks/useAppSelector";
import { clearProfile } from "@/store/profileSlice";
import { useAppDispatch } from "@/hooks/useAppDispatch";

const Profile: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<
    "overview" | "settings" | "security"
  >("overview");

  // Get user token to check if logged in
  const token = useAppSelector((state) => state.authToken.token);

  // Fetch user profile
  const {
    data: profile,
    isLoading,
    error,
    refetch,
  } = useGetMyProfileQuery(undefined, {
    skip: !token,
  });
  if (!profile) {
    dispatch(clearProfile());
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 text-center">
          <div className="text-gray-400 text-6xl mb-4">🔒</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Профиль не найден
          </h2>
          <p className="text-gray-600">
            Возможно, ваш профиль был удален. Пожалуйста, создайте новый
            профиль.
          </p>
        </div>
      </div>
    );
  }

  if (!token) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 text-center">
          <div className="text-gray-400 text-6xl mb-4">🔒</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Вход требуется
          </h2>
          <p className="text-gray-600">
            Войдите в систему для просмотра профиля
          </p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
              <div className="h-32 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg mb-6"></div>
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-24 h-24 bg-gray-200 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-6 bg-gray-200 rounded w-1/3 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-16 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-sm border border-red-200 text-center">
          <div className="text-red-400 text-6xl mb-4">❌</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Ошибка загрузки
          </h2>
          <p className="text-gray-600 mb-4">Не удалось загрузить профиль</p>
          <button
            onClick={() => refetch()}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Попробовать снова
          </button>
        </div>
      </div>
    );
  }

  const getBadgeColor = (type: string) => {
    switch (type) {
      case "carrier":
        return "bg-green-100 text-green-800";
      case "cargo_owner":
        return "bg-blue-100 text-blue-800";
      case "verified":
        return "bg-emerald-100 text-emerald-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getBusinessTypeIcon = (type: string) => {
    return type === "carrier" ? "🚛" : "📦";
  };

  const getRatingStars = (rating?: number) => {
    if (!rating) return "⭐ Нет рейтинга";
    const stars = "⭐".repeat(Math.floor(rating));
    return `${stars} ${rating.toFixed(1)}`;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-6">
          {/* Cover/Banner */}
          <div className="h-32 bg-gradient-to-r from-blue-500 to-blue-600 relative">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="absolute top-4 right-4">
              <button
                onClick={() => navigate("/profile/edit")}
                className="px-3 py-1.5 bg-white/90 text-blue-600 text-sm font-medium rounded-md hover:bg-white transition-colors backdrop-blur-sm"
              >
                ✏️ Редактировать
              </button>
            </div>
          </div>

          {/* Profile Header */}
          <div className="p-6 -mt-8 relative">
            <div className="flex items-start space-x-4">
              {/* Avatar */}
              <div className="w-24 h-24 bg-white rounded-full shadow-lg border-4 border-white flex items-center justify-center text-3xl">
                {getBusinessTypeIcon(profile?.businessType || "cargo_owner")}
              </div>

              {/* Info */}
              <div className="flex-1 pt-4">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-2xl font-bold text-gray-900">
                    {profile?.companyName ||
                      profile?.fullName ||
                      "Пользователь"}
                  </h1>
                  <div className="flex gap-2">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${getBadgeColor(
                        profile?.businessType || ""
                      )}`}
                    >
                      {profile?.businessType === "carrier"
                        ? "Перевозчик"
                        : "Грузовладелец"}
                    </span>
                    {profile?.isVerified && (
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${getBadgeColor(
                          "verified"
                        )}`}
                      >
                        ✓ Верифицирован
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span>
                    🏢{" "}
                    {profile?.type === "legal_entity"
                      ? "Юридическое лицо"
                      : "Физическое лицо"}
                  </span>
                  <span>📍 {profile?.country}</span>
                  <span>{getRatingStars(profile?.rating)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: "overview", label: "📊 Обзор", icon: "📊" },
                { id: "settings", label: "⚙️ Настройки", icon: "⚙️" },
                { id: "security", label: "🔒 Безопасность", icon: "🔒" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Stats Cards */}
            <div className="lg:col-span-2 space-y-6">
              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 text-center">
                  <div className="text-2xl font-bold text-blue-600">0</div>
                  <div className="text-sm text-gray-600">Активных заказов</div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 text-center">
                  <div className="text-2xl font-bold text-green-600">0</div>
                  <div className="text-sm text-gray-600">Завершенных</div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {profile?.rating?.toFixed(1) || "0.0"}
                  </div>
                  <div className="text-sm text-gray-600">Рейтинг</div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 text-center">
                  <div className="text-2xl font-bold text-orange-600">0</div>
                  <div className="text-sm text-gray-600">Отзывов</div>
                </div>
              </div>

              {/* Activity Timeline */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  📈 Последняя активность
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 text-sm text-gray-500">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>Профиль создан</span>
                    <span className="text-gray-400">•</span>
                    <span>Сегодня</span>
                  </div>
                  <div className="text-center py-8 text-gray-400">
                    Пока что активности нет
                  </div>
                </div>
              </div>
            </div>

            {/* Contact & Location */}
            <div className="space-y-6">
              {/* Contact Info */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  📞 Контакты
                </h3>
                <div className="space-y-3">
                  {profile?.phoneNumbers.map((phone: string, index: number) => (
                    <div key={index} className="flex items-center space-x-2">
                      <span className="text-gray-400">📱</span>
                      <span className="text-sm">{phone}</span>
                    </div>
                  ))}
                  {profile?.emails?.map((email: string, index: number) => (
                    <div key={index} className="flex items-center space-x-2">
                      <span className="text-gray-400">📧</span>
                      <span className="text-sm">{email}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Location */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  📍 Местоположение
                </h3>
                <div className="space-y-2 text-sm">
                  <div>
                    <strong>Страна:</strong> {profile?.country}
                  </div>
                  <div>
                    <strong>Почтовый код:</strong> {profile?.postalCode}
                  </div>
                  <div>
                    <strong>Адрес:</strong> {profile?.address}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "settings" && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              ⚙️ Настройки профиля
            </h2>

            <div className="text-center py-12 text-gray-500">
              <div className="text-4xl mb-4">⚙️</div>
              <p className="mb-4">
                Для изменения настроек профиля перейдите на страницу
                редактирования
              </p>
              <button
                onClick={() => navigate("/profile/edit")}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Редактировать профиль
              </button>
            </div>
          </div>
        )}

        {activeTab === "security" && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              🔒 Безопасность
            </h2>

            <div className="space-y-6">
              {/* Account Status */}
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900">
                      Статус верификации
                    </h3>
                    <p className="text-sm text-gray-600">
                      Ваш аккаунт{" "}
                      {profile?.isVerified
                        ? "верифицирован"
                        : "не верифицирован"}
                    </p>
                  </div>
                  <div
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      profile?.isVerified
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {profile?.isVerified ? "✓ Верифицирован" : "⏳ В процессе"}
                  </div>
                </div>
              </div>

              {/* Change Password */}
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-medium text-gray-900 mb-2">
                  Изменить пароль
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Регулярно обновляйте пароль для безопасности
                </p>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                  Изменить пароль
                </button>
              </div>

              {/* Two-Factor Authentication */}
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900">
                      Двухфакторная аутентификация
                    </h3>
                    <p className="text-sm text-gray-600">
                      Дополнительная защита для вашего аккаунта
                    </p>
                  </div>
                  <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors">
                    Настроить
                  </button>
                </div>
              </div>

              {/* Session Management */}
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-medium text-gray-900 mb-2">
                  Управление сессиями
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Просмотр и управление активными сессиями
                </p>
                <div className="text-sm text-gray-600">
                  <div className="flex justify-between items-center py-2 border-b">
                    <span>Текущая сессия • Веб</span>
                    <span className="text-green-600">Активна</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
