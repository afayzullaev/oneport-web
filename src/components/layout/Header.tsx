import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Search,
  Truck,
  Package2 as Cube,
  Plus,
  User,
  LogOut,
  ChevronDown,
  Building2,
} from "lucide-react";
import { useAppSelector } from "@/hooks/useAppSelector";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { logout } from "@/store/store";
import { Link, useLocation } from "react-router-dom";
import { profilesApi } from "@/api/profileApi";
import { authApi } from "@/api/authApi";
import LanguageSelector from "@/components/ui/LanguageSelector";
import { useLocalization } from "@/hooks/useLocalization";

/**
 * Application top header/navigation bar.
 * Matches the wireframe provided by the user (LogiMarket example).
 */
const Header: React.FC = () => {
  const dispatch = useAppDispatch();
  const token = useAppSelector((state) => state.authToken.token);
  const isSignedIn = Boolean(token);
  const { t } = useLocalization();
  const location = useLocation();
  
  // Dropdown state
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSignOut = () => {
    dispatch(logout());
    dispatch(authApi.util.resetApiState());
    dispatch(profilesApi.util.resetApiState());
    setIsDropdownOpen(false);
  };

  // Helper function to get nav link classes based on active state
  const getNavLinkClasses = (path: string) => {
    const isActive =
      location.pathname === path ||
      (path === "/orders" && location.pathname.startsWith("/orders")) ||
      (path === "/trucks" && location.pathname.startsWith("/trucks"));
    return `flex items-center gap-1 px-3 py-2 rounded-md transition-colors ${
      isActive
        ? "bg-blue-100 text-blue-700 font-medium"
        : "text-gray-500 hover:text-gray-900 hover:bg-gray-100"
    }`;
  };
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-white shadow-md items-center">
      <div className="w-full flex h-16 items-center justify-between px-0">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 pl-4 md:pl-8">
          <img src="/favicon.ico" alt="1Port Logo" className="h-8 w-8" />
          <span className="text-2xl font-bold text-gray-900">1Port</span>
        </Link>

        {/* Navigation - only show when signed in */}
        {isSignedIn && (
          <nav className="hidden gap-2 lg:flex">
            <Link to="/trucks" className={getNavLinkClasses("/trucks")}>
              <Search size={18} />
              <span>{t.header.findCars}</span>
            </Link>
            <Link to="/orders" className={getNavLinkClasses("/orders")}>
              <Cube size={18} />
              <span>{t.header.findCargos}</span>
            </Link>
            <Link to="/post-truck" className={getNavLinkClasses("/post-truck")}>
              <Plus size={18} />
              <span>{t.header.postCar}</span>
            </Link>
            <Link to="/post-cargo" className={getNavLinkClasses("/post-cargo")}>
              <Plus size={18} />
              <span>{t.header.postCargo}</span>
            </Link>
          </nav>
        )}

        {/* Auth Section */}
        <div className="flex items-center gap-4 mr-4 md:mr-8">
          {/* Language Selector - всегда видимый */}
          <LanguageSelector />

          {isSignedIn ? (
            // Signed in - show user dropdown menu
            <div className="relative" ref={dropdownRef}>
              <Button
                variant="outline"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2"
              >
                <User size={18} />
                <span className="hidden md:inline">{t.header.menu}</span>
                <ChevronDown 
                  size={16} 
                  className={`transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} 
                />
              </Button>
              
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50">
                  <div className="py-1">
                    <Link 
                      to="/profile" 
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <User size={16} />
                      {t.header.profile}
                    </Link>
                    
                    <Link 
                      to="/my-orders" 
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <Cube size={16} />
                      {t.pages.myOrders}
                    </Link>
                    
                    <Link 
                      to="/my-trucks" 
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <Truck size={16} />
                      {t.pages.myTrucks}
                    </Link>
                    
                    <Link 
                      to="/exporters-catalog" 
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <Building2 size={16} />
                      {t.pages.exportersCatalog}
                    </Link>
                    
                    <div className="border-t border-gray-200 my-1"></div>
                    
                    <button
                      onClick={handleSignOut}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                    >
                      <LogOut size={16} />
                      {t.header.signOut}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            // Not signed in - show sign in button
            <Link to="/login">
              <Button variant="outline" className="flex items-center gap-2">
                <User size={18} />
                {t.header.signIn}
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
