import React, { useState, useRef, useEffect } from 'react';
import { useLazySearchLocationsQuery } from '@/api/locationApi';
import type { LocationResult } from '@/api/locationApi';

interface LocationSelectProps {
  value?: string;
  placeholder?: string;
  onSelect: (location: LocationResult | null) => void;
  disabled?: boolean;
  className?: string;
  label?: string;
  showCountryOnly?: boolean; // If true, will show only country name in display
}

const LocationSelect: React.FC<LocationSelectProps> = ({
  value = '',
  placeholder = 'Введите название города или страны...',
  onSelect,
  disabled = false,
  className = '',
  label,
  showCountryOnly = false,
}) => {
  const [searchTerm, setSearchTerm] = useState(value);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<LocationResult | null>(null);
  const [isSelecting, setIsSelecting] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [searchLocations, { data: locations = [], isLoading, error }] = useLazySearchLocationsQuery();

  // Only sync external value on initial mount
  useEffect(() => {
    setSearchTerm(value);
  }, []); // Only run on mount

  // Handle search with debouncing
  useEffect(() => {
    if (searchTerm.length >= 2 && !isSelecting) {
      const timeoutId = setTimeout(() => {
        searchLocations(searchTerm);
        setIsOpen(true);
      }, 500);
      return () => clearTimeout(timeoutId);
    } else {
      setIsOpen(false);
    }
  }, [searchTerm, searchLocations, isSelecting]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    if (value === '') {
      setSelectedLocation(null);
      onSelect(null);
      setIsOpen(false);
    }
  };

  const handleLocationSelect = (location: LocationResult) => {
    setIsSelecting(true);
    setSelectedLocation(location);
    const displayText = showCountryOnly 
      ? location.address?.country || location.display_place
      : location.display_place;
    setSearchTerm(displayText);
    setIsOpen(false);
    onSelect(location);
    
    // Reset selecting state after a short delay
    setTimeout(() => {
      setIsSelecting(false);
    }, 100);
  };

  const handleClear = () => {
    setIsSelecting(true);
    setSearchTerm('');
    setSelectedLocation(null);
    setIsOpen(false);
    onSelect(null);
    inputRef.current?.focus();
    
    // Reset selecting state after a short delay
    setTimeout(() => {
      setIsSelecting(false);
    }, 100);
  };

  const formatLocationDisplay = (location: LocationResult): string => {
    if (showCountryOnly) {
      return location.address?.country || location.display_place;
    }

    const parts = [];
    
    if (location.display_place) {
      parts.push(location.display_place);
    }
    
    if (location.address?.state && location.address.state !== location.display_place) {
      parts.push(location.address.state);
    }
    
    if (location.address?.country && location.address.country !== location.display_place) {
      parts.push(location.address.country);
    }
    
    return parts.length > 0 ? parts.join(', ') : location.display_name;
  };

  return (
    <div
className={`relative ${className}`}
ref={dropdownRef}>
      {label && (
        <label className="block text-xs font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={searchTerm}
          onChange={handleInputChange}
          placeholder={placeholder}
          disabled={disabled}
          className={`
            w-full px-2 py-1.5 text-sm border border-gray-300 rounded
            focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500
            disabled:bg-gray-100 disabled:cursor-not-allowed
            ${selectedLocation ? 'pr-8' : 'pr-3'}
          `}
        />
        
        {selectedLocation && !disabled && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            title="Очистить"
          >
            ✕
          </button>
        )}
        
        {isLoading && (
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
          </div>
        )}
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
          {isLoading && (
            <div className="px-4 py-2 text-sm text-gray-500 text-center">
              Поиск...
            </div>
          )}
          
          {error && (
            <div className="px-4 py-2 text-sm text-red-500 text-center">
              Ошибка поиска
            </div>
          )}
          
          {!isLoading && !error && locations.length === 0 && searchTerm.length >= 2 && (
            <div className="px-4 py-2 text-sm text-gray-500 text-center">
              Ничего не найдено
            </div>
          )}
          
          {!isLoading && !error && locations.map((location) => (
            <button
              key={location.place_id}
              type="button"
              onClick={() => handleLocationSelect(location)}
              className="w-full px-4 py-2 text-left hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
            >
              <div className="text-sm font-medium text-gray-900">
                {formatLocationDisplay(location)}
              </div>
              {location.display_address && (
                <div className="text-xs text-gray-500 mt-1">
                  {location.display_address}
                </div>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LocationSelect;
