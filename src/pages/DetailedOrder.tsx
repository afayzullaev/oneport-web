import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useGetOrderByIdQuery } from "@/api/ordersApi";
import { useLocalization } from "@/hooks/useLocalization";
import type { LoadType } from "@/types/models/cargoOwner/loadType";
import type { LoadPackage } from "@/types/models/cargoOwner/loadPackage";
import type { Profile } from "@/types/models/profile";

const DetailedOrder: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const { getLocalizedText, formatWeight } = useLocalization();

  const { data: order, isLoading, error } = useGetOrderByIdQuery(orderId || "");
  console.log("Order data:", order);
  const profile: Profile = order?.profile as Profile;
  const loadType: LoadType = order?.loadType as LoadType;
  const loadPackage: LoadPackage = order?.loadPackage as LoadPackage;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="bg-white rounded-lg p-6 space-y-4">
              <div className="h-6 bg-gray-200 rounded w-1/2"></div>
              <div className="space-y-2">
                {[...Array(8)].map((_, i) => (
                  <div
                    key={i}
                    className="h-4 bg-gray-200 rounded"
                  ></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <div className="text-gray-400 text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Заказ не найден</h2>
            <p className="text-gray-600 mb-6">
              Заказ с указанным ID не существует или был удален
            </p>
            <button
              onClick={() => navigate("/orders")}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Вернуться к списку заказов
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Вспомогательные функции
  const getLoadTypeName = () => {
    if (typeof order.loadType === "object" && order.loadType?.name) {
      return getLocalizedText(order.loadType.name);
    }
    if (loadType?.name) {
      return getLocalizedText(loadType.name);
    }
    return typeof order.loadType === "string" ? order.loadType : "Не указан";
  };

  const getLoadPackageName = () => {
    if (typeof order.loadPackage === "object" && order.loadPackage?.name) {
      return getLocalizedText(order.loadPackage.name);
    }
    if (loadPackage?.name) {
      return getLocalizedText(loadPackage.name);
    }
    return typeof order.loadPackage === "string" ? order.loadPackage : "Стандартная";
  };

  const formatDimensions = () => {
    if (!order.dimensions || typeof order.dimensions !== "object") return "Не указаны";
    const { length, width, height } = order.dimensions;
    if (!length || !width || !height) return "Не указаны";
    return `${length} × ${width} × ${height} м`;
  };

  const getStatusInfo = () => {
    if (!order.loadStatus?.state)
      return { text: "Не указан", color: "gray", details: "" };

    let details = "";
    if (order.loadStatus.interval) {
      const intervalMap = {
        every_day: "каждый день",
        in_working_days: "в рабочие дни",
        every_month: "каждый месяц",
        twice_a_week: "два раза в неделю",
        every_week: "каждую неделю",
      };
      details = intervalMap[order.loadStatus.interval] || order.loadStatus.interval;
    }

    switch (order.loadStatus.state) {
      case "ready_from":
        const readyFromDate = order.loadStatus.readyFrom
          ? new Date(order.loadStatus.readyFrom).toLocaleDateString()
          : "";
        return {
          text: `Готов с ${readyFromDate}`,
          color: "green",
          details: details ? `Периодичность: ${details}` : "",
        };
      case "always":
        return {
          text: "Всегда готов",
          color: "green",
          details: details ? `Периодичность: ${details}` : "",
        };
      case "not_ready":
        return { text: "Не готов", color: "red", details: "" };
      default:
        return { text: order.loadStatus.state, color: "yellow", details: "" };
    }
  };

  const getPriceInfo = () => {
    if (!order.pricing) return { amount: "Не указана", type: "", vat: "" };

    const pricingTypeText = order.pricing.pricingType
      ? typeof order.pricing.pricingType === "string"
        ? order.pricing.pricingType
        : typeof order.pricing.pricingType === "object" && order.pricing.pricingType.name
        ? getLocalizedText(order.pricing.pricingType.name)
        : order.pricing.pricingType._id || "Pricing Type"
      : "сум";

    if (order.pricing.withVat) {
      return {
        amount: order.pricing.withVat.toLocaleString(),
        type: pricingTypeText,
        vat: "С НДС",
      };
    }
    if (order.pricing.withoutVat) {
      return {
        amount: order.pricing.withoutVat.toLocaleString(),
        type: pricingTypeText,
        vat: "Без НДС",
      };
    }
    return { amount: "Договорная", type: "", vat: "" };
  };

  const statusInfo = getStatusInfo();
  const priceInfo = getPriceInfo();

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Заголовок и навигация */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate("/orders")}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {order.loadName || "Заказ без названия"}
              </h1>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Основная информация */}
          <div className="lg:col-span-2 space-y-6">
            {/* Детали груза */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <span className="mr-2">📦</span>
                Детали груза
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Вес</label>
                    <p className="text-lg font-medium text-gray-900">
                      {formatWeight(order.weight, order.weightUnit)}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Размеры</label>
                    <p className="text-lg font-medium text-gray-900">
                      {formatDimensions()}
                    </p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Тип груза</label>
                    <p className="text-lg font-medium text-gray-900">
                      {getLoadTypeName()}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Упаковка</label>
                    <p className="text-lg font-medium text-gray-900">
                      {getLoadPackageName()}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Статус готовности груза */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <span className="mr-2">📅</span>
                Статус готовности
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Состояние</label>
                  <div className="mt-1">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                        statusInfo.color === "green"
                          ? "bg-green-100 text-green-800"
                          : statusInfo.color === "red"
                          ? "bg-red-100 text-red-800"
                          : statusInfo.color === "yellow"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {statusInfo.text}
                    </span>
                  </div>
                </div>
                {statusInfo.details && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Дополнительно
                    </label>
                    <p className="text-lg font-medium text-gray-900 mt-1">
                      {statusInfo.details}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Маршрут */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <span className="mr-2">🚛</span>
                Маршрут перевозки
              </h2>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0 w-3 h-3 bg-green-500 rounded-full"></div>
                  <div className="flex-1">
                    <label className="text-sm font-medium text-gray-500">
                      Пункт загрузки
                    </label>
                    <p className="text-lg font-medium text-gray-900">
                      {order.loadAddress?.display_place || "Не указан"}
                    </p>
                    {order.loadAddress?.country && order.loadAddress.country !== "-" && (
                      <p className="text-sm text-gray-500">{order.loadAddress.country}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-4 ml-1">
                  <div className="flex-shrink-0 w-1 h-8 bg-gray-300"></div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0 w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="flex-1">
                    <label className="text-sm font-medium text-gray-500">
                      Пункт выгрузки
                    </label>
                    <p className="text-lg font-medium text-gray-900">
                      {order.unloadAddress?.display_place || "Не указан"}
                    </p>
                    {order.unloadAddress?.country &&
                      order.unloadAddress.country !== "-" && (
                        <p className="text-sm text-gray-500">
                          {order.unloadAddress.country}
                        </p>
                      )}
                  </div>
                </div>
              </div>
            </div>

            {/* Дополнительные требования */}
            {((order.loadTypes && order.loadTypes.length > 0) ||
              (order.unloadTypes && order.unloadTypes.length > 0)) && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <span className="mr-2">⚙️</span>
                  Требования к транспорту
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {order.loadTypes && order.loadTypes.length > 0 && (
                    <div>
                      <label className="text-sm font-medium text-gray-500 mb-2 block">
                        Для загрузки
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {order.loadTypes.slice(0, 5).map((type, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                          >
                            {typeof type === "object" && type.name
                              ? getLocalizedText(type.name)
                              : String(type)}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {order.unloadTypes && order.unloadTypes.length > 0 && (
                    <div>
                      <label className="text-sm font-medium text-gray-500 mb-2 block">
                        Для выгрузки
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {order.unloadTypes.slice(0, 5).map((type, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"
                          >
                            {typeof type === "object" && type.name
                              ? getLocalizedText(type.name)
                              : String(type)}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Боковая панель */}
          <div className="space-y-6">
            {/* Цена */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <span className="mr-2">💰</span>
                Стоимость
              </h2>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-1">
                  {priceInfo.amount}
                </div>
                {priceInfo.type && (
                  <div className="text-sm font-medium text-gray-700 mb-1">
                    {priceInfo.type}
                  </div>
                )}
                {priceInfo.vat && (
                  <div className="text-xs text-gray-500">{priceInfo.vat}</div>
                )}
              </div>
            </div>

            {/* Информация о грузовладельце */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <span className="mr-2">👤</span>
                Грузовладелец
              </h2>
              <div className="space-y-3">
                {profile?.companyName && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Компания</label>
                    <p className="text-lg font-medium text-gray-900">
                      {profile.companyName}
                    </p>
                  </div>
                )}

                {(profile?.fullName ||
                  (order.owner &&
                    typeof order.owner === "object" &&
                    order.owner.fullName)) && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Контактное лицо
                    </label>
                    <p className="text-lg font-medium text-gray-900">
                      {profile?.fullName ||
                        (order.owner && typeof order.owner === "object"
                          ? order.owner.fullName
                          : "")}
                    </p>
                  </div>
                )}

                {order.owner && typeof order.owner === "object" && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Телефон</label>
                    <p className="text-lg font-medium text-gray-900">
                      {!order.owner.phone
                        ? "Доступна только для Премиум пользователей"
                        : order.owner.phone}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailedOrder;
