import React from "react";
import TruckDataGridTable from "@/components/tables/TruckDataGridTable";
import TrucksMobileCard from "@/components/tables/TrucksMobileCard";

const Trucks: React.FC = () => {
  const [isMobile, setIsMobile] = React.useState(() => {
    // Initialize with proper mobile detection on first render
    return typeof window !== "undefined" ? window.innerWidth < 768 : false;
  });

  React.useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Check immediately in case window size changed between initialization and effect
    checkIsMobile();

    window.addEventListener("resize", checkIsMobile);
    return () => window.removeEventListener("resize", checkIsMobile);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {isMobile ? <TrucksMobileCard /> : <TruckDataGridTable />}
    </div>
  );
};

export default Trucks;
