// AddOnHubs.jsx
import React from "react";
import { Award, Users, ClipboardCheck, MessageSquareText } from "lucide-react"; // Importing icons from lucide-react

function AddOnHubs() {
  const hubs = [
    {
      name: "Recognition Hub",
      description:
        "Motivate with employee recognitions and automated milestone greetings.",
      icon: Award, // Lucide icon component
      iconColor: "text-purple-600",
    },
    {
      name: "Social Hub",
      description:
        "Enterprise social network for employees to share updates and interact.",
      icon: Users, // Lucide icon component
      iconColor: "text-red-500",
    },
    {
      name: "Survey / Forms Hub",
      description:
        "Platform for employee surveys – pulse or extensive engagement surveys.",
      icon: ClipboardCheck, // Lucide icon component
      iconColor: "text-blue-500",
    },
    {
      name: "Messaging Hub",
      description:
        "Get team communication going with secure private and group messaging.",
      icon: MessageSquareText, // Lucide icon component
      iconColor: "text-teal-500",
    },
  ];

  return (
    <div className="bg-white py-12 sm:py-16 lg:py-20 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-start justify-between gap-8">
        {/* Left Side: Heading, Description, and Button */}
        <div className="w-full lg:w-2/5 text-center lg:text-left mb-8 lg:mb-0">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight mb-6 sm:mb-8">
            Add-On Hubs to Engage
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-gray-700 mb-8 sm:mb-10 leading-relaxed">
            Add on additional Hubs to the employee communication platform for
            more comprehensive engagement. Pick one or pick all based on your
            need.
          </p>
          <button className="px-6 py-3 sm:px-8 sm:py-4 bg-blue-700 text-white font-semibold rounded-lg hover:bg-blue-800 transition duration-300 ease-in-out shadow-md">
            Let Us Show You
          </button>
        </div>

        {/* Right Side: Hubs Grid */}
        <div className="w-full lg:w-3/5 grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
          {hubs.map((hub, index) => (
            <div
              key={index}
              className="group flex flex-col items-start p-6 sm:p-8 bg-gray-50 rounded-lg shadow-md hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300 ease-in-out cursor-pointer border border-gray-100"
            >
              {/* Icon Container with Hover Effect */}
              <div className="mb-4 sm:mb-6">
                <hub.icon
                  className={`w-10 h-10 sm:w-12 sm:h-12 ${hub.iconColor} group-hover:text-blue-700 transition-colors duration-300`}
                />
              </div>

              {/* Name */}
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-2">
                {hub.name}
              </h3>

              {/* Description */}
              <p className="text-sm sm:text-base text-gray-600">
                {hub.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AddOnHubs;
