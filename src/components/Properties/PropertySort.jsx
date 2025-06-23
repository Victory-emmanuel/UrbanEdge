import { useState } from "react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";

const PropertySort = ({ onSortChange, initialSort = "newest" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedSort, setSelectedSort] = useState(initialSort);

  const sortOptions = [
    { value: "newest", label: "Newest" },
    { value: "price_low", label: "Price: Low to High" },
    { value: "price_high", label: "Price: High to Low" },
    { value: "beds_high", label: "Most Bedrooms" },
    { value: "size_high", label: "Largest Size" },
  ];

  const handleSortChange = (value) => {
    setSelectedSort(value);
    setIsOpen(false);
    onSortChange(value);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full px-4 py-2 bg-white dark:bg-brown-dark rounded-lg shadow-md text-brown-dark dark:text-beige-light"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span>
          Sort:{" "}
          {sortOptions.find((option) => option.value === selectedSort)?.label}
        </span>
        <ChevronDownIcon
          className={`h-5 w-5 transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white dark:bg-brown-dark rounded-lg shadow-lg">
          <ul className="py-1" role="listbox" aria-labelledby="sort-button">
            {sortOptions.map((option) => (
              <li
                key={option.value}
                role="option"
                aria-selected={selectedSort === option.value}
                className={`px-4 py-2 cursor-pointer hover:bg-beige-light dark:hover:bg-brown transition-colors ${
                  selectedSort === option.value
                    ? "bg-beige-light dark:bg-brown text-brown-dark dark:text-beige-light"
                    : "text-brown-dark dark:text-beige-light"
                }`}
                onClick={() => handleSortChange(option.value)}
              >
                {option.label}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default PropertySort;
