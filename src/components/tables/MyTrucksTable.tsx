import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGetMyTrucksQuery, useUpdateTruckMutation, useDeleteTruckMutation, useUpdateTruckStatusMutation } from "@/api/trucksApi";
import type { Truck, LocalizedString } from "@/types/models/carrier/truck";
import { useLocalization } from "@/hooks/useLocalization";
import type { TruckOptions } from "@/types/models/carrier/truckoptions";
import TruckUpdateForm from "@/components/forms/TruckUpdateForm";

// Component for displaying truckOption name
const TruckOptionName: React.FC<{ truckOption?: Truck["truckOption"] }> = ({
  truckOption,
}) => {
  const { getLocalizedText, t } = useLocalization();

  const truckOptionData: TruckOptions = truckOption as TruckOptions;

  if (!truckOption) return <span>{t.common.notSpecified}</span>;

  if (typeof truckOption === "object") {
    return (
      <span>{getLocalizedText(truckOption.name, t.common.notSpecified)}</span>
    );
  }

  if (typeof truckOption === "string" && truckOptionData) {
    return (
      <span>
        {getLocalizedText(truckOptionData.name, t.common.notSpecified)}
      </span>
    );
  }

  return <span>{truckOption}</span>;
};

// Component for displaying owner name from profile
const OwnerName: React.FC<{
  profile: Truck["profile"];
}> = ({ profile }) => {
  const { t } = useLocalization();

  if (!profile) return <span>{t.common.notSpecified}</span>;

  if (typeof profile === "object") {
    return (
      <div className="text-xs text-gray-600">
        {profile.companyName || profile.fullName || t.common.notSpecified}
      </div>
    );
  }

  return <span>{t.common.notSpecified}</span>;
};



const MyTrucksTable: React.FC = () => {
  const navigate = useNavigate();
  const { t, getLocalizedText } = useLocalization();
  const [editingTruck, setEditingTruck] = useState<Truck | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Get user's own trucks
  const {
    data: trucks,
    isLoading,
    error,
  } = useGetMyTrucksQuery();

  // Mutations
  const [updateTruck, { isLoading: isUpdating }] = useUpdateTruckMutation();
  const [deleteTruck, { isLoading: isDeleting }] = useDeleteTruckMutation();
  const [updateTruckStatus, { isLoading: isUpdatingStatus }] = useUpdateTruckStatusMutation();

  const handleTruckClick = (truckId: string) => {
    navigate(`/trucks/${truckId}`);
  };

  const handleEditClick = (truck: Truck) => {
    setEditingTruck(truck);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setEditingTruck(null);
  };

  const handleSaveTruck = async (updates: Partial<Truck>) => {
    if (!editingTruck?._id) return;

    try {
      await updateTruck({ id: editingTruck._id, updates }).unwrap();
      handleCloseEditModal();
    } catch (error) {
      console.error('Failed to update truck:', error);
    }
  };

  const handleToggleStatus = async (truck: Truck) => {
    if (!truck._id) return;

    try {
      await updateTruckStatus({ 
        id: truck._id, 
        isActive: !truck.isActive 
      }).unwrap();
    } catch (error) {
      console.error('Failed to toggle truck status:', error);
    }
  };

  const handleDeleteTruck = async (truckId: string) => {
    if (!window.confirm(t.myItems.actions.confirmDelete)) return;

    try {
      await deleteTruck(truckId).unwrap();
    } catch (error) {
      console.error('Failed to delete truck:', error);
    }
  };

  const formatCapacity = (capacity?: number) => {
    if (!capacity) return t.common.notSpecified;
    return `${capacity} ${t.common.ton}`;
  };

  const formatVolume = (volume?: number) => {
    if (!volume) return t.common.notSpecified;
    return `${volume} м³`;
  };

  const formatDimensions = (dimensions: Truck["dimensions"]) => {
    if (!dimensions) return t.common.notSpecified;
    return `${dimensions.length}×${dimensions.width}×${dimensions.height}`;
  };

  const formatPrice = (truck: Truck) => {
    if (!truck.pricing) return t.common.negotiable;
    const price = truck.pricing.withVat || truck.pricing.withoutVat;
    if (!price) return t.common.negotiable;
    return `${price} ${t.common.som} ${truck.pricing.withVat ? t.common.withVat : t.common.withoutVat}`;
  };

  const getStatusText = (readyType?: Truck["readyType"]) => {
    if (!readyType) return t.status.notSpecified;
    
    switch (readyType.type) {
      case "ready_from": return t.status.readyFrom;
      case "always": return t.status.always;
      default: return t.status.statusError;
    }
  };

  const getObjectName = (
    obj: any,
    fallback: string = t.common.notSpecified
  ): string => {
    if (!obj) return fallback;

    if (typeof obj === "string") return obj;

    if (typeof obj === "object") {
      if (obj.name) {
        if (typeof obj.name === "string") return obj.name;
        if (typeof obj.name === "object") {
          return getLocalizedText(obj.name, fallback);
        }
      }

      if (obj.ru || obj.en || obj.uz || obj.kz || obj.kaa) {
        return getLocalizedText(obj, fallback);
      }
    }

    return fallback;
  };

  const getLoadTypesBadges = (
    types?: (string | { _id: string; name: LocalizedString; __v?: number })[]
  ) => {
    if (!types || types.length === 0) return null;

    return (
      <div className="flex flex-wrap gap-1 mt-1">
        {types.slice(0, 2).map((type, index) => (
          <span
            key={index}
            className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-700"
          >
            {getObjectName(type, t.common.typeLabel)}
          </span>
        ))}
        {types.length > 2 && (
          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-gray-200 text-gray-600">
            +{types.length - 2}
          </span>
        )}
      </div>
    );
  };

  const getFeaturesList = (features: Truck["features"]) => {
    const featuresList = [];
    if (features.tailgate) featuresList.push("Dogload");
    if (features.hydraulicLift) featuresList.push("Hydraulic lift");
    if (features.cones) featuresList.push("Cones");
    
    return featuresList.length > 0 ? featuresList.join(", ") : t.common.notSpecified;
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <div
key={i}
className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <h3 className="text-red-800 font-medium">
            Error loading trucks
          </h3>
          <p className="text-red-600 text-sm mt-1">
            Failed to load truck data. Please try again.
          </p>
        </div>
      </div>
    );
  }

  if (!trucks || trucks.length === 0) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">🚛</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {t.myItems.trucks.emptyTitle}
          </h3>
          <p className="text-gray-500 mb-4">{t.myItems.trucks.emptyMessage}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-sm rounded-lg overflow-hidden">
      {/* Table Header */}
      <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
        <div>
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            {t.myItems.trucks.title}
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            {t.myItems.trucks.subtitle}{trucks.length}
          </p>
        </div>
      </div>

      {/* Edit Modal */}
      {editingTruck && (
        <TruckUpdateForm
          truck={editingTruck}
          isOpen={isEditModalOpen}
          onClose={handleCloseEditModal}
          onSave={handleSaveTruck}
          isLoading={isUpdating}
        />
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Truck Details
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider w-1/3">
                Specifications
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Price
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                From
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                To
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Status
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {trucks.map((truck) => (
              <tr 
                key={truck._id} 
                className="hover:bg-gray-50 transition-colors cursor-pointer"
                onClick={() => truck._id && handleTruckClick(truck._id)}
              >
                {/* Truck Details */}
                <td className="px-4 py-4">
                  <div className="flex flex-col">
                    <div className="text-sm font-medium text-gray-900">
                      <TruckOptionName truckOption={truck.truckOption} />
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {truck.truckNumber || t.common.notSpecified}
                    </div>
                    <div className="text-xs font-medium text-blue-600 mt-1">
                      {truck.trailerType.replace(/_/g, ' ')}
                    </div>
                    <OwnerName profile={truck.profile} />
                  </div>
                </td>

                {/* Specifications */}
                <td className="px-6 py-4">
                  <div className="space-y-1">
                    <div className="text-xs text-gray-600">
                      <span className="font-medium">Capacity:</span> {formatCapacity(truck.loadCapacity)}
                    </div>
                    <div className="text-xs text-gray-600">
                      <span className="font-medium">Volume:</span> {formatVolume(truck.volume)}
                    </div>
                    <div className="text-xs text-gray-600">
                      <span className="font-medium">Dimensions:</span> {formatDimensions(truck.dimensions)}
                    </div>
                    {truck.loadTypes && (
                      <div>
                        <span className="text-xs text-gray-500">Load Types:</span>
                        {getLoadTypesBadges(truck.loadTypes)}
                      </div>
                    )}
                    <div className="text-xs text-gray-600">
                      <span className="font-medium">Features:</span> {getFeaturesList(truck.features)}
                    </div>
                  </div>
                </td>

                {/* Price */}
                <td className="px-4 py-4">
                  <div className="text-sm font-medium text-gray-900">
                    {formatPrice(truck)}
                  </div>
                  {truck.pricing?.pricingType && (
                    <div className="text-xs text-gray-500 mt-1">
                      {getObjectName(truck.pricing.pricingType, t.common.pricingType)}
                    </div>
                  )}
                </td>

                {/* From */}
                <td className="px-4 py-4">
                  <div className="text-sm text-gray-900">
                    {truck.fromAddress?.display_name || t.common.notSpecified}
                  </div>
                  {truck.fromRadius && (
                    <div className="text-xs text-gray-500 mt-1">
                      Radius: {truck.fromRadius} km
                    </div>
                  )}
                </td>

                {/* To */}
                <td className="px-4 py-4">
                  <div className="text-sm text-gray-900">
                    {truck.toAddress?.display_name || t.common.notSpecified}
                  </div>
                  {truck.toRadius && (
                    <div className="text-xs text-gray-500 mt-1">
                      Radius: {truck.toRadius} km
                    </div>
                  )}
                </td>

                {/* Status */}
                <td className="px-4 py-4">
                  <span
className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    truck.isActive 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {truck.isActive ? t.status.active : t.status.inactive}
                  </span>
                  <div className="text-xs text-gray-500 mt-1">
                    {getStatusText(truck.readyType)}
                  </div>
                  {truck.readyType.interval && (
                    <div className="text-xs text-gray-500 mt-1">
                      {truck.readyType.interval.replace(/_/g, ' ')}
                    </div>
                  )}
                </td>

                {/* Actions */}
                <td
className="px-4 py-4"
onClick={(e) => e.stopPropagation()}>
                  <div className="flex flex-col space-y-1">
                    <button
                      className="text-green-600 hover:text-green-800 text-sm font-medium text-left disabled:opacity-50"
                      onClick={() => handleEditClick(truck)}
                      disabled={isUpdating}
                    >
                      {t.myItems.actions.edit}
                    </button>
                    <button
                      className={`text-sm font-medium text-left disabled:opacity-50 ${
                        truck.isActive 
                          ? 'text-orange-600 hover:text-orange-800' 
                          : 'text-green-600 hover:text-green-800'
                      }`}
                      onClick={() => handleToggleStatus(truck)}
                      disabled={isUpdatingStatus}
                    >
                      {isUpdatingStatus 
                        ? "Updating..." 
                        : truck.isActive 
                          ? t.myItems.actions.deactivate 
                          : t.myItems.actions.activate
                      }
                    </button>
                    <button
                      className="text-red-600 hover:text-red-800 text-sm font-medium text-left disabled:opacity-50"
                      onClick={() => truck._id && handleDeleteTruck(truck._id)}
                      disabled={isDeleting}
                    >
                      {isDeleting ? "Deleting..." : t.myItems.actions.delete}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Summary */}
      <div className="bg-gray-50 px-4 py-3 border-t border-gray-200">
        <div className="text-sm text-gray-700">
          {t.myItems.trucks.yourTrucks}<span className="font-medium">{trucks.length}</span>
        </div>
      </div>
    </div>
  );
};

export default MyTrucksTable;
