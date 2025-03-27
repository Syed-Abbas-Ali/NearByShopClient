import React from "react";

const Pagination = ({ totalPages, currentPage, onPageChange }) => {
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);
console.log(totalPages)
  return (
    <div className="flex items-center space-x-2 mt-4">
      <button
        onClick={() => onPageChange(currentPage - 1,totalPages)}
        disabled={currentPage === 1}
        className="px-3 py-2 bg-gray-300 rounded disabled:opacity-50"
      >
        Prev
      </button>

      {pageNumbers.map((number) => (
        <button
          key={number}
          onClick={() => onPageChange(number,totalPages)}
          className={`px-3 py-2 rounded ${
            currentPage === number ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
        >
          {number}
        </button>
      ))}

      <button
        onClick={() => onPageChange(currentPage + 1,totalPages)}
        disabled={currentPage === totalPages}
        className="px-3 py-2 bg-gray-300 rounded disabled:opacity-50"
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
