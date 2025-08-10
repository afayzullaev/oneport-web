import React, { useState } from "react";
import { useLocalization } from "@/hooks/useLocalization";
import type { Order } from "@/types/models/cargoOwner/order";

interface OrderUpdateFormProps {
  order: Order;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updates: Partial<Order>) => void;
  isLoading: boolean;
}

const OrderUpdateForm: React.FC<OrderUpdateFormProps> = ({
  order,
  isOpen,
  onClose,
  onSave,
  isLoading,
}) => {
  const { t } = useLocalization();

  // Basic Information
  const [loadName, setLoadName] = useState(order.loadName || "");
  const [bid, setBid] = useState<"yes" | "ask">(order.bid || "yes");
  const [weight, setWeight] = useState(order.weight?.toString() || "");
  const [weightUnit, setWeightUnit] = useState<"kg" | "ton">(order.weightUnit || "kg");
  const [volume, setVolume] = useState(order.volume?.toString() || "");

  // Dimensions
  const [length, setLength] = useState(order.dimensions?.length?.toString() || "");
  const [width, setWidth] = useState(order.dimensions?.width?.toString() || "");
  const [height, setHeight] = useState(order.dimensions?.height?.toString() || "");

  // Load Status
  const [loadStatusState, setLoadStatusState] = useState<"ready_from" | "always" | "not_ready">(
    order.loadStatus?.state || "ready_from"
  );
  const [loadStatusInterval, setLoadStatusInterval] = useState<
    "every_day" | "in_working_days" | "every_month" | "twice_a_week" | "every_week"
  >(order.loadStatus?.interval || "every_day");

  // Addresses
  const [loadAddress, setLoadAddress] = useState(order.loadAddress?.display_name || "");
  const [unloadAddress, setUnloadAddress] = useState(order.unloadAddress?.display_name || "");

  // GPS Monitoring
  const [gpsEnabled, setGpsEnabled] = useState(order.gpsMonitoring?.enabled || false);
  const [gpsProvider, setGpsProvider] = useState(order.gpsMonitoring?.provider || "");

  // Pricing
  const [price, setPrice] = useState(
    order.pricing?.withVat?.toString() || 
    order.pricing?.withoutVat?.toString() || 
    ""
  );
  const [withVat, setWithVat] = useState(Boolean(order.pricing?.withVat));
  const [cash, setCash] = useState(order.pricing?.cash?.toString() || "");
  const [paymentWithin, setPaymentWithin] = useState(order.paymentWithin?.toString() || "");

  if (!isOpen) return null;

  const handleSave = () => {
    const updates: Partial<Order> = {};

    // Basic fields
    if (loadName.trim()) {
      updates.loadName = loadName.trim();
    }

    if (bid) {
      updates.bid = bid;
    }

    if (weight && !isNaN(Number(weight))) {
      updates.weight = Number(weight);
      updates.weightUnit = weightUnit;
    }

    if (volume && !isNaN(Number(volume))) {
      updates.volume = Number(volume);
    }

    // Dimensions
    if (length || width || height) {
      updates.dimensions = {
        length: length ? Number(length) : order.dimensions?.length || 0,
        width: width ? Number(width) : order.dimensions?.width || 0,
        height: height ? Number(height) : order.dimensions?.height || 0
      };
    }

    // Load Status
    updates.loadStatus = {
      state: loadStatusState,
      readyFrom: order.loadStatus?.readyFrom,
      interval: loadStatusInterval as any
    };

    // Addresses
    if (loadAddress.trim()) {
      updates.loadAddress = {
        osm_id: order.loadAddress?.osm_id || "",
        lat: order.loadAddress?.lat || 0,
        lon: order.loadAddress?.lon || 0,
        display_name: loadAddress.trim(),
        display_place: order.loadAddress?.display_place || "",
        display_address: order.loadAddress?.display_address || "",
        name: order.loadAddress?.name || "",
        country: order.loadAddress?.country || "",
        state: order.loadAddress?.state || "",
        county: order.loadAddress?.county || "",
        postcode: order.loadAddress?.postcode || "",
        country_code: order.loadAddress?.country_code || "",
        place_id: order.loadAddress?.place_id || ""
      };
    }

    if (unloadAddress.trim()) {
      updates.unloadAddress = {
        osm_id: order.unloadAddress?.osm_id || "",
        lat: order.unloadAddress?.lat || 0,
        lon: order.unloadAddress?.lon || 0,
        display_name: unloadAddress.trim(),
        display_place: order.unloadAddress?.display_place || "",
        display_address: order.unloadAddress?.display_address || "",
        name: order.unloadAddress?.name || "",
        country: order.unloadAddress?.country || "",
        state: order.unloadAddress?.state || "",
        county: order.unloadAddress?.county || "",
        postcode: order.unloadAddress?.postcode || "",
        country_code: order.unloadAddress?.country_code || "",
        place_id: order.unloadAddress?.place_id || ""
      };
    }

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
        pricingType: order.pricing?.pricingType || "",
        cash: cash ? Number(cash) : 0
      };
    }

    if (paymentWithin && !isNaN(Number(paymentWithin))) {
      updates.paymentWithin = Number(paymentWithin);
    }

    onSave(updates);
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[95vh] overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 bg-gray-50 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {t.myItems.actions.edit} Order
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            disabled={isLoading}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form Content */}
        <div className="overflow-y-auto max-h-[calc(95vh-120px)]">
          <div className="p-6 space-y-8">
            
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">
                {t.postCargo.cargoDetails.title}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Load Name */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t.postCargo.cargoDetails.cargoName} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={loadName}
                    onChange={(e) => setLoadName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder={t.postCargo.cargoDetails.cargoNamePlaceholder}
                    required
                  />
                </div>

                {/* Bid Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t.postCargo.cargoDetails.pricingMethod}
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
                {t.postCargo.cargoDetails.dimensions}
              </h3>
              
              {/* Weight and Volume Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Weight */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t.postCargo.cargoDetails.weight} <span className="text-red-500">*</span>
                  </label>
                  <div className="flex">
                    <input
                      type="number"
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder={t.postCargo.cargoDetails.weightPlaceholder}
                      required
                    />
                    <select
                      value={weightUnit}
                      onChange={(e) => setWeightUnit(e.target.value as "kg" | "ton")}
                      className="px-3 py-2 border-l-0 border border-gray-300 rounded-r-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                    value={volume}
                    onChange={(e) => setVolume(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder={t.postCargo.cargoDetails.volumePlaceholder}
                  />
                </div>
              </div>

              {/* Dimensions Row */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Length */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t.postCargo.cargoDetails.dimensionsLength}
                  </label>
                  <input
                    type="number"
                    value={length}
                    onChange={(e) => setLength(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder={t.postCargo.cargoDetails.weightPlaceholder}
                  />
                </div>

                {/* Width */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t.postCargo.cargoDetails.dimensionsWidth}
                  </label>
                  <input
                    type="number"
                    value={width}
                    onChange={(e) => setWidth(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder={t.postCargo.cargoDetails.weightPlaceholder}
                  />
                </div>

                {/* Height */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t.postCargo.cargoDetails.dimensionsHeight}
                  </label>
                  <input
                    type="number"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder={t.postCargo.cargoDetails.weightPlaceholder}
                  />
                </div>
              </div>
            </div>

            {/* Locations */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">
                {t.postCargo.locations.title}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Load Address */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t.postCargo.locations.pickupLocation} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={loadAddress}
                    onChange={(e) => setLoadAddress(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder={t.postCargo.locations.pickupPlaceholder}
                    required
                  />
                </div>

                {/* Unload Address */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t.postCargo.locations.deliveryLocation} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={unloadAddress}
                    onChange={(e) => setUnloadAddress(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder={t.postCargo.locations.deliveryPlaceholder}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Load Status & Timing */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">
                {t.postCargo.locations.cargoAvailability}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Load Status */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t.ordersTable.headers.status}
                  </label>
                  <select
                    value={loadStatusState}
                    onChange={(e) => setLoadStatusState(e.target.value as "ready_from" | "always" | "not_ready")}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="ready_from">{t.status.readyFrom}</option>
                    <option value="always">{t.status.always}</option>
                    <option value="not_ready">{t.status.notReady}</option>
                  </select>
                </div>

                {/* Load Status Interval */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t.postCargo.locations.frequency}
                  </label>
                  <select
                    value={loadStatusInterval}
                    onChange={(e) => setLoadStatusInterval(e.target.value as any)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="every_day">{t.postCargo.intervals.everyDay}</option>
                    <option value="in_working_days">{t.postCargo.intervals.workingDays}</option>
                    <option value="every_week">{t.postCargo.intervals.everyWeek}</option>
                    <option value="twice_a_week">{t.postCargo.intervals.twiceAWeek}</option>
                    <option value="every_month">{t.postCargo.intervals.everyMonth}</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Pricing & Payment */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">
                {t.postCargo.pricing.title}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Price */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t.ordersTable.headers.price} ({t.common.som})
                  </label>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder={t.postCargo.pricing.pricingMethodPlaceholder}
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
                    {t.postCargo.pricing.cashPayment} ({t.common.som})
                  </label>
                  <input
                    type="number"
                    value={cash}
                    onChange={(e) => setCash(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder={t.postCargo.pricing.pricingMethodPlaceholder}
                  />
                </div>

                {/* Payment Within */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t.postCargo.pricing.paymentTerms} ({t.postCargo.pricing.days})
                  </label>
                  <input
                    type="number"
                    value={paymentWithin}
                    onChange={(e) => setPaymentWithin(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder={t.postCargo.pricing.paymentTermsPlaceholder}
                  />
                </div>
              </div>
            </div>

            {/* GPS Monitoring */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">
                {t.postCargo.truckRequirements.gpsMonitoring}
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
                      {t.postCargo.truckRequirements.requireGps}
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
                      placeholder={t.postCargo.truckRequirements.gpsProviderPlaceholder}
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
            {t.postCargo.navigation.previous}
          </button>
          <button
            onClick={handleSave}
            disabled={isLoading}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {t.postCargo.navigation.posting}...
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

export default OrderUpdateForm;
