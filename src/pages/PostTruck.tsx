import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import LocationSelect from "@/components/ui/LocationSelect";
import {
  Truck,
  MapPin,
  DollarSign,
  Calendar,
  Package,
  CheckCircle2,
  ArrowLeft,
  Settings,
  Check,
} from "lucide-react";
import { useCreateTruckMutation } from "@/api/trucksApi";
import { useGetTruckOptionsQuery } from "@/api/truckOptionsApi";
import { useGetTruckLoadTypesQuery } from "@/api/truckLoadTypesApi";
import { useGetTruckPricingTypesQuery } from "@/api/truckPricingTypesApi";
import type { LocationResult } from "@/api/locationApi";
import { useLocalization } from "@/hooks/useLocalization";

interface FormData {
  truckOption?: string;
  trailerType: "truck" | "trailer" | "semi_trailer";
  loadTypes: string[];
  loadCapacity: number;
  volume: number;
  truckNumber: string;
  dimensions: {
    length: number;
    width: number;
    height: number;
  };
  trailer_dimensions: {
    length: number;
    width: number;
    height: number;
  };
  features: {
    tailgate: boolean;
    hydraulicLift: boolean;
    cones: boolean;
  };
  fromRadius: number;
  fromAddress?: LocationResult;
  toRadius: number;
  toAddress?: LocationResult;
  gpsMonitoring: {
    enabled: boolean;
    provider?: string;
  };
  readyType: {
    type: "always" | "ready_from";
    readyFrom?: Date;
    interval?:
      | "every_day"
      | "twice_a_week"
      | "every_week"
      | "every_month"
      | "often"
      | "contract_based"
      | "in_working_days";
  };
  bid: "yes" | "ask";
  pricing?: {
    withVat: number;
    withoutVat: number;
    pricingType?: string;
    cash: number;
  };
}

const PostTruck: React.FC = () => {
  const navigate = useNavigate();
  const { getLocalizedText, t } = useLocalization();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    trailerType: "truck",
    loadTypes: [],
    loadCapacity: 0,
    volume: 0,
    truckNumber: "",
    dimensions: { length: 0, width: 0, height: 0 },
    trailer_dimensions: { length: 0, width: 0, height: 0 },
    features: { tailgate: false, hydraulicLift: false, cones: false },
    fromRadius: 0,
    toRadius: 0,
    gpsMonitoring: { enabled: false },
    readyType: { type: "always" },
    bid: "ask",
    pricing: { withVat: 0, withoutVat: 0, cash: 0 },
  });

  // API hooks
  const [createTruck, { isLoading: isCreating }] = useCreateTruckMutation();
  const { data: truckOptions = [] } = useGetTruckOptionsQuery();
  const { data: truckLoadTypes = [] } = useGetTruckLoadTypesQuery();
  const { data: pricingTypes = [] } = useGetTruckPricingTypesQuery();

  const steps = [
    { id: 1, name: t.postTruck.steps.truckDetails, icon: Truck },
    { id: 2, name: t.postTruck.steps.specifications, icon: Package },
    { id: 3, name: t.postTruck.steps.routesAvailability, icon: MapPin },
    { id: 4, name: t.postTruck.steps.pricingTerms, icon: DollarSign },
  ];

  const trailerTypeOptions = [
    { value: "truck", label: t.postTruck.trailerTypes.truck },
    { value: "trailer", label: t.postTruck.trailerTypes.trailer },
    { value: "semi_trailer", label: t.postTruck.trailerTypes.semiTrailer },
  ];

  const intervalOptions = [
    { value: "every_day", label: t.postTruck.intervals.everyDay },
    { value: "twice_a_week", label: t.postTruck.intervals.twiceAWeek },
    { value: "every_week", label: t.postTruck.intervals.everyWeek },
    { value: "every_month", label: t.postTruck.intervals.everyMonth },
    { value: "often", label: t.postTruck.intervals.often },
    { value: "contract_based", label: t.postTruck.intervals.contractBased },
    { value: "in_working_days", label: t.postTruck.intervals.workingDays },
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
      const truckData = {
        truckOption: formData.truckOption,
        trailerType: formData.trailerType,
        loadTypes: formData.loadTypes,
        loadCapacity: formData.loadCapacity,
        volume: formData.volume,
        truckNumber: formData.truckNumber,
        dimensions: formData.dimensions,
        trailer_dimensions: formData.trailer_dimensions,
        features: formData.features,
        fromRadius: formData.fromRadius,
        fromAddress: formData.fromAddress
          ? {
              osm_id: formData.fromAddress.osm_id || "",
              lat: Number(formData.fromAddress.lat) || 0,
              lon: Number(formData.fromAddress.lon) || 0,
              display_name: formData.fromAddress.display_name || "",
              display_place: formData.fromAddress.display_place || "",
              display_address: formData.fromAddress.display_address || "",
              name: formData.fromAddress.display_place || "",
              country: formData.fromAddress.address?.country || "",
              state: formData.fromAddress.address?.state || "",
              county: formData.fromAddress.address?.county || "",
              postcode: formData.fromAddress.address?.postcode || "",
              country_code: formData.fromAddress.address?.country_code || "",
              place_id: formData.fromAddress.place_id || "",
            }
          : undefined,
        toRadius: formData.toRadius,
        toAddress: formData.toAddress
          ? {
              osm_id: formData.toAddress.osm_id || "",
              lat: Number(formData.toAddress.lat) || 0,
              lon: Number(formData.toAddress.lon) || 0,
              display_name: formData.toAddress.display_name || "",
              display_place: formData.toAddress.display_place || "",
              display_address: formData.toAddress.display_address || "",
              name: formData.toAddress.display_place || "",
              country: formData.toAddress.address?.country || "",
              state: formData.toAddress.address?.state || "",
              county: formData.toAddress.address?.county || "",
              postcode: formData.toAddress.address?.postcode || "",
              country_code: formData.toAddress.address?.country_code || "",
              place_id: formData.toAddress.place_id || "",
            }
          : undefined,
        gpsMonitoring: formData.gpsMonitoring,
        readyType: formData.readyType,
        bid: formData.bid,
        pricing:
          formData.pricing && formData.pricing.pricingType
            ? {
                withVat: formData.pricing.withVat,
                withoutVat: formData.pricing.withoutVat,
                pricingType: formData.pricing.pricingType,
                cash: formData.pricing.cash,
              }
            : undefined,
      };

      await createTruck(truckData).unwrap();
      navigate("/trucks", {
        state: { message: t.postTruck.validation.createTruckSuccess },
      });
    } catch (error) {
      console.error("Failed to create truck:", error);
      alert(t.postTruck.validation.createTruckFailed);
    }
  };

  const isStepValid = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!(
          formData.truckNumber &&
          formData.loadCapacity > 0 &&
          formData.volume >= 0
        );
      case 2:
        return !!(
          formData.dimensions.length > 0 &&
          formData.dimensions.width > 0 &&
          formData.dimensions.height > 0
        );
      case 3:
        return true; // Optional step
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
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{t.postTruck.title}</h1>
            <p className="text-gray-600 mt-1">{t.postTruck.subtitle}</p>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between max-w-4xl mx-auto">
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
                    flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all shrink-0
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
                  <div className="ml-3 hidden sm:block">
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
                      className={`w-20 h-0.5 mx-4 ${
                        isCompleted ? "bg-green-300" : "bg-gray-200"
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Main Form */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-8">
            {/* Step 1: Truck Details */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <Truck
                    className="text-blue-600"
                    size={24}
                  />
                  <h2 className="text-2xl font-semibold">
                    {t.postTruck.truckDetails.title}
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Truck Number */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t.postTruck.truckDetails.truckNumber} *
                    </label>
                    <input
                      type="text"
                      value={formData.truckNumber}
                      onChange={(e) => updateFormData("truckNumber", e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder={t.postTruck.truckDetails.truckNumberPlaceholder}
                    />
                  </div>

                  {/* Truck Option */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t.postTruck.truckDetails.truckType}
                    </label>
                    <select
                      value={formData.truckOption || ""}
                      onChange={(e) =>
                        updateFormData("truckOption", e.target.value || undefined)
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">
                        {t.postTruck.truckDetails.truckTypePlaceholder}
                      </option>
                      {truckOptions.map((option) => (
                        <option
                          key={option._id}
                          value={option._id}
                        >
                          {getLocalizedText(option.name)}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Trailer Type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t.postTruck.truckDetails.trailerType} *
                    </label>
                    <select
                      value={formData.trailerType}
                      onChange={(e) => updateFormData("trailerType", e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      {trailerTypeOptions.map((option) => (
                        <option
                          key={option.value}
                          value={option.value}
                        >
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Load Capacity */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t.postTruck.truckDetails.loadCapacity} *
                    </label>
                    <input
                      type="number"
                      value={formData.loadCapacity}
                      onChange={(e) =>
                        updateFormData("loadCapacity", Number(e.target.value))
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder={t.postTruck.truckDetails.loadCapacityPlaceholder}
                      min="0"
                      step="0.1"
                    />
                  </div>

                  {/* Volume */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t.postTruck.truckDetails.volume}
                    </label>
                    <input
                      type="number"
                      value={formData.volume}
                      onChange={(e) => updateFormData("volume", Number(e.target.value))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder={t.postTruck.truckDetails.volumePlaceholder}
                      min="0"
                      step="0.1"
                    />
                  </div>

                  {/* Load Types */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-4">
                      {t.postTruck.truckDetails.supportedLoadingMethods}
                    </label>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Left side - Scrollable load types list */}
                      <div className="border border-gray-300 rounded-lg p-4 h-64 overflow-y-auto">
                        <div className="space-y-2">
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
                                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                                />
                                <span className="ml-3 text-sm font-medium text-gray-700">
                                  {getLocalizedText(type.name)}
                                </span>
                              </label>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Specifications */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <Package
                    className="text-blue-600"
                    size={24}
                  />
                  <h2 className="text-2xl font-semibold">
                    {t.postTruck.specifications.title}
                  </h2>
                </div>

                {/* Truck Dimensions */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-4">
                    {t.postTruck.specifications.truckDimensions} *
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
                        placeholder={t.postTruck.specifications.lengthPlaceholder}
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
                        placeholder={t.postTruck.specifications.widthPlaceholder}
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
                        placeholder={t.postTruck.specifications.heightPlaceholder}
                        min="0"
                        step="0.1"
                      />
                    </div>
                  </div>
                </div>

                {/* Trailer Dimensions */}
                {(formData.trailerType === "trailer" ||
                  formData.trailerType === "semi_trailer") && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-4">
                      {t.postTruck.specifications.trailerDimensions}
                    </label>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <input
                          type="number"
                          value={formData.trailer_dimensions.length}
                          onChange={(e) =>
                            updateNestedFormData(
                              "trailer_dimensions",
                              "length",
                              Number(e.target.value)
                            )
                          }
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder={t.postTruck.specifications.lengthPlaceholder}
                          min="0"
                          step="0.1"
                        />
                      </div>
                      <div>
                        <input
                          type="number"
                          value={formData.trailer_dimensions.width}
                          onChange={(e) =>
                            updateNestedFormData(
                              "trailer_dimensions",
                              "width",
                              Number(e.target.value)
                            )
                          }
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder={t.postTruck.specifications.widthPlaceholder}
                          min="0"
                          step="0.1"
                        />
                      </div>
                      <div>
                        <input
                          type="number"
                          value={formData.trailer_dimensions.height}
                          onChange={(e) =>
                            updateNestedFormData(
                              "trailer_dimensions",
                              "height",
                              Number(e.target.value)
                            )
                          }
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder={t.postTruck.specifications.heightPlaceholder}
                          min="0"
                          step="0.1"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Features */}
                <div className="p-6 bg-gray-50 rounded-lg">
                  <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                    <Settings
                      className="text-blue-600"
                      size={20}
                    />
                    {t.postTruck.specifications.specialFeatures}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <label className="flex items-center p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-white">
                      <input
                        type="checkbox"
                        checked={formData.features.tailgate}
                        onChange={(e) =>
                          updateNestedFormData("features", "tailgate", e.target.checked)
                        }
                        className="mr-3"
                      />
                      <span>{t.postTruck.specifications.tailgate}</span>
                    </label>
                    <label className="flex items-center p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-white">
                      <input
                        type="checkbox"
                        checked={formData.features.hydraulicLift}
                        onChange={(e) =>
                          updateNestedFormData(
                            "features",
                            "hydraulicLift",
                            e.target.checked
                          )
                        }
                        className="mr-3"
                      />
                      <span>{t.postTruck.specifications.hydraulicLift}</span>
                    </label>
                    <label className="flex items-center p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-white">
                      <input
                        type="checkbox"
                        checked={formData.features.cones}
                        onChange={(e) =>
                          updateNestedFormData("features", "cones", e.target.checked)
                        }
                        className="mr-3"
                      />
                      <span>{t.postTruck.specifications.safetyCones}</span>
                    </label>
                  </div>
                </div>

                {/* GPS Monitoring */}
                <div className="p-6 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3 mb-4">
                    <h3 className="text-lg font-medium text-gray-900">
                      {t.postTruck.specifications.gpsMonitoring}
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
                    <span>{t.postTruck.specifications.gpsAvailable}</span>
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
                        placeholder={t.postTruck.specifications.gpsProviderPlaceholder}
                      />
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Step 3: Routes & Availability */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <MapPin
                    className="text-blue-600"
                    size={24}
                  />
                  <h2 className="text-2xl font-semibold">{t.postTruck.routes.title}</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* From Address */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      {t.postTruck.routes.startingLocation}
                    </h3>
                    <LocationSelect
                      value={formData.fromAddress?.display_place || ""}
                      onSelect={(location) => updateFormData("fromAddress", location)}
                      placeholder={t.postTruck.routes.startingPlaceholder}
                      className="w-full"
                    />
                    {formData.fromAddress && (
                      <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                        <p className="text-sm text-green-800">
                          📍 {formData.fromAddress.display_name}
                        </p>
                      </div>
                    )}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t.postTruck.routes.serviceRadius}
                      </label>
                      <input
                        type="number"
                        value={formData.fromRadius}
                        onChange={(e) =>
                          updateFormData("fromRadius", Number(e.target.value))
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="0"
                        min="0"
                      />
                    </div>
                  </div>

                  {/* To Address */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      {t.postTruck.routes.destinationLocation}
                    </h3>
                    <LocationSelect
                      value={formData.toAddress?.display_place || ""}
                      onSelect={(location) => updateFormData("toAddress", location)}
                      placeholder={t.postTruck.routes.destinationPlaceholder}
                      className="w-full"
                    />
                    {formData.toAddress && (
                      <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <p className="text-sm text-blue-800">
                          📍 {formData.toAddress.display_name}
                        </p>
                      </div>
                    )}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t.postTruck.routes.serviceRadius}
                      </label>
                      <input
                        type="number"
                        value={formData.toRadius}
                        onChange={(e) =>
                          updateFormData("toRadius", Number(e.target.value))
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="0"
                        min="0"
                      />
                    </div>
                  </div>
                </div>

                {/* Availability */}
                <div className="mt-8 space-y-4">
                  <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                    <Calendar
                      className="text-blue-600"
                      size={20}
                    />
                    {t.postTruck.routes.truckAvailability}
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <label className="flex items-center p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                      <input
                        type="radio"
                        value="always"
                        checked={formData.readyType.type === "always"}
                        onChange={(e) =>
                          updateNestedFormData("readyType", "type", e.target.value)
                        }
                        className="mr-3"
                      />
                      <div>
                        <p className="font-medium">
                          {t.postTruck.routes.alwaysAvailable}
                        </p>
                        <p className="text-sm text-gray-500">
                          {t.postTruck.routes.alwaysAvailableDesc}
                        </p>
                      </div>
                    </label>

                    <label className="flex items-center p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                      <input
                        type="radio"
                        value="ready_from"
                        checked={formData.readyType.type === "ready_from"}
                        onChange={(e) =>
                          updateNestedFormData("readyType", "type", e.target.value)
                        }
                        className="mr-3"
                      />
                      <div>
                        <p className="font-medium">
                          {t.postTruck.routes.availableFromDate}
                        </p>
                        <p className="text-sm text-gray-500">
                          {t.postTruck.routes.availableFromDateDesc}
                        </p>
                      </div>
                    </label>
                  </div>

                  {formData.readyType.type === "ready_from" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {t.postTruck.routes.availableFromLabel}
                        </label>
                        <input
                          type="date"
                          value={
                            formData.readyType.readyFrom
                              ? new Date(formData.readyType.readyFrom)
                                  .toISOString()
                                  .split("T")[0]
                              : ""
                          }
                          onChange={(e) =>
                            updateNestedFormData(
                              "readyType",
                              "readyFrom",
                              new Date(e.target.value)
                            )
                          }
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {t.postTruck.routes.frequency}
                        </label>
                        <select
                          value={formData.readyType.interval || ""}
                          onChange={(e) =>
                            updateNestedFormData(
                              "readyType",
                              "interval",
                              e.target.value || undefined
                            )
                          }
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="">
                            {t.postTruck.routes.frequencyPlaceholder}
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

            {/* Step 4: Pricing & Terms */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <DollarSign
                    className="text-blue-600"
                    size={24}
                  />
                  <h2 className="text-2xl font-semibold">{t.postTruck.pricing.title}</h2>
                </div>

                {/* Bidding */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t.postTruck.pricing.pricingMethod}
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
                      {t.postTruck.pricing.askForQuote}
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        value="yes"
                        checked={formData.bid === "yes"}
                        onChange={(e) => updateFormData("bid", e.target.value)}
                        className="mr-2"
                      />
                      {t.postTruck.pricing.acceptBids}
                    </label>
                  </div>
                </div>

                {formData.bid === "yes" && (
                  <div className="space-y-6">
                    {/* Pricing */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {t.postTruck.pricing.rateExcludingVat}
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
                          {t.postTruck.pricing.rateIncludingVat}
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
                          {t.postTruck.pricing.cashRate}
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
                        {t.postTruck.pricing.pricingMethodSelect}
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
                          {t.postTruck.pricing.pricingMethodPlaceholder}
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

                {/* Summary Card */}
                {/* Summary Card */}
                <div className="mt-8 p-6 bg-blue-50 border border-blue-200 rounded-lg">
                  <h3 className="text-lg font-semibold text-blue-900 mb-4">
                    {t.postTruck.summary.title}
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-blue-700">
                        {t.postTruck.summary.truckNumber}
                      </span>
                      <span className="font-medium">{formData.truckNumber}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-blue-700">
                        {t.postTruck.summary.capacity}
                      </span>
                      <span className="font-medium">{formData.loadCapacity} tons</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-blue-700">{t.postTruck.summary.volume}</span>
                      <span className="font-medium">{formData.volume} m³</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-blue-700">{t.postTruck.summary.route}</span>
                      <span className="font-medium">
                        {formData.fromAddress?.display_place || t.postTruck.summary.any} →{" "}
                        {formData.toAddress?.display_place || t.postTruck.summary.any}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-blue-700">
                        {t.postTruck.summary.loadTypes}
                      </span>
                      <span className="font-medium">
                        {formData.loadTypes.length} {t.postTruck.summary.selected}
                      </span>
                    </div>
                    {formData.pricing?.withoutVat && (
                      <div className="flex justify-between">
                        <span className="text-blue-700">{t.postTruck.summary.rate}</span>
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
                {t.postTruck.navigation.previous}
              </Button>

              <div className="flex gap-3">
                {currentStep < 4 ? (
                  <Button
                    onClick={nextStep}
                    disabled={!isStepValid(currentStep)}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2"
                  >
                    {t.postTruck.navigation.continue}
                    <ArrowLeft
                      size={16}
                      className="rotate-180"
                    />
                  </Button>
                ) : (
                  <Button
                    onClick={handleSubmit}
                    disabled={isCreating || !isStepValid(1) || !isStepValid(2)}
                    className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-8 py-2"
                  >
                    {isCreating ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        {t.postTruck.navigation.posting}
                      </>
                    ) : (
                      <>
                        <CheckCircle2 size={16} />
                        {t.postTruck.navigation.postTruck}
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

export default PostTruck;
