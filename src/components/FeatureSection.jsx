// FeatureSection.jsx
import React from "react";

function FeatureSection() {
  const imageUrl =
    "https://www.hubengage.com/wp-content/uploads/2022/12/translation.png.webp";

  return (
    <div className="bg-gray-100 py-12 sm:py-16 lg:py-20 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center justify-between gap-8">
        {/* Left Side: Image */}
        <div className="w-full lg:w-1/2 flex justify-center lg:justify-start">
          <img
            src={imageUrl}
            alt="Translation Feature"
            className="rounded-lg shadow-xl max-w-full h-auto object-contain"
            onError={(e) => {
              e.target.onerror = null; // Prevents infinite loop if fallback also fails
              e.target.src = `https://placehold.co/600x400/cccccc/333333?text=Image+Not+Found`;
            }}
          />
        </div>

        {/* Right Side: Text Content */}
        <div className="w-full lg:w-1/2 text-center lg:text-left">
          {/* Heading */}
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight mb-6 sm:mb-8">
            Effortless AI Automation, Smarter Communication
          </h2>

          {/* Description */}
          <p className="text-base sm:text-lg lg:text-xl text-gray-700 mb-8 sm:mb-10 leading-relaxed">
            Streamline your communication process with the power of AI.
            HubEngage automates content creation, scheduling, and translation,
            ensuring employees receive information in their preferred language.
            AI-driven moderation and insights make managing content seamless,
            while AI search and summaries provide employees with instant,
            accurate answers.
          </p>

          {/* Call to Action Button */}
          <button className="px-6 py-3 sm:px-8 sm:py-4 bg-blue-700 text-white font-semibold rounded-lg hover:bg-blue-800 transition duration-300 ease-in-out shadow-md">
            Learn More
          </button>
        </div>
      </div>
    </div>
  );
}

export default FeatureSection;
