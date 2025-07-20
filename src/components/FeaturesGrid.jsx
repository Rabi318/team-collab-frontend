// FeaturesGrid.jsx
import React from "react";

function FeaturesGrid() {
  const features = [
    {
      name: "AI Content Generation",
      icon: (
        <svg
          className="w-6 h-6 sm:w-7 sm:h-7 text-red-500 group-hover:text-white transition-colors duration-300"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M9.663 17h4.673M12 3v14m-7 0h14a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2z"
          ></path>
        </svg>
      ),
    },
    {
      name: "User Submissions",
      icon: (
        <svg
          className="w-6 h-6 sm:w-7 sm:h-7 text-red-500 group-hover:text-white transition-colors duration-300"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
          ></path>
        </svg>
      ),
    },
    {
      name: "Content Scheduling",
      icon: (
        <svg
          className="w-6 h-6 sm:w-7 sm:h-7 text-purple-500 group-hover:text-white transition-colors duration-300"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          ></path>
        </svg>
      ),
    },
    {
      name: "Personalization & Targeting",
      icon: (
        <svg
          className="w-6 h-6 sm:w-7 sm:h-7 text-green-500 group-hover:text-white transition-colors duration-300"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H2v-2a3 3 0 015.356-1.857M9 20v-2m3 2v-2m3 2V8m-9 12h9V8h-9v12zm7-12h3v10h-3V8z"
          ></path>
        </svg>
      ),
    },
    {
      name: "Read Acknowledgements",
      icon: (
        <svg
          className="w-6 h-6 sm:w-7 sm:h-7 text-yellow-600 group-hover:text-white transition-colors duration-300"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
          ></path>
        </svg>
      ),
    },
    {
      name: "Custom Menus",
      icon: (
        <svg
          className="w-6 h-6 sm:w-7 sm:h-7 text-purple-600 group-hover:text-white transition-colors duration-300"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M4 6h16M4 12h16M4 18h16"
          ></path>
        </svg>
      ),
    },
    {
      name: "Events and Livestreaming",
      icon: (
        <svg
          className="w-6 h-6 sm:w-7 sm:h-7 text-yellow-500 group-hover:text-white transition-colors duration-300"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.329 1.176l1.519 4.674c.3.921-.755 1.688-1.539 1.175l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.513-1.838-.254-1.539-1.175l1.519-4.674a1 1 0 00-.329-1.176l-3.976-2.888c-.784-.57-.381-1.81.588-1.81h4.915a1 1 0 00.95-.69l1.519-4.674z"
          ></path>
        </svg>
      ),
    },
    {
      name: "Multi-channel Notifications",
      icon: (
        <svg
          className="w-6 h-6 sm:w-7 sm:h-7 text-blue-500 group-hover:text-white transition-colors duration-300"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          ></path>
        </svg>
      ),
    },
    {
      name: "Semantic AI Search",
      icon: (
        <svg
          className="w-6 h-6 sm:w-7 sm:h-7 text-red-500 group-hover:text-white transition-colors duration-300"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          ></path>
        </svg>
      ),
    },
    {
      name: "Comments & Reactions",
      icon: (
        <svg
          className="w-6 h-6 sm:w-7 sm:h-7 text-yellow-500 group-hover:text-white transition-colors duration-300"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
          ></path>
        </svg>
      ),
    },
    {
      name: "Points and Gift Cards",
      icon: (
        <svg
          className="w-6 h-6 sm:w-7 sm:h-7 text-red-500 group-hover:text-white transition-colors duration-300"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          ></path>
        </svg>
      ),
    },
    {
      name: "30+ Languages",
      icon: (
        <svg
          className="w-6 h-6 sm:w-7 sm:h-7 text-orange-500 group-hover:text-white transition-colors duration-300"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 018.666 15c-2.403 0-4.517-.61-6.374-1.766M14 10l-2 2m0 0l-2-2m2 2v2.5M14 10h4.085a3 3 0 013 3v8a3 3 0 01-3 3H3a3 3 0 01-3-3v-8a3 3 0 013-3h4M7 13h2.828l-3.95-3.95m0 0A7.95 7.95 0 0121 12c0 7.328-4.855 11.023-12 11.023S0 19.328 0 12c0-3.042 1.135-5.824 3 7.95"
          ></path>
        </svg>
      ),
    },
  ];

  return (
    <div className="bg-yellow-50 py-12 sm:py-16 lg:py-20 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Main Heading */}
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight mb-6 sm:mb-8">
          Powerful Features for Every Organization
        </h2>

        {/* Description */}
        <p className="text-base sm:text-lg lg:text-xl text-gray-700 mb-10 sm:mb-12 max-w-3xl mx-auto leading-relaxed">
          HubEngage's employee communication platform features an extensive,
          adaptable toolset designed for organizations of all sizes and
          industries. Whether you're a small business or a large enterprise, our
          customizable tools help you implement your{" "}
          <span className="font-semibold text-gray-800">
            internal communications strategy
          </span>
          , boost engagement, and drive lasting connections and productivity
          —all through one platform.
        </p>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group flex items-center p-4 sm:p-6 bg-white rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300 ease-in-out cursor-pointer border border-gray-200 hover:bg-blue-600"
            >
              <div className="flex-shrink-0 mr-4 sm:mr-6">{feature.icon}</div>
              <p className="text-lg sm:text-xl font-semibold text-gray-800 group-hover:text-white transition-colors duration-300">
                {feature.name}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default FeaturesGrid;
