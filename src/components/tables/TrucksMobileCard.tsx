import * as React from "react";
import { useNavigate } from "react-router-dom";
import { useGetAllTrucksQuery, useFilterTrucksQuery } from "@/api/trucksApi";
import type { Truck } from "@/types/models/carrier/truck";
import type { TruckOptions } from "@/types/models/carrier/truckoptions";
import { useLocalization } from "@/hooks/useLocalization";
import TrucksFilter from "@/components/filters/TrucksFilter";
import { useTrucksFilter } from "@/hooks/useTrucksFilter";
import {
  Truck as TruckIcon,
  Weight,
  Building,
  User,
  Package,
  XCircle,
  ChevronDown,
  Filter,
} from "lucide-react";

// Component for displaying truck option name
const TruckOptionName: React.FC<{ truckOption?: Truck["truckOption"] }> = ({
  truckOption,
}) => {
  const { getLocalizedText, t } = useLocalization();

  const truckOptionData: TruckOptions = truckOption as TruckOptions;

  if (!truckOption) return <span>{t.common.notSpecified}</span>;

  if (typeof truckOption === "object") {
    return <span>{getLocalizedText(truckOption.name, t.common.notSpecified)}</span>;
  }

  if (typeof truckOption === "string" && truckOptionData) {
    return <span>{getLocalizedText(truckOptionData.name, t.common.notSpecified)}</span>;
  }

  return <span>{truckOption}</span>;
};

// Component for displaying owner name
const OwnerName: React.FC<{
  profile: Truck["profile"];
}> = ({ profile }) => {
  const { t } = useLocalization();

  if (!profile) return <span>{t.common.notSpecified}</span>;

  if (typeof profile === "object") {
    if (profile.companyName) {
      return (
        <div className="flex items-center gap-1 text-xs text-gray-600">
          <Building size={12} />
          {profile.companyName}
        </div>
      );
    } else if (profile.fullName) {
      return (
        <div className="flex items-center gap-1 text-xs text-gray-600">
          <User size={12} />
          {profile.fullName}
        </div>
      );
    }
  }

  return <span>{t.common.notSpecified}</span>;
};

const TrucksMobileCard: React.FC = () => {
  const navigate = useNavigate();
  const { t, getLocalizedText } = useLocalization();
  const [showFilters, setShowFilters] = React.useState(false);

  // Filters
  const { filters, cleanFilters, hasActiveFilters, updateFilters } = useTrucksFilter();

  // Conditional queries - either with filters or all trucks
  const {
    data: filteredTrucks,
    isLoading: isFilterLoading,
    error: filterError,
  } = useFilterTrucksQuery(cleanFilters, {
    skip: !hasActiveFilters,
  });

  const {
    data: allTrucks,
    isLoading: isAllLoading,
    error: allError,
  } = useGetAllTrucksQuery(undefined, {
    skip: hasActiveFilters,
  });

  // Determine which data to use
  const trucks = hasActiveFilters ? filteredTrucks || [] : allTrucks || [];
  const isLoading = hasActiveFilters ? isFilterLoading : isAllLoading;
  const error = hasActiveFilters ? filterError : allError;

  const handleTruckClick = (truckId: string) => {
    navigate(`/trucks/${truckId}`);
  };

  const formatPrice = (truck: Truck) => {
    if (!truck.pricing) return t.common.negotiable;
    const price = truck.pricing.withVat || truck.pricing.withoutVat;
    if (!price) return t.common.negotiable;
    return `${price}`;
  };
  const trailerTypeOptions = [
    { value: "truck", label: t.postTruck.trailerTypes.truck },
    { value: "trailer", label: t.postTruck.trailerTypes.trailer },
    { value: "semi_trailer", label: t.postTruck.trailerTypes.semiTrailer },
  ];
  const getPricingType = (truck: Truck) => {
    if (!truck.pricing?.pricingType) return null;
    if (typeof truck.pricing.pricingType === "object" && truck.pricing.pricingType.name) {
      return getLocalizedText(truck.pricing.pricingType.name, "");
    }
    if (typeof truck.pricing.pricingType === "string") {
      return truck.pricing.pricingType;
    }
    return null;
  };

  if (isLoading) {
    return (
      <div className="p-4 space-y-4">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-lg border border-gray-200 p-4"
              >
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <XCircle
              className="text-red-500 mr-2"
              size={20}
            />
            <h3 className="text-red-800 font-medium">{t.common.error}</h3>
          </div>
          <p className="text-red-600 text-sm mt-1">{t.common.error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Filter Toggle Button */}
      <div className="p-4 pb-2">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="w-full flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Filter
              size={16}
              className="text-gray-600"
            />
            <span className="text-sm font-medium text-gray-700">Фильтры</span>
            {hasActiveFilters && (
              <span className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full">
                {Object.keys(cleanFilters).length}
              </span>
            )}
          </div>
          <ChevronDown
            size={16}
            className={`text-gray-600 transition-transform ${
              showFilters ? "rotate-180" : ""
            }`}
          />
        </button>

        {/* Collapsible Filter Section */}
        {showFilters && (
          <div className="mt-2">
            <TrucksFilter
              currentFilters={filters}
              onFiltersChange={updateFilters}
            />
          </div>
        )}
      </div>

      {/* Results Count */}
      <div className="px-4 py-2">
        <p className="text-sm text-gray-600">
          {trucks.length} {trucks.length === 1 ? "грузовик" : "грузовиков"}
          {hasActiveFilters && " • отфильтровано"}
        </p>
      </div>

      {/* Trucks List */}
      {trucks.length === 0 ? (
        <div className="p-6">
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">🚛</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {hasActiveFilters ? "Ничего не найдено" : "Нет доступных грузовиков"}
            </h3>
            <p className="text-gray-500">
              {hasActiveFilters
                ? "Попробуйте изменить параметры поиска"
                : "Пока что нет доступных грузовиков"}
            </p>
          </div>
        </div>
      ) : (
        <div className="p-4 pt-0 space-y-3">
          {trucks.map((truck) => (
            <div
              key={truck._id}
              onClick={() => truck._id && handleTruckClick(truck._id)}
              className="bg-white rounded-lg border border-gray-200 p-3 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
            >
              {/* Header - Truck Type & Number */}
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <TruckIcon
                      className="text-blue-600"
                      size={16}
                    />
                    <h3 className="font-semibold text-gray-900 text-base">
                      {
                        trailerTypeOptions.find(
                          (option) => option.value === truck.trailerType
                        )?.label
                      }
                    </h3>
                  </div>
                  <p className="text-sm text-gray-600 font-mono">№ {truck.truckNumber}</p>
                  <p className="text-sm text-gray-600 font-mono">
                    Кузов: <TruckOptionName truckOption={truck.truckOption} />
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-blue-600">
                    {formatPrice(truck)}
                  </div>
                  {(() => {
                    const pricingType = getPricingType(truck);
                    const vatInfo = truck.pricing?.withVat
                      ? t.common.withVat
                      : truck.pricing?.withoutVat
                      ? t.common.withoutVat
                      : null;

                    return (
                      <div className="text-xs text-gray-500 mt-1 space-y-0.5">
                        {pricingType && <div>{pricingType}</div>}
                        {vatInfo && <div>{vatInfo}</div>}
                      </div>
                    );
                  })()}
                </div>
              </div>

              {/* Specs Row - Compact */}
              <div className="flex items-center gap-4 mb-2 text-sm text-gray-600">
                <span className="flex items-center gap-1">
                  <Weight size={12} />
                  {truck.loadCapacity} {t.common.ton || "t"}
                </span>
                <span className="flex items-center gap-1">
                  <Package size={12} />
                  {truck.volume} м³
                </span>
              </div>

              {/* Route Information - Compact */}
              <div className="mb-2">
                <div className="text-sm text-gray-600">
                  <div className="flex items-center gap-1 mb-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>
                      {truck.fromAddress?.display_place ||
                        truck.fromAddress?.country ||
                        t.common.notSpecified}
                    </span>
                    <span className="mx-1">→</span>
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span>
                      {truck.toAddress?.display_place ||
                        truck.toAddress?.country ||
                        t.common.notSpecified}
                    </span>
                  </div>
                </div>
              </div>

              {/* Footer - Owner info */}
              <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                <OwnerName profile={truck.profile} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TrucksMobileCard;
