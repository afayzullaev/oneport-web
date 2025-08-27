import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import LocationSelect from "@/components/ui/LocationSelect";
import {
  Package,
  MapPin,
  DollarSign,
  Calendar,
  Truck,
  CheckCircle2,
  ArrowLeft,
  Check,
} from "lucide-react";
import { useCreateOrderMutation } from "@/api/ordersApi";
import { useGetLoadTypesQuery } from "@/api/loadTypesApi";
import { useGetLoadPackagesQuery } from "@/api/loadPackagesApi";
import { useGetTruckOptionsQuery } from "@/api/truckOptionsApi";
import { useGetTruckLoadTypesQuery } from "@/api/truckLoadTypesApi";
import { useGetTruckPricingTypesQuery } from "@/api/truckPricingTypesApi";
import type { LocationResult } from "@/api/locationApi";
import type { Order } from "@/types/models/cargoOwner/order";
import { useLocalization } from "@/hooks/useLocalization";

interface FormData {
  loadName: string;
  loadType?: string;
  loadPackage?: string;
  dimensions: {
    length: number;
    width: number;
    height: number;
  };
  bid: "yes" | "ask";
  weight: number;
  volume?: number;
  weightUnit: "kg" | "ton";
  loadStatus: {
    state: "ready_from" | "always" | "not_ready";
    readyFrom?: Date;
    interval?:
      | "every_day"
      | "in_working_days"
      | "every_month"
      | "twice_a_week"
      | "every_week";
  };
  loadAddress?: LocationResult;
  unloadAddress?: LocationResult;
  truckOptions: string[];
  loadTypes: string[];
  unloadTypes: string[];
  gpsMonitoring: {
    enabled: boolean;
    provider?: string;
  };
  pricing?: {
    withVat: number;
    withoutVat: number;
    pricingType?: string;
    cash: number;
  };
  paymentWithin?: number;
}

const PostCargo: React.FC = () => {
  const navigate = useNavigate();
  const { getLocalizedText, t } = useLocalization();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    loadName: "",
    dimensions: { length: 0, width: 0, height: 0 },
    bid: "ask",
    weight: 0,
    weightUnit: "kg",
    loadStatus: { state: "not_ready" },
    truckOptions: [],
    loadTypes: [],
    unloadTypes: [],
    gpsMonitoring: { enabled: false },
    pricing: { withVat: 0, withoutVat: 0, cash: 0 },
  });

  // API hooks
  const [createOrder, { isLoading: isCreating }] = useCreateOrderMutation();
  const { data: loadTypes = [] } = useGetLoadTypesQuery();
  const { data: loadPackages = [] } = useGetLoadPackagesQuery();
  const { data: truckOptions = [] } = useGetTruckOptionsQuery();
  const { data: truckLoadTypes = [] } = useGetTruckLoadTypesQuery();
  const { data: pricingTypes = [] } = useGetTruckPricingTypesQuery();

  const steps = [
    { id: 1, name: t.postCargo?.steps?.cargoDetails || "Cargo Details", icon: Package },
    { id: 2, name: t.postCargo?.steps?.locations || "Locations", icon: MapPin },
    {
      id: 3,
      name: t.postCargo?.steps?.truckRequirements || "Truck Requirements",
      icon: Truck,
    },
    {
      id: 4,
      name: t.postCargo?.steps?.pricingTimeline || "Pricing & Timeline",
      icon: DollarSign,
    },
  ];

  const intervalOptions = [
    { value: "every_day", label: t.postCargo.intervals.everyDay },
    { value: "in_working_days", label: t.postCargo.intervals.workingDays },
    { value: "every_week", label: t.postCargo.intervals.everyWeek },
    { value: "twice_a_week", label: t.postCargo.intervals.twiceAWeek },
    { value: "every_month", label: t.postCargo.intervals.everyMonth },
  ];

  const updateFormData = (field: keyof FormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const updateNestedFormData = (field: keyof FormData, subField: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: { ...(prev[field] as any), [subField]: value },
    }));
  };

  const handleSubmit = async () => {
    try {
      if (!formData.loadAddress || !formData.unloadAddress) {
        alert(t.postCargo.validation.selectAddresses);
        return;
      }

      const orderData: Partial<Order> = {
        loadName: formData.loadName,
        loadType: formData.loadType,
        loadPackage: formData.loadPackage,
        dimensions: formData.dimensions,
        bid: formData.bid,
        weight: formData.weight,
        volume: formData.volume,
        weightUnit: formData.weightUnit,
        loadStatus: formData.loadStatus,
        loadAddress: {
          osm_id: formData.loadAddress.osm_id || "",
          lat: Number(formData.loadAddress.lat) || 0,
          lon: Number(formData.loadAddress.lon) || 0,
          display_name: formData.loadAddress.display_name || "",
          display_place: formData.loadAddress.display_place || "",
          display_address: formData.loadAddress.display_address || "",
          name: formData.loadAddress.display_place || "",
          country: formData.loadAddress.address?.country || "",
          state: formData.loadAddress.address?.state || "",
          county: formData.loadAddress.address?.county || "",
          postcode: formData.loadAddress.address?.postcode || "",
          country_code: formData.loadAddress.address?.country_code || "",
          place_id: formData.loadAddress.place_id || "",
        },
        unloadAddress: {
          osm_id: formData.unloadAddress.osm_id || "",
          lat: Number(formData.unloadAddress.lat) || 0,
          lon: Number(formData.unloadAddress.lon) || 0,
          display_name: formData.unloadAddress.display_name || "",
          display_place: formData.unloadAddress.display_place || "",
          display_address: formData.unloadAddress.display_address || "",
          name: formData.unloadAddress.display_place || "",
          country: formData.unloadAddress.address?.country || "",
          state: formData.unloadAddress.address?.state || "",
          county: formData.unloadAddress.address?.county || "",
          postcode: formData.unloadAddress.address?.postcode || "",
          country_code: formData.unloadAddress.address?.country_code || "",
          place_id: formData.unloadAddress.place_id || "",
        },
        truckOptions: truckOptions.filter((opt) =>
          formData.truckOptions.includes(opt._id!)
        ),
        loadTypes: truckLoadTypes
          .filter((type) => formData.loadTypes.includes(type._id!))
          .map((type) => ({
            _id: type._id,
            name: {
              en: type.name.en || "",
              uz: type.name.uz || "",
              ru: type.name.ru || "",
              kz: type.name.kz || "",
              kaa: type.name.kaa || "",
            },
          })),
        unloadTypes: truckLoadTypes
          .filter((type) => formData.unloadTypes.includes(type._id!))
          .map((type) => ({
            _id: type._id,
            name: {
              en: type.name.en || "",
              uz: type.name.uz || "",
              ru: type.name.ru || "",
              kz: type.name.kz || "",
              kaa: type.name.kaa || "",
            },
          })),
        gpsMonitoring: formData.gpsMonitoring,
        pricing:
          formData.pricing && formData.pricing.pricingType
            ? {
                withVat: formData.pricing.withVat,
                withoutVat: formData.pricing.withoutVat,
                pricingType: formData.pricing.pricingType,
                cash: formData.pricing.cash,
              }
            : undefined,
        paymentWithin: formData.paymentWithin,
      };

      await createOrder(orderData).unwrap();
      navigate("/orders", {
        state: { message: t.postCargo.validation.createOrderSuccess },
      });
    } catch (error) {
      console.error("Failed to create order:", error);
      alert(t.postCargo.validation.createOrderFailed);
    }
  };

  const isStepValid = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!(formData.loadName && formData.weight > 0);
      case 2:
        return !!(formData.loadAddress && formData.unloadAddress);
      case 3:
        return formData.truckOptions.length > 0;
      case 4:
        return true; // Optional step
      default:
        return false;
    }
  };

  const nextStep = () => {
    if (isStepValid(currentStep) && currentStep < 4) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="container mx-auto px-4 py-8 pb-24 md:pb-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{t.postCargo.title}</h1>
            <p className="text-gray-600 mt-1">{t.postCargo.subtitle}</p>
          </div>
        </div>{" "}
        {/* Progress Steps */}
        <div className="mb-8">
          {/* Desktop Version - Full Steps */}
          <div className="hidden md:flex items-center justify-between max-w-4xl mx-auto">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = currentStep === step.id;
              const isCompleted = currentStep > step.id;
              const isValid = isStepValid(step.id);

              return (
                <div
                  key={step.id}
                  className="flex items-center"
                >
                  <div
                    className={`
                      flex items-center shrink-0 justify-center w-10 h-10 rounded-full border-2 transition-all
                      ${
                        isActive
                          ? "bg-blue-600 border-blue-600 text-white"
                          : isCompleted
                          ? "bg-green-600 border-green-600 text-white"
                          : isValid
                          ? "bg-blue-100 border-blue-300 text-blue-600"
                          : "bg-gray-100 border-gray-300 text-gray-400"
                      }
                    `}
                  >
                    {isCompleted ? <Check size={20} /> : <Icon size={20} />}
                  </div>
                  <div className="ml-3">
                    <p
                      className={`text-sm font-medium ${
                        isActive
                          ? "text-blue-600"
                          : isCompleted
                          ? "text-green-600"
                          : "text-gray-500"
                      }`}
                    >
                      {step.name}
                    </p>
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`w-28 h-0.5 mx-4 ${
                        isCompleted ? "bg-green-300" : "bg-gray-200"
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>

          {/* Mobile Version - Single Step Indicator */}
          <div className="md:hidden flex flex-col items-center space-y-3">
            {/* Current Step Icon */}
            <div className="flex items-center justify-center">
              {(() => {
                const currentStepData = steps.find((step) => step.id === currentStep);
                const Icon = currentStepData?.icon || Package;
                return (
                  <div className="flex items-center shrink-0 justify-center w-12 h-12 rounded-full border-2 bg-blue-600 border-blue-600 text-white">
                    <Icon size={24} />
                  </div>
                );
              })()}
            </div>

            {/* Step Info */}
            <div className="text-center">
              <p className="text-lg font-semibold text-blue-600 mb-1">
                {steps.find((step) => step.id === currentStep)?.name}
              </p>
              <p className="text-sm text-gray-500">
                Шаг {currentStep} из {steps.length}
              </p>
            </div>

            {/* Progress Bar */}
            <div className="w-full max-w-xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-gray-500">Прогресс</span>
                <span className="text-xs text-blue-600 font-medium">
                  {Math.round((currentStep / steps.length) * 100)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-out"
                  style={{ width: `${(currentStep / steps.length) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Step Indicators */}
            <div className="flex items-center space-x-2">
              {steps.map((step) => {
                const isActive = currentStep === step.id;
                const isCompleted = currentStep > step.id;

                return (
                  <div
                    key={step.id}
                    className={`w-2 h-2 rounded-full transition-all ${
                      isActive
                        ? "bg-blue-600 scale-125"
                        : isCompleted
                        ? "bg-green-500"
                        : "bg-gray-300"
                    }`}
                  />
                );
              })}
            </div>
          </div>
        </div>
        {/* Main Form */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-8">
            {/* Step 1: Cargo Details */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <Package
                    className="text-blue-600"
                    size={24}
                  />
                  <h2 className="text-2xl font-semibold">
                    {t.postCargo.cargoDetails.title}
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Cargo Name */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t.postCargo.cargoDetails.cargoName}
                    </label>
                    <input
                      type="text"
                      value={formData.loadName}
                      onChange={(e) => updateFormData("loadName", e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder={t.postCargo.cargoDetails.cargoNamePlaceholder}
                    />
                  </div>

                  {/* Load Type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t.postCargo.cargoDetails.loadType}
                    </label>
                    <select
                      value={formData.loadType || ""}
                      onChange={(e) =>
                        updateFormData("loadType", e.target.value || undefined)
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">
                        {t.postCargo.cargoDetails.loadTypePlaceholder}
                      </option>
                      {loadTypes.map((type) => (
                        <option
                          key={type._id}
                          value={type._id}
                        >
                          {getLocalizedText(type.name)}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Load Package */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t.postCargo.cargoDetails.packageType}
                    </label>
                    <select
                      value={formData.loadPackage || ""}
                      onChange={(e) =>
                        updateFormData("loadPackage", e.target.value || undefined)
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">
                        {t.postCargo.cargoDetails.packageTypePlaceholder}
                      </option>
                      {loadPackages.map((pkg) => (
                        <option
                          key={pkg._id}
                          value={pkg._id}
                        >
                          {getLocalizedText(pkg.name)}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Weight */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t.postCargo.cargoDetails.weight}
                    </label>
                    <div className="flex">
                      <input
                        type="number"
                        value={formData.weight}
                        onChange={(e) => updateFormData("weight", Number(e.target.value))}
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder={t.postCargo.cargoDetails.weightPlaceholder}
                        min="0"
                      />
                      <select
                        value={formData.weightUnit}
                        onChange={(e) => updateFormData("weightUnit", e.target.value)}
                        className="px-4 py-3 border border-l-0 border-gray-300 rounded-r-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="kg">{t.common.kg}</option>
                        <option value="ton">{t.common.ton}</option>
                      </select>
                    </div>
                  </div>

                  {/* Volume */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t.postCargo.cargoDetails.volume}
                    </label>
                    <input
                      type="number"
                      value={formData.volume || ""}
                      onChange={(e) =>
                        updateFormData(
                          "volume",
                          e.target.value ? Number(e.target.value) : undefined
                        )
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder={t.postCargo.cargoDetails.volumePlaceholder}
                      min="0"
                      step="0.1"
                    />
                  </div>

                  {/* Dimensions */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t.postCargo.cargoDetails.dimensions}
                    </label>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <input
                          type="number"
                          value={formData.dimensions.length}
                          onChange={(e) =>
                            updateNestedFormData(
                              "dimensions",
                              "length",
                              Number(e.target.value)
                            )
                          }
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder={t.postCargo.cargoDetails.dimensionsLength}
                          min="0"
                          step="0.1"
                        />
                      </div>
                      <div>
                        <input
                          type="number"
                          value={formData.dimensions.width}
                          onChange={(e) =>
                            updateNestedFormData(
                              "dimensions",
                              "width",
                              Number(e.target.value)
                            )
                          }
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder={t.postCargo.cargoDetails.dimensionsWidth}
                          min="0"
                          step="0.1"
                        />
                      </div>
                      <div>
                        <input
                          type="number"
                          value={formData.dimensions.height}
                          onChange={(e) =>
                            updateNestedFormData(
                              "dimensions",
                              "height",
                              Number(e.target.value)
                            )
                          }
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder={t.postCargo.cargoDetails.dimensionsHeight}
                          min="0"
                          step="0.1"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Locations */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <MapPin
                    className="text-blue-600"
                    size={24}
                  />
                  <h2 className="text-2xl font-semibold">
                    {t.postCargo.locations.title}
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Load Address */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      {t.postCargo.locations.pickupLocation}
                    </h3>
                    <LocationSelect
                      value={formData.loadAddress?.display_place || ""}
                      onSelect={(location) => updateFormData("loadAddress", location)}
                      placeholder={t.postCargo.locations.pickupPlaceholder}
                      className="w-full"
                    />
                    {formData.loadAddress && (
                      <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                        <p className="text-sm text-green-800">
                          📍 {formData.loadAddress.display_name}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Unload Address */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      {t.postCargo.locations.deliveryLocation}
                    </h3>
                    <LocationSelect
                      value={formData.unloadAddress?.display_place || ""}
                      onSelect={(location) => updateFormData("unloadAddress", location)}
                      placeholder={t.postCargo.locations.deliveryPlaceholder}
                      className="w-full"
                    />
                    {formData.unloadAddress && (
                      <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-sm text-red-800">
                          📍 {formData.unloadAddress.display_name}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Load Status */}
                <div className="mt-8 space-y-4">
                  <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                    <Calendar
                      className="text-blue-600"
                      size={20}
                    />
                    {t.postCargo.locations.cargoAvailability}
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <label className="flex items-center p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                      <input
                        type="radio"
                        value="always"
                        checked={formData.loadStatus.state === "always"}
                        onChange={(e) =>
                          updateNestedFormData("loadStatus", "state", e.target.value)
                        }
                        className="mr-3"
                      />
                      <div>
                        <p className="font-medium">
                          {t.postCargo.locations.alwaysAvailable}
                        </p>
                        <p className="text-sm text-gray-500">
                          {t.postCargo.locations.alwaysAvailableDesc}
                        </p>
                      </div>
                    </label>

                    <label className="flex items-center p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                      <input
                        type="radio"
                        value="ready_from"
                        checked={formData.loadStatus.state === "ready_from"}
                        onChange={(e) =>
                          updateNestedFormData("loadStatus", "state", e.target.value)
                        }
                        className="mr-3"
                      />
                      <div>
                        <p className="font-medium">
                          {t.postCargo.locations.readyFromDate}
                        </p>
                        <p className="text-sm text-gray-500">
                          {t.postCargo.locations.readyFromDateDesc}
                        </p>
                      </div>
                    </label>

                    <label className="flex items-center p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                      <input
                        type="radio"
                        value="not_ready"
                        checked={formData.loadStatus.state === "not_ready"}
                        onChange={(e) =>
                          updateNestedFormData("loadStatus", "state", e.target.value)
                        }
                        className="mr-3"
                      />
                      <div>
                        <p className="font-medium">{t.postCargo.locations.notReady}</p>
                        <p className="text-sm text-gray-500">
                          {t.postCargo.locations.notReadyDesc}
                        </p>
                      </div>
                    </label>
                  </div>

                  {formData.loadStatus.state === "ready_from" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {t.postCargo.locations.readyFromLabel}
                        </label>
                        <input
                          type="date"
                          value={
                            formData.loadStatus.readyFrom
                              ? new Date(formData.loadStatus.readyFrom)
                                  .toISOString()
                                  .split("T")[0]
                              : ""
                          }
                          onChange={(e) =>
                            updateNestedFormData(
                              "loadStatus",
                              "readyFrom",
                              new Date(e.target.value)
                            )
                          }
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {t.postCargo.locations.frequency}
                        </label>
                        <select
                          value={formData.loadStatus.interval || ""}
                          onChange={(e) =>
                            updateNestedFormData(
                              "loadStatus",
                              "interval",
                              e.target.value || undefined
                            )
                          }
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="">
                            {t.postCargo.locations.frequencyPlaceholder}
                          </option>
                          {intervalOptions.map((option) => (
                            <option
                              key={option.value}
                              value={option.value}
                            >
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Step 3: Truck Requirements */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <Truck
                    className="text-blue-600"
                    size={24}
                  />
                  <h2 className="text-2xl font-semibold">
                    {t.postCargo.truckRequirements.title}
                  </h2>
                </div>

                {/* Truck Options */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-gray-900">* Кузов</h3>
                  </div>
                  <div className="border border-gray-300 rounded-lg p-4 max-h-64 overflow-y-auto">
                    <div className="space-y-3">
                      {(() => {
                        // Group truck options by parent-child relationship
                        const parentOptions = truckOptions.filter((opt) => !opt.parentId);
                        const childOptions = truckOptions.filter((opt) => opt.parentId);

                        // Group children by parent ID
                        const childrenByParent = childOptions.reduce((acc, child) => {
                          const parentId = child.parentId?._id;
                          if (parentId) {
                            if (!acc[parentId]) acc[parentId] = [];
                            acc[parentId].push(child);
                          }
                          return acc;
                        }, {} as Record<string, typeof childOptions>);

                        return parentOptions.map((parent) => {
                          if (!parent._id) return null;

                          const children = childrenByParent[parent._id] || [];
                          const isParentSelected = formData.truckOptions.includes(
                            parent._id
                          );
                          const selectedChildrenCount = children.filter(
                            (child) =>
                              child._id && formData.truckOptions.includes(child._id)
                          ).length;
                          const isIndeterminate =
                            selectedChildrenCount > 0 &&
                            selectedChildrenCount < children.length;

                          return (
                            <div
                              key={parent._id}
                              className="space-y-2"
                            >
                              {/* Parent Option */}
                              <label className="flex items-center cursor-pointer hover:bg-gray-50 p-2 rounded font-medium">
                                <input
                                  type="checkbox"
                                  checked={
                                    (children.length === 0 && isParentSelected) ||
                                    (children.length > 0 &&
                                      selectedChildrenCount === children.length)
                                  }
                                  ref={(el) => {
                                    if (el) el.indeterminate = isIndeterminate;
                                  }}
                                  onChange={(e) => {
                                    if (e.target.checked) {
                                      // Select all children (and parent if it has no children)
                                      const newSelections = [
                                        ...formData.truckOptions.filter(
                                          (id) =>
                                            id !== parent._id &&
                                            !children.some((child) => child._id === id)
                                        ),
                                        ...(children.length === 0 ? [parent._id] : []),
                                        ...children
                                          .map((child) => child._id!)
                                          .filter((id) => id),
                                      ];
                                      updateFormData("truckOptions", newSelections);
                                    } else {
                                      // Deselect all children (and parent if it has no children)
                                      const newSelections = formData.truckOptions.filter(
                                        (id) =>
                                          id !== parent._id &&
                                          !children.some((child) => child._id === id)
                                      );
                                      updateFormData("truckOptions", newSelections);
                                    }
                                  }}
                                  className="mr-3"
                                />
                                <span className="text-gray-900">
                                  {getLocalizedText(parent.name)}
                                </span>
                                {children.length > 0 && (
                                  <span className="ml-2 text-xs text-gray-500">
                                    ({selectedChildrenCount}/{children.length})
                                  </span>
                                )}
                              </label>

                              {/* Child Options */}
                              {children.length > 0 && (
                                <div className="ml-6 space-y-1 border-l-2 border-gray-200 pl-4">
                                  {children.map((child) => {
                                    if (!child._id) return null;
                                    return (
                                      <label
                                        key={child._id}
                                        className="flex items-center cursor-pointer hover:bg-gray-50 p-1 rounded text-sm"
                                      >
                                        <input
                                          type="checkbox"
                                          checked={formData.truckOptions.includes(
                                            child._id
                                          )}
                                          onChange={(e) => {
                                            if (e.target.checked) {
                                              updateFormData("truckOptions", [
                                                ...formData.truckOptions,
                                                child._id!,
                                              ]);
                                            } else {
                                              updateFormData(
                                                "truckOptions",
                                                formData.truckOptions.filter(
                                                  (id) => id !== child._id
                                                )
                                              );
                                            }
                                          }}
                                          className="mr-2"
                                        />
                                        <span className="text-gray-700">
                                          {getLocalizedText(child.name)}
                                        </span>
                                      </label>
                                    );
                                  })}
                                </div>
                              )}
                            </div>
                          );
                        });
                      })()}

                      {/* Standalone options (no parent) that aren't parents themselves */}
                      {truckOptions
                        .filter(
                          (opt) =>
                            !opt.parentId &&
                            !truckOptions.some(
                              (child) =>
                                (typeof child.parentId === "string"
                                  ? child.parentId
                                  : child.parentId?._id) === opt._id
                            )
                        )
                        .map((option) => {
                          if (!option._id) return null;
                          return (
                            <label
                              key={option._id}
                              className="flex items-center cursor-pointer hover:bg-gray-50 p-2 rounded"
                            >
                              <input
                                type="checkbox"
                                checked={formData.truckOptions.includes(option._id)}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    updateFormData("truckOptions", [
                                      ...formData.truckOptions,
                                      option._id!,
                                    ]);
                                  } else {
                                    updateFormData(
                                      "truckOptions",
                                      formData.truckOptions.filter(
                                        (id) => id !== option._id
                                      )
                                    );
                                  }
                                }}
                                className="mr-3"
                              />
                              <span className="text-gray-800">
                                {getLocalizedText(option.name)}
                              </span>
                            </label>
                          );
                        })}
                    </div>
                  </div>
                </div>

                {/* Load Types */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-gray-900">Загрузка</h3>
                    <label className="flex items-center text-sm text-gray-600">
                      <input
                        type="checkbox"
                        checked={formData.loadTypes.length === truckLoadTypes.length}
                        onChange={(e) => {
                          if (e.target.checked) {
                            updateFormData(
                              "loadTypes",
                              truckLoadTypes.map((type) => type._id!).filter((id) => id)
                            );
                          } else {
                            updateFormData("loadTypes", []);
                          }
                        }}
                        className="mr-2"
                      />
                      учитывать все выбранные
                    </label>
                  </div>
                  <div className="border border-gray-300 rounded-lg p-4 max-h-64 overflow-y-auto">
                    <div className="space-y-3">
                      {truckLoadTypes.map((type) => {
                        if (!type._id) return null;
                        return (
                          <label
                            key={type._id}
                            className="flex items-center cursor-pointer hover:bg-gray-50 p-2 rounded"
                          >
                            <input
                              type="checkbox"
                              checked={formData.loadTypes.includes(type._id)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  updateFormData("loadTypes", [
                                    ...formData.loadTypes,
                                    type._id!,
                                  ]);
                                } else {
                                  updateFormData(
                                    "loadTypes",
                                    formData.loadTypes.filter((id) => id !== type._id)
                                  );
                                }
                              }}
                              className="mr-3"
                            />
                            <span className="text-gray-800">
                              {getLocalizedText(type.name)}
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Unload Types */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-gray-900">Выгрузка</h3>
                    <label className="flex items-center text-sm text-gray-600">
                      <input
                        type="checkbox"
                        checked={formData.unloadTypes.length === truckLoadTypes.length}
                        onChange={(e) => {
                          if (e.target.checked) {
                            updateFormData(
                              "unloadTypes",
                              truckLoadTypes.map((type) => type._id!).filter((id) => id)
                            );
                          } else {
                            updateFormData("unloadTypes", []);
                          }
                        }}
                        className="mr-2"
                      />
                      учитывать все выбранные
                    </label>
                  </div>
                  <div className="border border-gray-300 rounded-lg p-4 max-h-64 overflow-y-auto">
                    <div className="space-y-3">
                      {truckLoadTypes.map((type) => {
                        if (!type._id) return null;
                        return (
                          <label
                            key={type._id}
                            className="flex items-center cursor-pointer hover:bg-gray-50 p-2 rounded"
                          >
                            <input
                              type="checkbox"
                              checked={formData.unloadTypes.includes(type._id)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  updateFormData("unloadTypes", [
                                    ...formData.unloadTypes,
                                    type._id!,
                                  ]);
                                } else {
                                  updateFormData(
                                    "unloadTypes",
                                    formData.unloadTypes.filter((id) => id !== type._id)
                                  );
                                }
                              }}
                              className="mr-3"
                            />
                            <span className="text-gray-800">
                              {getLocalizedText(type.name)}
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* GPS Monitoring */}
                <div className="p-6 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3 mb-4">
                    <h3 className="text-lg font-medium text-gray-900">
                      {t.postCargo.truckRequirements.gpsMonitoring}
                    </h3>
                  </div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.gpsMonitoring.enabled}
                      onChange={(e) =>
                        updateNestedFormData("gpsMonitoring", "enabled", e.target.checked)
                      }
                      className="mr-3"
                    />
                    <span>{t.postCargo.truckRequirements.requireGps}</span>
                  </label>
                  {formData.gpsMonitoring.enabled && (
                    <div className="mt-4">
                      <input
                        type="text"
                        value={formData.gpsMonitoring.provider || ""}
                        onChange={(e) =>
                          updateNestedFormData(
                            "gpsMonitoring",
                            "provider",
                            e.target.value
                          )
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder={t.postCargo.truckRequirements.gpsProviderPlaceholder}
                      />
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Step 4: Pricing & Timeline */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <DollarSign
                    className="text-blue-600"
                    size={24}
                  />
                  <h2 className="text-2xl font-semibold">{t.postCargo.pricing.title}</h2>
                </div>

                {/* Bidding Method */}
                <div className="space-y-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t.postCargo.cargoDetails.pricingMethod}
                  </label>
                  <div className="flex gap-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        value="ask"
                        checked={formData.bid === "ask"}
                        onChange={(e) => updateFormData("bid", e.target.value)}
                        className="mr-2"
                      />
                      {t.postCargo.cargoDetails.askForQuote}
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        value="yes"
                        checked={formData.bid === "yes"}
                        onChange={(e) => updateFormData("bid", e.target.value)}
                        className="mr-2"
                      />
                      {t.postCargo.cargoDetails.acceptBids}
                    </label>
                  </div>
                </div>

                {formData.bid === "yes" && (
                  <div className="space-y-6">
                    {/* Budget Range */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {t.postCargo.pricing.budgetExcludingVat}
                        </label>
                        <input
                          type="number"
                          value={formData.pricing?.withoutVat || ""}
                          onChange={(e) =>
                            updateNestedFormData(
                              "pricing",
                              "withoutVat",
                              Number(e.target.value)
                            )
                          }
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="0"
                          min="0"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {t.postCargo.pricing.budgetIncludingVat}
                        </label>
                        <input
                          type="number"
                          value={formData.pricing?.withVat || ""}
                          onChange={(e) =>
                            updateNestedFormData(
                              "pricing",
                              "withVat",
                              Number(e.target.value)
                            )
                          }
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="0"
                          min="0"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {t.postCargo.pricing.cashPayment}
                        </label>
                        <input
                          type="number"
                          value={formData.pricing?.cash || ""}
                          onChange={(e) =>
                            updateNestedFormData(
                              "pricing",
                              "cash",
                              Number(e.target.value)
                            )
                          }
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="0"
                          min="0"
                        />
                      </div>
                    </div>

                    {/* Pricing Type */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t.postCargo.pricing.pricingMethod}
                      </label>
                      <select
                        value={formData.pricing?.pricingType || ""}
                        onChange={(e) =>
                          updateNestedFormData(
                            "pricing",
                            "pricingType",
                            e.target.value || undefined
                          )
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">
                          {t.postCargo.pricing.pricingMethodPlaceholder}
                        </option>
                        {pricingTypes.map((type) => (
                          <option
                            key={type._id}
                            value={type._id}
                          >
                            {getLocalizedText(type.name)}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}

                {/* Payment Terms */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t.postCargo.pricing.paymentTerms}
                  </label>
                  <select
                    value={formData.paymentWithin || ""}
                    onChange={(e) =>
                      updateFormData(
                        "paymentWithin",
                        e.target.value ? Number(e.target.value) : undefined
                      )
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">
                      {t.postCargo.pricing.paymentTermsPlaceholder}
                    </option>
                    <option value="0">{t.postCargo.pricing.immediatePayment}</option>
                    <option value="7">7 {t.postCargo.pricing.days}</option>
                    <option value="14">14 {t.postCargo.pricing.days}</option>
                    <option value="30">30 {t.postCargo.pricing.days}</option>
                    <option value="45">45 {t.postCargo.pricing.days}</option>
                    <option value="60">60 {t.postCargo.pricing.days}</option>
                  </select>
                </div>

                {/* Summary Card */}
                <div className="mt-8 p-6 bg-blue-50 border border-blue-200 rounded-lg">
                  <h3 className="text-lg font-semibold text-blue-900 mb-4">
                    Order Summary
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-blue-700">Cargo:</span>
                      <span className="font-medium">{formData.loadName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-blue-700">Weight:</span>
                      <span className="font-medium">
                        {formData.weight} {formData.weightUnit}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-blue-700">Route:</span>
                      <span className="font-medium">
                        {formData.loadAddress?.display_place} →{" "}
                        {formData.unloadAddress?.display_place}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-blue-700">Truck Options:</span>
                      <span className="font-medium">
                        {formData.truckOptions.length} selected
                      </span>
                    </div>
                    {formData.pricing?.withoutVat && (
                      <div className="flex justify-between">
                        <span className="text-blue-700">Budget:</span>
                        <span className="font-medium">
                          ${formData.pricing.withoutVat}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
              <Button
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 1}
                className="flex items-center gap-2"
              >
                <ArrowLeft size={16} />
                {t.postCargo.navigation.previous}
              </Button>

              <div className="flex gap-3">
                {currentStep < 4 ? (
                  <Button
                    onClick={nextStep}
                    disabled={!isStepValid(currentStep)}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2"
                  >
                    {t.postCargo.navigation.continue}
                    <ArrowLeft
                      size={16}
                      className="rotate-180"
                    />
                  </Button>
                ) : (
                  <Button
                    onClick={handleSubmit}
                    disabled={
                      isCreating || !isStepValid(1) || !isStepValid(2) || !isStepValid(3)
                    }
                    className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-8 py-2"
                  >
                    {isCreating ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        {t.postCargo.navigation.posting}
                      </>
                    ) : (
                      <>
                        <CheckCircle2 size={16} />
                        {t.postCargo.navigation.postCargo}
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostCargo;
