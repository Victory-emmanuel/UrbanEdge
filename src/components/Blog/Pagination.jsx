import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const renderPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5;

    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    // Add first page
    if (startPage > 1) {
      pageNumbers.push(
        <button
          key={1}
          onClick={() => onPageChange(1)}
          className="px-3 py-1 rounded-md text-brown-dark dark:text-beige-light hover:bg-beige-medium dark:hover:bg-brown transition-colors"
        >
          1
        </button>,
      );

      // Add ellipsis if needed
      if (startPage > 2) {
        pageNumbers.push(
          <span
            key="ellipsis1"
            className="px-2 text-brown-dark dark:text-beige-light"
          >
            ...
          </span>,
        );
      }
    }

    // Add page numbers
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <button
          key={i}
          onClick={() => onPageChange(i)}
          className={`px-3 py-1 rounded-md ${
            i === currentPage
              ? "bg-taupe text-white"
              : "text-brown-dark dark:text-beige-light hover:bg-beige-medium dark:hover:bg-brown transition-colors"
          }`}
        >
          {i}
        </button>,
      );
    }

    // Add last page
    if (endPage < totalPages) {
      // Add ellipsis if needed
      if (endPage < totalPages - 1) {
        pageNumbers.push(
          <span
            key="ellipsis2"
            className="px-2 text-brown-dark dark:text-beige-light"
          >
            ...
          </span>,
        );
      }

      pageNumbers.push(
        <button
          key={totalPages}
          onClick={() => onPageChange(totalPages)}
          className="px-3 py-1 rounded-md text-brown-dark dark:text-beige-light hover:bg-beige-medium dark:hover:bg-brown transition-colors"
        >
          {totalPages}
        </button>,
      );
    }

    return pageNumbers;
  };

  return (
    <div className="flex justify-center items-center space-x-2 mt-12">
      {/* Previous Button */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`p-2 rounded-md ${
          currentPage === 1
            ? "opacity-50 cursor-not-allowed text-brown/50 dark:text-beige-light/50"
            : "text-brown-dark dark:text-beige-light hover:bg-beige-medium dark:hover:bg-brown transition-colors"
        }`}
        aria-label="Previous page"
      >
        <ChevronLeftIcon className="h-5 w-5" />
      </button>

      {/* Page Numbers */}
      {renderPageNumbers()}

      {/* Next Button */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`p-2 rounded-md ${
          currentPage === totalPages
            ? "opacity-50 cursor-not-allowed text-brown/50 dark:text-beige-light/50"
            : "text-brown-dark dark:text-beige-light hover:bg-beige-medium dark:hover:bg-brown transition-colors"
        }`}
        aria-label="Next page"
      >
        <ChevronRightIcon className="h-5 w-5" />
      </button>
    </div>
  );
};

export default Pagination;
