import React from "react";
import { X } from "lucide-react";
const Modal = ({ children, onClose }) => {
  return (
    <div
      className="fixed inset-0  bg-opacity-25 flex items-center justify-center p-4 z-[100]" // Increased z-index
      onClick={onClose} // Close modal when clicking outside content
    >
      <div
        className="bg-white rounded-lg shadow-xl p-6 sm:p-8 w-full max-w-md relative"
        onClick={(e) => e.stopPropagation()} // Prevent click from bubbling to backdrop
      >
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 focus:outline-none"
          onClick={onClose}
          aria-label="Close"
        >
          <X className="w-6 h-6 cursor-pointer" />
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
