import React from "react";

const Banner = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-4 sm:p-6 lg:p-8 font-sans">
      <div className="max-w-4xl mx-auto">
        {/* Top Tag */}
        <div className="flex items-center bg-gray-800 text-yellow-400 px-4 py-2 rounded-full text-xs sm:text-sm font-medium mb-6 sm:mb-8 w-fit border border-gray-700 shadow-md">
          <svg
            className="w-4 h-4 sm:w-5 sm:h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
            ></path>
          </svg>
          MULTI-CHANNEL EMPLOYEE COMMUNICATIONS PLATFORM
        </div>

        {/* Main Heading */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6 sm:mb-8">
          Eliminate Chaos, Simplify Communications, Shine
        </h1>

        {/* Description Paragraph 1 */}
        <p className="text-base sm:text-lg lg:text-xl text-gray-300 mb-4 sm:mb-6 leading-relaxed">
          Save up to 10 hours a week by Unifying, Automating and Streamlining
          internal communications with our multi-channel employee communication
          platform.
        </p>

        {/* Description Paragraph 2 */}
        <p className="text-base sm:text-lg lg:text-xl text-gray-300 mb-8 sm:mb-10 leading-relaxed">
          Reach employees anywhere, anytime. Measure the impact of every
          message. Boost overall employee productivity.
        </p>

        {/* Request Demo Button */}
        <button className="px-6 py-3 sm:px-8 sm:py-4 bg-transparent border-2 border-yellow-400 text-yellow-400 font-semibold rounded-lg hover:bg-yellow-400 hover:text-gray-900 transition duration-300 ease-in-out shadow-lg">
          Request Demo
        </button>
      </div>
    </div>
  );
};

export default Banner;
