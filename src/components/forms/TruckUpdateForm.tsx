import React, { useState } from "react";
import { useLocalization } from "@/hooks/useLocalization";
import type { Truck } from "@/types/models/carrier/truck";

interface TruckUpdateFormProps {
  truck: Truck;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updates: Partial<Truck>) => void;
  isLoading: boolean;
}

const TruckUpdateForm: React.FC<TruckUpdateFormProps> = ({
  truck,
  isOpen,
  onClose,
  onSave,
  isLoading,
}) => {
  const { t } = useLocalization();

  // Basic Information
  const [truckNumber, setTruckNumber] = useState(truck.truckNumber || "");
  const [trailerType, setTrailerType] = useState<"truck" | "trailer" | "semi_trailer">(truck.trailerType || "truck");
  const [bid, setBid] = useState<"yes" | "ask">(truck.bid || "yes");
  const [loadCapacity, setLoadCapacity] = useState(truck.loadCapacity?.toString() || "");
  const [volume, setVolume] = useState(truck.volume?.toString() || "");

  // Dimensions - Truck
  const [length, setLength] = useState(truck.dimensions?.length?.toString() || "");
  const [width, setWidth] = useState(truck.dimensions?.width?.toString() || "");
  const [height, setHeight] = useState(truck.dimensions?.height?.toString() || "");

  // Dimensions - Trailer
  const [trailerLength, setTrailerLength] = useState(truck.trailer_dimensions?.length?.toString() || "");
  const [trailerWidth, setTrailerWidth] = useState(truck.trailer_dimensions?.width?.toString() || "");
  const [trailerHeight, setTrailerHeight] = useState(truck.trailer_dimensions?.height?.toString() || "");

  // Features
  const [tailgate, setTailgate] = useState(truck.features?.tailgate || false);
  const [hydraulicLift, setHydraulicLift] = useState(truck.features?.hydraulicLift || false);
  const [cones, setCones] = useState(truck.features?.cones || false);

  // Addresses and Radius
  const [fromAddress, setFromAddress] = useState(truck.fromAddress?.display_name || "");
  const [toAddress, setToAddress] = useState(truck.toAddress?.display_name || "");
  const [fromRadius, setFromRadius] = useState(truck.fromRadius?.toString() || "");
  const [toRadius, setToRadius] = useState(truck.toRadius?.toString() || "");

  // Ready Type
  const [readyType, setReadyType] = useState<"ready_from" | "always">(truck.readyType?.type || "ready_from");
  const [readyInterval, setReadyInterval] = useState<
    "every_day" | "twice_a_week" | "every_week" | "every_month" | "often" | "contract_based" | "in_working_days"
  >(truck.readyType?.interval || "every_day");

  // GPS Monitoring
  const [gpsEnabled, setGpsEnabled] = useState(truck.gpsMonitoring?.enabled || false);
  const [gpsProvider, setGpsProvider] = useState(truck.gpsMonitoring?.provider || "");

  // Pricing
  const [price, setPrice] = useState(
    truck.pricing?.withVat?.toString() || 
    truck.pricing?.withoutVat?.toString() || 
    ""
  );
  const [withVat, setWithVat] = useState(Boolean(truck.pricing?.withVat));
  const [cash, setCash] = useState(truck.pricing?.cash?.toString() || "");

  if (!isOpen) return null;

  const handleSave = () => {
    const updates: Partial<Truck> = {};

    // Basic fields
    if (truckNumber.trim()) {
      updates.truckNumber = truckNumber.trim();
    }

    if (trailerType) {
      updates.trailerType = trailerType;
    }

    if (bid) {
      updates.bid = bid;
    }

    if (loadCapacity && !isNaN(Number(loadCapacity))) {
      updates.loadCapacity = Number(loadCapacity);
    }

    if (volume && !isNaN(Number(volume))) {
      updates.volume = Number(volume);
    }

    // Truck Dimensions
    if (length || width || height) {
      updates.dimensions = {
        length: length ? Number(length) : truck.dimensions?.length || 0,
        width: width ? Number(width) : truck.dimensions?.width || 0,
        height: height ? Number(height) : truck.dimensions?.height || 0
      };
    }

    // Trailer Dimensions
    if (trailerLength || trailerWidth || trailerHeight) {
      updates.trailer_dimensions = {
        length: trailerLength ? Number(trailerLength) : truck.trailer_dimensions?.length,
        width: trailerWidth ? Number(trailerWidth) : truck.trailer_dimensions?.width,
        height: trailerHeight ? Number(trailerHeight) : truck.trailer_dimensions?.height
      };
    }

    // Features
    updates.features = {
      tailgate,
      hydraulicLift,
      cones
    };

    // Addresses
    if (fromAddress.trim()) {
      updates.fromAddress = {
        osm_id: truck.fromAddress?.osm_id || "",
        lat: truck.fromAddress?.lat || 0,
        lon: truck.fromAddress?.lon || 0,
        display_name: fromAddress.trim(),
        display_place: truck.fromAddress?.display_place || "",
        display_address: truck.fromAddress?.display_address || "",
        name: truck.fromAddress?.name || "",
        country: truck.fromAddress?.country || "",
        state: truck.fromAddress?.state || "",
        county: truck.fromAddress?.county || "",
        postcode: truck.fromAddress?.postcode || "",
        country_code: truck.fromAddress?.country_code || "",
        place_id: truck.fromAddress?.place_id || ""
      };
    }

    if (toAddress.trim()) {
      updates.toAddress = {
        osm_id: truck.toAddress?.osm_id || "",
        lat: truck.toAddress?.lat || 0,
        lon: truck.toAddress?.lon || 0,
        display_name: toAddress.trim(),
        display_place: truck.toAddress?.display_place || "",
        display_address: truck.toAddress?.display_address || "",
        name: truck.toAddress?.name || "",
        country: truck.toAddress?.country || "",
        state: truck.toAddress?.state || "",
        county: truck.toAddress?.county || "",
        postcode: truck.toAddress?.postcode || "",
        country_code: truck.toAddress?.country_code || "",
        place_id: truck.toAddress?.place_id || ""
      };
    }

    if (fromRadius && !isNaN(Number(fromRadius))) {
      updates.fromRadius = Number(fromRadius);
    }

    if (toRadius && !isNaN(Number(toRadius))) {
      updates.toRadius = Number(toRadius);
    }

    // Ready Type
    updates.readyType = {
      type: readyType,
      readyFrom: truck.readyType?.readyFrom,
      interval: readyInterval
    };

    // GPS Monitoring
    updates.gpsMonitoring = {
      enabled: gpsEnabled,
      provider: gpsProvider.trim() || undefined
    };

    // Pricing
    if (price && !isNaN(Number(price))) {
      updates.pricing = {
        withVat: withVat ? Number(price) : 0,
        withoutVat: !withVat ? Number(price) : 0,
        pricingType: truck.pricing?.pricingType || "",
        cash: cash ? Number(cash) : 0
      };
    }

    onSave(updates);
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-5xl max-h-[95vh] overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 bg-gray-50 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {t.myItems.actions.edit} Truck
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            disabled={isLoading}
          >
            <svg
className="w-6 h-6"
fill="none"
stroke="currentColor"
viewBox="0 0 24 24">
              <path
strokeLinecap="round"
strokeLinejoin="round"
strokeWidth={2}
d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form Content */}
        <div className="overflow-y-auto max-h-[calc(95vh-120px)]">
          <div className="p-6 space-y-8">
            
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">
                {t.postTruck.truckDetails.title}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Truck Number */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t.postTruck.truckDetails.truckNumber} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={truckNumber}
                    onChange={(e) => setTruckNumber(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder={t.postTruck.truckDetails.truckNumberPlaceholder}
                    required
                  />
                </div>

                {/* Trailer Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t.postTruck.truckDetails.trailerType}
                  </label>
                  <select
                    value={trailerType}
                    onChange={(e) => setTrailerType(e.target.value as "truck" | "trailer" | "semi_trailer")}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="truck">Truck</option>
                    <option value="trailer">Trailer</option>
                    <option value="semi_trailer">Semi Trailer</option>
                  </select>
                </div>

                {/* Bid Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bid Type
                  </label>
                  <select
                    value={bid}
                    onChange={(e) => setBid(e.target.value as "yes" | "ask")}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="yes">{t.bid.offer}</option>
                    <option value="ask">{t.bid.request}</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Physical Properties */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">
                {t.postTruck.specifications.title}
              </h3>
              
              {/* Load Capacity and Volume Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Load Capacity */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t.postTruck.truckDetails.loadCapacity} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={loadCapacity}
                    onChange={(e) => setLoadCapacity(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder={t.postTruck.truckDetails.loadCapacityPlaceholder}
                    required
                  />
                </div>

                {/* Volume */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t.postTruck.truckDetails.volume}
                  </label>
                  <input
                    type="number"
                    value={volume}
                    onChange={(e) => setVolume(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder={t.postTruck.truckDetails.volumePlaceholder}
                  />
                </div>
              </div>

              {/* Truck Dimensions Row */}
              <div>
                <h4 className="text-md font-medium text-gray-700 mb-3">Truck Dimensions (meters)</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Length */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Length (m)
                    </label>
                    <input
                      type="number"
                      value={length}
                      onChange={(e) => setLength(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="0"
                    />
                  </div>

                  {/* Width */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Width (m)
                    </label>
                    <input
                      type="number"
                      value={width}
                      onChange={(e) => setWidth(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="0"
                    />
                  </div>

                  {/* Height */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Height (m)
                    </label>
                    <input
                      type="number"
                      value={height}
                      onChange={(e) => setHeight(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="0"
                    />
                  </div>
                </div>
              </div>

              {/* Trailer Dimensions Row */}
              <div>
                <h4 className="text-md font-medium text-gray-700 mb-3">Trailer Dimensions (meters)</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Trailer Length */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Length (m)
                    </label>
                    <input
                      type="number"
                      value={trailerLength}
                      onChange={(e) => setTrailerLength(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="0"
                    />
                  </div>

                  {/* Trailer Width */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Width (m)
                    </label>
                    <input
                      type="number"
                      value={trailerWidth}
                      onChange={(e) => setTrailerWidth(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="0"
                    />
                  </div>

                  {/* Trailer Height */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Height (m)
                    </label>
                    <input
                      type="number"
                      value={trailerHeight}
                      onChange={(e) => setTrailerHeight(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="0"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Features */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">
                Special Features
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Tailgate */}
                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={tailgate}
                      onChange={(e) => setTailgate(e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm font-medium text-gray-700">
                      Tailgate
                    </span>
                  </label>
                </div>

                {/* Hydraulic Lift */}
                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={hydraulicLift}
                      onChange={(e) => setHydraulicLift(e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm font-medium text-gray-700">
                      Hydraulic Lift
                    </span>
                  </label>
                </div>

                {/* Cones */}
                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={cones}
                      onChange={(e) => setCones(e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm font-medium text-gray-700">
                      Cones
                    </span>
                  </label>
                </div>
              </div>
            </div>

            {/* Routes & Radius */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">
                Routes & Service Area
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* From Address */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    From Address
                  </label>
                  <input
                    type="text"
                    value={fromAddress}
                    onChange={(e) => setFromAddress(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter starting location"
                  />
                  {/* From Radius */}
                  <div className="mt-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      From Radius (km)
                    </label>
                    <input
                      type="number"
                      value={fromRadius}
                      onChange={(e) => setFromRadius(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="0"
                    />
                  </div>
                </div>

                {/* To Address */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    To Address
                  </label>
                  <input
                    type="text"
                    value={toAddress}
                    onChange={(e) => setToAddress(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter destination"
                  />
                  {/* To Radius */}
                  <div className="mt-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      To Radius (km)
                    </label>
                    <input
                      type="number"
                      value={toRadius}
                      onChange={(e) => setToRadius(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="0"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Availability */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">
                Availability & Schedule
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Ready Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Availability
                  </label>
                  <select
                    value={readyType}
                    onChange={(e) => setReadyType(e.target.value as "ready_from" | "always")}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="ready_from">Ready From</option>
                    <option value="always">Always Ready</option>
                  </select>
                </div>

                {/* Ready Interval */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Schedule
                  </label>
                  <select
                    value={readyInterval}
                    onChange={(e) => setReadyInterval(e.target.value as any)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="every_day">Every Day</option>
                    <option value="in_working_days">Working Days Only</option>
                    <option value="twice_a_week">Twice a Week</option>
                    <option value="every_week">Every Week</option>
                    <option value="every_month">Every Month</option>
                    <option value="often">Often</option>
                    <option value="contract_based">Contract Based</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Pricing */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">
                Pricing
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Price */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price ({t.common.som})
                  </label>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter price"
                  />
                </div>

                {/* VAT Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    VAT Type
                  </label>
                  <div className="flex space-x-4 mt-2">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="vatType"
                        checked={withVat}
                        onChange={() => setWithVat(true)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                      />
                      <span className="ml-2 text-sm text-gray-700">{t.common.withVat}</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="vatType"
                        checked={!withVat}
                        onChange={() => setWithVat(false)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                      />
                      <span className="ml-2 text-sm text-gray-700">{t.common.withoutVat}</span>
                    </label>
                  </div>
                </div>

                {/* Cash Amount */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cash Amount ({t.common.som})
                  </label>
                  <input
                    type="number"
                    value={cash}
                    onChange={(e) => setCash(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter cash amount"
                  />
                </div>
              </div>
            </div>

            {/* GPS Monitoring */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">
                GPS Monitoring
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* GPS Enabled */}
                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={gpsEnabled}
                      onChange={(e) => setGpsEnabled(e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm font-medium text-gray-700">
                      Enable GPS Monitoring
                    </span>
                  </label>
                </div>

                {/* GPS Provider */}
                {gpsEnabled && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      GPS Provider
                    </label>
                    <input
                      type="text"
                      value={gpsProvider}
                      onChange={(e) => setGpsProvider(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter GPS provider name"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end space-x-3">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isLoading}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <span className="flex items-center">
                <svg
className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
fill="none"
viewBox="0 0 24 24">
                  <circle
className="opacity-25"
cx="12"
cy="12"
r="10"
stroke="currentColor"
strokeWidth="4"></circle>
                  <path
className="opacity-75"
fill="currentColor"
d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving...
              </span>
            ) : (
              "Save Changes"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TruckUpdateForm;
