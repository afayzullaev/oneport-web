import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useGetTruckByIdQuery } from "@/api/trucksApi";
import { useLocalization } from "@/hooks/useLocalization";
import { Button } from "@/components/ui/button";
import {
  Truck,
  Package,
  MapPin,
  DollarSign,
  Calendar,
  Settings,
  ArrowLeft,
  Phone,
  Mail,
  Building,
  User,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Gauge,
  Ruler,
  Satellite,
  Activity,
} from "lucide-react";
import type { Profile } from "@/types/models/profile";

const DetailedTruck: React.FC = () => {
  const { truckId } = useParams<{ truckId: string }>();
  const navigate = useNavigate();
  const { getLocalizedText, t } = useLocalization();

  const { data: truck, isLoading, error } = useGetTruckByIdQuery(truckId || "");

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="bg-white rounded-xl shadow-lg p-8 space-y-6">
              <div className="h-6 bg-gray-200 rounded w-1/2"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="space-y-3"
                  >
                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                    <div className="h-20 bg-gray-100 rounded-lg"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !truck) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <div className="container mx-auto px-4 py-8">
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <div className="text-gray-400 text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {t.detailedTruck?.notFound || "Грузовик не найден"}
            </h2>
            <p className="text-gray-600 mb-6">
              {t.detailedTruck?.notFoundDesc ||
                "Грузовик с указанным ID не существует или был удален"}
            </p>
            <Button
              onClick={() => navigate("/trucks")}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <ArrowLeft
                size={16}
                className="mr-2"
              />
              {t.detailedTruck?.backToTrucks || "Вернуться к списку грузовиков"}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Helper functions
  const getTruckOptionName = () => {
    if (typeof truck.truckOption === "object" && truck.truckOption?.name) {
      return getLocalizedText(truck.truckOption.name);
    }
    return typeof truck.truckOption === "string"
      ? truck.truckOption
      : t.common?.notSpecified || "Не указан";
  };

  const getTrailerTypeText = () => {
    switch (truck.trailerType) {
      case "truck":
        return t.postTruck?.trailerTypes?.truck || "Грузовик";
      case "trailer":
        return t.postTruck?.trailerTypes?.trailer || "Прицеп";
      case "semi_trailer":
        return t.postTruck?.trailerTypes?.semiTrailer || "Полуприцеп";
      default:
        return truck.trailerType;
    }
  };

  const formatDimensions = (dimensions?: {
    length?: number;
    width?: number;
    height?: number;
  }) => {
    if (!dimensions || typeof dimensions !== "object")
      return t.common?.notSpecified || "Не указаны";
    const { length, width, height } = dimensions;
    if (!length || !width || !height) return t.common?.notSpecified || "Не указаны";
    return `${length} × ${width} × ${height} м`;
  };

  const getReadyTypeInfo = () => {
    if (!truck.readyType?.type)
      return { text: t.common?.notSpecified || "Не указан", color: "gray" };

    switch (truck.readyType.type) {
      case "ready_from":
        return {
          text: `${t.postTruck?.routes?.readyFrom || "Готов с"} ${
            truck.readyType.readyFrom
              ? new Date(truck.readyType.readyFrom).toLocaleDateString()
              : ""
          }`,
          color: "green",
          icon: Calendar,
        };
      case "always":
        return {
          text: t.postTruck?.routes?.alwaysAvailable || "Всегда доступен",
          color: "green",
          icon: CheckCircle2,
        };
      default:
        return { text: truck.readyType.type, color: "yellow", icon: AlertCircle };
    }
  };

  const getPriceInfo = () => {
    if (!truck.pricing)
      return { amount: t.common?.negotiable || "Договорная", type: "", vat: "" };

    const pricingTypeText = truck.pricing.pricingType
      ? typeof truck.pricing.pricingType === "string"
        ? truck.pricing.pricingType
        : typeof truck.pricing.pricingType === "object" && truck.pricing.pricingType.name
        ? getLocalizedText(truck.pricing.pricingType.name)
        : truck.pricing.pricingType._id || "Pricing Type"
      : t.common?.som || "сум";

    if (truck.pricing.withVat) {
      return {
        amount: truck.pricing.withVat.toLocaleString(),
        type: pricingTypeText,
        vat: t.common?.withVat || "С НДС",
      };
    }
    if (truck.pricing.withoutVat) {
      return {
        amount: truck.pricing.withoutVat.toLocaleString(),
        type: pricingTypeText,
        vat: t.common?.withoutVat || "Без НДС",
      };
    }
    return { amount: t.common?.negotiable || "Договорная", type: "", vat: "" };
  };

  const profile = truck.profile as Profile;
  const readyTypeInfo = getReadyTypeInfo();
  const priceInfo = getPriceInfo();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {truck.truckNumber || t.common?.notSpecified || "Номер не указан"}
            </h1>
            <p className="text-gray-600 mt-1">
              {getTrailerTypeText()} • {getTruckOptionName()}
            </p>
          </div>
          <div className="ml-auto">
            <span
              className={`inline-flex items-center px-3 py-1 text-sm font-medium rounded-full ${
                truck.isActive
                  ? "bg-green-100 text-green-800"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              {truck.isActive ? (
                <>
                  <CheckCircle2
                    size={14}
                    className="mr-1"
                  />
                  {t.status?.active || "Активен"}
                </>
              ) : (
                <>
                  <XCircle
                    size={14}
                    className="mr-1"
                  />
                  {t.status?.inactive || "Неактивен"}
                </>
              )}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="xl:col-span-2 space-y-8">
            {/* Basic Info Card */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="flex items-center gap-3 mb-6">
                <Truck
                  className="text-blue-600"
                  size={24}
                />
                <h2 className="text-2xl font-semibold">
                  {t.detailedTruck?.basicInfo || "Основная информация"}
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <div className="flex items-center gap-2 text-blue-700 font-medium mb-2">
                      <Gauge size={16} />
                      {t.postTruck?.truckDetails?.loadCapacity || "Грузоподъемность"}
                    </div>
                    <p className="text-2xl font-bold text-blue-900">
                      {truck.loadCapacity} т
                    </p>
                  </div>

                  <div className="p-4 bg-indigo-50 rounded-lg">
                    <div className="flex items-center gap-2 text-indigo-700 font-medium mb-2">
                      <Package size={16} />
                      {t.postTruck?.truckDetails?.volume || "Объем"}
                    </div>
                    <p className="text-2xl font-bold text-indigo-900">
                      {truck.volume} м³
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="p-4 bg-green-50 rounded-lg">
                    <div className="flex items-center gap-2 text-green-700 font-medium mb-2">
                      <Ruler size={16} />
                      {t.postTruck?.specifications?.truckDimensions || "Размеры кузова"}
                    </div>
                    <p className="text-lg font-semibold text-green-900">
                      {formatDimensions(truck.dimensions)}
                    </p>
                  </div>

                  {(truck.trailerType === "trailer" ||
                    truck.trailerType === "semi_trailer") &&
                    truck.trailer_dimensions && (
                      <div className="p-4 bg-purple-50 rounded-lg">
                        <div className="flex items-center gap-2 text-purple-700 font-medium mb-2">
                          <Ruler size={16} />
                          {t.postTruck?.specifications?.trailerDimensions ||
                            "Размеры прицепа"}
                        </div>
                        <p className="text-lg font-semibold text-purple-900">
                          {formatDimensions(truck.trailer_dimensions)}
                        </p>
                      </div>
                    )}
                </div>
              </div>
            </div>

            {/* Specifications Card */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="flex items-center gap-3 mb-6">
                <Settings
                  className="text-blue-600"
                  size={24}
                />
                <h2 className="text-2xl font-semibold">
                  {t.detailedTruck?.specifications || "Характеристики"}
                </h2>
              </div>

              <div className="space-y-6">
                {/* Load Types */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">
                    {t.postTruck?.truckDetails?.supportedLoadingMethods ||
                      "Поддерживаемые типы загрузки"}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {truck.loadTypes && truck.loadTypes.length > 0 ? (
                      truck.loadTypes.map((type, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-3 py-1 text-sm font-medium bg-blue-100 text-blue-800 rounded-full"
                        >
                          {typeof type === "object" && type.name
                            ? getLocalizedText(type.name)
                            : typeof type === "string"
                            ? type
                            : "Unknown"}
                        </span>
                      ))
                    ) : (
                      <span className="text-gray-500">
                        {t.common?.notSpecified || "Не указаны"}
                      </span>
                    )}
                  </div>
                </div>

                {/* Features */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">
                    {t.postTruck?.specifications?.specialFeatures ||
                      "Дополнительные возможности"}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div
                      className={`p-4 rounded-lg border-2 ${
                        truck.features?.tailgate
                          ? "border-green-200 bg-green-50"
                          : "border-gray-200 bg-gray-50"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {truck.features?.tailgate ? (
                          <CheckCircle2
                            className="text-green-600"
                            size={20}
                          />
                        ) : (
                          <XCircle
                            className="text-gray-400"
                            size={20}
                          />
                        )}
                        <span
                          className={`font-medium ${
                            truck.features?.tailgate ? "text-green-800" : "text-gray-600"
                          }`}
                        >
                          {t.postTruck?.specifications?.tailgate || "Борт"}
                        </span>
                      </div>
                    </div>

                    <div
                      className={`p-4 rounded-lg border-2 ${
                        truck.features?.hydraulicLift
                          ? "border-green-200 bg-green-50"
                          : "border-gray-200 bg-gray-50"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {truck.features?.hydraulicLift ? (
                          <CheckCircle2
                            className="text-green-600"
                            size={20}
                          />
                        ) : (
                          <XCircle
                            className="text-gray-400"
                            size={20}
                          />
                        )}
                        <span
                          className={`font-medium ${
                            truck.features?.hydraulicLift
                              ? "text-green-800"
                              : "text-gray-600"
                          }`}
                        >
                          {t.postTruck?.specifications?.hydraulicLift || "Гидролифт"}
                        </span>
                      </div>
                    </div>

                    <div
                      className={`p-4 rounded-lg border-2 ${
                        truck.features?.cones
                          ? "border-green-200 bg-green-50"
                          : "border-gray-200 bg-gray-50"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {truck.features?.cones ? (
                          <CheckCircle2
                            className="text-green-600"
                            size={20}
                          />
                        ) : (
                          <XCircle
                            className="text-gray-400"
                            size={20}
                          />
                        )}
                        <span
                          className={`font-medium ${
                            truck.features?.cones ? "text-green-800" : "text-gray-600"
                          }`}
                        >
                          {t.postTruck?.specifications?.safetyCones || "Коники"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* GPS Monitoring */}
                <div className="p-6 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3 mb-3">
                    <Satellite
                      className="text-blue-600"
                      size={20}
                    />
                    <h3 className="text-lg font-medium text-gray-900">
                      {t.postTruck?.specifications?.gpsMonitoring || "GPS мониторинг"}
                    </h3>
                  </div>
                  <div className="flex items-center gap-2">
                    {truck.gpsMonitoring?.enabled ? (
                      <>
                        <CheckCircle2
                          className="text-green-600"
                          size={20}
                        />
                        <span className="text-green-800 font-medium">
                          {t.detailedTruck?.gpsEnabled || "GPS мониторинг доступен"}
                        </span>
                        {truck.gpsMonitoring.provider && (
                          <span className="text-gray-600 ml-2">
                            ({truck.gpsMonitoring.provider})
                          </span>
                        )}
                      </>
                    ) : (
                      <>
                        <XCircle
                          className="text-gray-400"
                          size={20}
                        />
                        <span className="text-gray-600">
                          {t.detailedTruck?.gpsNotAvailable ||
                            "GPS мониторинг не доступен"}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Routes & Availability Card */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="flex items-center gap-3 mb-6">
                <MapPin
                  className="text-blue-600"
                  size={24}
                />
                <h2 className="text-2xl font-semibold">
                  {t.detailedTruck?.routesAvailability || "Маршруты и доступность"}
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* From Location */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    {t.detailedTruck?.fromLocation || "Откуда"}
                  </h3>
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-green-800 font-medium">
                      📍{" "}
                      {truck.fromAddress?.display_place ||
                        t.common?.notSpecified ||
                        "Не указано"}
                    </p>
                    {truck.fromAddress?.country && truck.fromAddress.country !== "-" && (
                      <p className="text-green-600 text-sm mt-1">
                        {truck.fromAddress.country}
                      </p>
                    )}
                    {truck.fromRadius && (
                      <p className="text-green-600 text-sm mt-1">
                        {t.detailedTruck?.radius || "Радиус"}: {truck.fromRadius} км
                      </p>
                    )}
                  </div>
                </div>

                {/* To Location */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    {t.detailedTruck?.toLocation || "Куда"}
                  </h3>
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-800 font-medium">
                      📍{" "}
                      {truck.toAddress?.display_place ||
                        t.common?.notSpecified ||
                        "Не указано"}
                    </p>
                    {truck.toAddress?.country && truck.toAddress.country !== "-" && (
                      <p className="text-red-600 text-sm mt-1">
                        {truck.toAddress.country}
                      </p>
                    )}
                    <p className="text-red-600 text-sm mt-1">
                      {t.detailedTruck?.radius || "Радиус"}: {truck.toRadius} км
                    </p>
                  </div>
                </div>
              </div>

              {/* Availability Status */}
              <div className="mt-6 p-6 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-3 mb-3">
                  <Activity
                    className="text-blue-600"
                    size={20}
                  />
                  <h3 className="text-lg font-medium text-blue-900">
                    {t.detailedTruck?.availability || "Доступность"}
                  </h3>
                </div>
                <div className="flex items-center gap-2">
                  {readyTypeInfo.icon && (
                    <readyTypeInfo.icon
                      className={`${
                        readyTypeInfo.color === "green"
                          ? "text-green-600"
                          : readyTypeInfo.color === "yellow"
                          ? "text-yellow-600"
                          : "text-gray-600"
                      }`}
                      size={20}
                    />
                  )}
                  <span
                    className={`font-medium ${
                      readyTypeInfo.color === "green"
                        ? "text-green-800"
                        : readyTypeInfo.color === "yellow"
                        ? "text-yellow-800"
                        : "text-gray-800"
                    }`}
                  >
                    {readyTypeInfo.text}
                  </span>
                </div>
                {truck.readyType?.interval && truck.readyType.type === "ready_from" && (
                  <p className="text-blue-700 text-sm mt-2">
                    {t.detailedTruck?.frequency || "Частота"}:{" "}
                    {t.postTruck?.intervals?.[
                      truck.readyType.interval as keyof typeof t.postTruck.intervals
                    ] || truck.readyType.interval}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Pricing Card */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center gap-3 mb-6">
                <DollarSign
                  className="text-blue-600"
                  size={24}
                />
                <h2 className="text-xl font-semibold">
                  {t.detailedTruck?.pricing || "Стоимость"}
                </h2>
              </div>

              <div className="space-y-4">
                <div className="text-center p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
                  <p className="text-3xl font-bold text-blue-900 mb-1">
                    {priceInfo.amount}
                  </p>
                  <div className="space-y-1">
                    {priceInfo.type && (
                      <p className="text-blue-700 text-sm">{priceInfo.type}</p>
                    )}
                    {priceInfo.vat && (
                      <p className="text-blue-600 text-xs">{priceInfo.vat}</p>
                    )}
                  </div>
                </div>

                {truck.pricing?.cash && truck.pricing.cash > 0 && (
                  <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-green-800 font-medium text-sm">
                      💰 {t.detailedTruck?.cashPayment || "Наличные"}:{" "}
                      {truck.pricing.cash.toLocaleString()}
                    </p>
                  </div>
                )}

                <div className="text-center">
                  <span
                    className={`inline-flex items-center px-3 py-1 text-sm font-medium rounded-full ${
                      truck.bid === "yes"
                        ? "bg-green-100 text-green-800"
                        : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {truck.bid === "yes"
                      ? t.detailedTruck?.acceptsBids || "Принимает торги"
                      : t.detailedTruck?.fixedPrice || "Фиксированная цена"}
                  </span>
                </div>
              </div>
            </div>

            {/* Owner Info Card */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center gap-3 mb-6">
                <User
                  className="text-blue-600"
                  size={24}
                />
                <h2 className="text-xl font-semibold">
                  {t.detailedTruck?.ownerInfo || "Информация о владельце"}
                </h2>
              </div>

              <div className="space-y-4">
                {profile && (
                  <>
                    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                      <Building
                        className="text-gray-600"
                        size={20}
                      />
                      <div>
                        <p className="font-medium text-gray-900">
                          {profile.companyName ||
                            (typeof truck.owner === "object"
                              ? truck.owner.fullName
                              : null) ||
                            t.common?.notSpecified ||
                            "Не указано"}
                        </p>
                        <p className="text-gray-600 text-sm">
                          {profile.type === "legal_entity"
                            ? t.detailedTruck?.legalEntity || "Юридическое лицо"
                            : t.detailedTruck?.individual || "Физическое лицо"}
                        </p>
                      </div>
                      {profile.isVerified && (
                        <CheckCircle2
                          className="text-green-600 ml-auto"
                          size={20}
                        />
                      )}
                    </div>

                    <div className="space-y-3">
                      {profile.phoneNumbers && profile.phoneNumbers.length > 0 && (
                        <div className="flex items-center gap-3">
                          <Phone
                            className="text-gray-600"
                            size={16}
                          />
                          <span className="text-gray-900">{profile.phoneNumbers[0]}</span>
                        </div>
                      )}

                      {profile.emails && profile.emails.length > 0 && (
                        <div className="flex items-center gap-3">
                          <Mail
                            className="text-gray-600"
                            size={16}
                          />
                          <span className="text-gray-900">{profile.emails[0]}</span>
                        </div>
                      )}

                      <div className="flex items-center gap-3">
                        <MapPin
                          className="text-gray-600"
                          size={16}
                        />
                        <span className="text-gray-900">
                          {profile.address || t.common?.notSpecified || "Не указан"}
                        </span>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-gray-200">
                      <p className="text-gray-500 text-sm">
                        {t.detailedTruck?.memberSince || "Участник с"}:{" "}
                        {profile.createdAt
                          ? new Date(profile.createdAt).toLocaleDateString()
                          : t.common?.notSpecified || "Не указано"}
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailedTruck;
