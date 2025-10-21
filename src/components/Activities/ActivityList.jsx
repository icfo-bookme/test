'use client';

import { useState, useMemo, useRef, useEffect } from "react";
import { FiFilter } from "react-icons/fi";
import ActivityCard from "./ActivityCard";
import FilterSection from "./FilterSection";

const ActivityList = ({ activities }) => {
  const [filters, setFilters] = useState({
    priceRanges: [],
    durations: [],
  });
  const [sortOption, setSortOption] = useState("");
  const [showModal, setShowModal] = useState(false);

  const modalRef = useRef(null);

  const priceRanges = useMemo(
    () => [
      { label: "Under BDT 10,000", min: 0, max: 10000 },
      { label: "BDT 10,000 - 20,000", min: 10000, max: 20000 },
      { label: "BDT 20,000 - 50,000", min: 20000, max: 50000 },
      { label: "Over BDT 50,000", min: 50000, max: Infinity },
    ],
    []
  );

  const durationRanges = useMemo(
    () => [
      { label: "0 to 30 minutes", min: 0, max: 30 },
      { label: "30 minutes to 1 hour", min: 30, max: 60 },
      { label: "1 to 5 hours", min: 60, max: 300 },
      { label: "5 hours to 1 day", min: 300, max: 1440 },
    ],
    []
  );

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showModal && modalRef.current && !modalRef.current.contains(event.target)) {
        setShowModal(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showModal]);

  const parseDurationToMinutes = (durationString) => {
    if (!durationString) return 0;
    if (durationString.includes("to")) {
      const parts = durationString.split("to");
      if (parts.length > 1) {
        durationString = parts[1].trim();
      }
    }
    let totalMinutes = 0;
    const dayMatch = durationString.match(/(\d+)\s*d/);
    if (dayMatch) totalMinutes += parseInt(dayMatch[1]) * 1440;
    const hourMatch = durationString.match(/(\d+)\s*h/);
    if (hourMatch) totalMinutes += parseInt(hourMatch[1]) * 60;
    const minuteMatch = durationString.match(/(\d+)\s*m/);
    if (minuteMatch) totalMinutes += parseInt(minuteMatch[1]);
    return totalMinutes;
  };

  const filteredActivities = useMemo(() => {
    let result = activities.filter((activity) => {
      if (filters.priceRanges.length > 0) {
        const priceRangeMatch = filters.priceRanges.some((rangeLabel) => {
          const range = priceRanges.find((r) => r.label === rangeLabel);
          const activityPrice = parseFloat(activity.final_price || activity.price || 0);
          return range && activityPrice >= range.min && activityPrice <= range.max;
        });
        if (!priceRangeMatch) return false;
      }

      if (filters.durations.length > 0) {
        const durationSummary = activity.summaries.find((s) => s.icon_name === "FaRegClock");
        const durationText = durationSummary
          ? Object.values(durationSummary).find(
              (val) => typeof val === "string" && (val.includes("h") || val.includes("m") || val.includes("d"))
            )
          : null;
        if (!durationText) return false;

        const durationMinutes = parseDurationToMinutes(durationText);
        const durationMatch = filters.durations.some((rangeLabel) => {
          const range = durationRanges.find((r) => r.label === rangeLabel);
          return range && durationMinutes >= range.min && durationMinutes <= range.max;
        });
        if (!durationMatch) return false;
      }

      return true;
    });

    if (sortOption === "price-low-high") {
      result = [...result].sort((a, b) => {
        const aPrice = parseFloat(a.final_price || a.price || 0);
        const bPrice = parseFloat(b.final_price || b.price || 0);
        return aPrice - bPrice;
      });
    } else if (sortOption === "price-high-low") {
      result = [...result].sort((a, b) => {
        const aPrice = parseFloat(a.final_price || a.price || 0);
        const bPrice = parseFloat(b.final_price || b.price || 0);
        return bPrice - aPrice;
      });
    }

    return result;
  }, [activities, filters, sortOption, priceRanges, durationRanges]);

  const handleSortChange = (e) => setSortOption(e.target.value);

  const handleFilterChange = (filterType, value) => {
    setFilters((prev) => {
      const currentFilters = [...prev[filterType]];
      const index = currentFilters.indexOf(value);
      if (index >= 0) currentFilters.splice(index, 1);
      else currentFilters.push(value);
      return { ...prev, [filterType]: currentFilters };
    });
  };

  const applyFilters = () => setShowModal(false);

  const resetFilters = () => setFilters({ priceRanges: [], durations: [] });

  return (
    <div className="px-4 md:py-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Desktop Sidebar */}
        <div className="hidden md:block col-span-1">
          <FilterSection
            priceRanges={priceRanges}
            durationRanges={durationRanges}
            filters={filters}
            handleFilterChange={handleFilterChange}
            resetFilters={resetFilters}
          />
        </div>

        {/* Main Content */}
        <div className="col-span-1 md:col-span-3">
          <div className="flex items-center justify-between pb-2">
            <h1 className="text-blue-950 md:text-xl text-sm font-bold">
              <span>{filteredActivities.length}</span> Activities Found
            </h1>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500 hidden sm:inline-block">Sort by:</span>
              <select
                value={sortOption}
                onChange={handleSortChange}
                className="px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm text-gray-700 bg-white transition-colors"
              >
                <option value="">Recommended</option>
                <option value="price-low-high">Price: Low to High</option>
                <option value="price-high-low">Price: High to Low</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {filteredActivities.length > 0 ? (
              filteredActivities.map((activity) => <ActivityCard key={activity.id} activity={activity} />)
            ) : (
              <div className="col-span-3 text-center py-10">
                <h3 className="text-lg font-medium text-gray-700">No activities match your filters</h3>
                <p className="text-gray-500 mt-2">Try adjusting your filters to see more results</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter Button */}
      <div className="md:hidden fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50">
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-5 py-2 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition"
        >
          <FiFilter size={18} />
          <span>Filters</span>
        </button>
      </div>

      {/* Mobile Filter Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center">
          <div ref={modalRef} className="bg-white w-full h-[85%] my-auto md:max-w-md md:rounded-lg overflow-y-auto">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg text-blue-950 font-semibold">Filters</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-gray-700">
                ✕
              </button>
            </div>

            <div className="p-4 relative overflow-visible">
              <FilterSection
                priceRanges={priceRanges}
                durationRanges={durationRanges}
                filters={filters}
                handleFilterChange={handleFilterChange}
                resetFilters={resetFilters}
              />
            </div>

            <div className="p-4 border-t border-gray-200 flex gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 py-3 px-4 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors text-sm font-medium"
              >
                Close
              </button>
              <button
                onClick={applyFilters}
                className="flex-1 py-3 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ActivityList;
