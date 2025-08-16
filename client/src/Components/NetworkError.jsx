/* eslint-disable react/prop-types */
import { AlertCircle } from "lucide-react";

export function NetworkError({ error }) {
  const errorMessage = error.response?.data?.message?.includes("getaddrinfo")
    ? "Network Error. Please check your network connection."
    : error.response?.message || "An unexpected error occurred.";
  console.log(errorMessage);
  return (
    <div className="flex flex-col items-center justify-center px-4 py-8 sm:px-8 md:px-12 bg-gray-50 rounded-lg max-w-full sm:max-w-md md:max-w-lg mx-auto mt-16 shadow-md">
      <AlertCircle className="text-red-500 w-12 h-12 mb-4" />
      <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-red-500 mb-2 text-center">
        Network Error
      </h2>
      <p className="text-gray-600 text-center mb-6 text-base sm:text-lg">
        {errorMessage}
      </p>
      <button className="w-full sm:w-auto px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none transition-colors duration-200">
        Retry
      </button>
    </div>
  );
}
