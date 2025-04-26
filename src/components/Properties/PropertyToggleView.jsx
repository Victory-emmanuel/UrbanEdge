import { Squares2X2Icon, MapIcon } from "@heroicons/react/24/outline";

const PropertyToggleView = ({ view, onViewChange }) => {
  return (
    <div className="flex rounded-lg overflow-hidden shadow-md">
      <button
        onClick={() => onViewChange("grid")}
        className={`flex items-center justify-center px-4 py-2 ${
          view === "grid"
            ? "bg-taupe text-white"
            : "bg-white dark:bg-brown-dark text-brown-dark dark:text-beige-light"
        }`}
        aria-label="Grid view"
        aria-pressed={view === "grid"}
      >
        <Squares2X2Icon className="h-5 w-5 mr-2" />
        <span className="hidden sm:inline">Grid</span>
      </button>
      <button
        onClick={() => onViewChange("map")}
        className={`flex items-center justify-center px-4 py-2 ${
          view === "map"
            ? "bg-taupe text-white"
            : "bg-white dark:bg-brown-dark text-brown-dark dark:text-beige-light"
        }`}
        aria-label="Map view"
        aria-pressed={view === "map"}
      >
        <MapIcon className="h-5 w-5 mr-2" />
        <span className="hidden sm:inline">Map</span>
      </button>
    </div>
  );
};

export default PropertyToggleView;
