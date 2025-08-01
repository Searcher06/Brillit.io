/* eslint-disable react/prop-types */
import { faExclamationTriangle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
export function NetworkError({ error }) {
  const errorMessage = error.response.data.message.includes("getaddrinfo")
    ? "Network Error Please chech your network connection"
    : error.response.data.message;
  console.log(errorMessage);
  return (
    <div
      className="flex flex-col items-center 
        justify-center p-6  bg-gray-50 rounded-lg max-w-lg mx-auto mt-20"
    >
      <FontAwesomeIcon
        icon={faExclamationTriangle}
        className="text-4xl text-red-500 mb-4"
      />
      <h2 className="text-2xl font-semibold text-red-700">Error</h2>
      <p className="text-gray-600 text-center mb-4">{errorMessage}</p>
      <button
        className={`px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700  focus:outline-none`}
      >
        Retry
      </button>
    </div>
  );
}
