// ReachChannels.jsx
import React from "react";
import { Smartphone, Laptop, Mail, MessageSquare, Monitor } from "lucide-react"; // Importing icons from lucide-react

function ReachChannels() {
  const channels = [
    {
      name: "Mobile",
      description: "iOS and Android apps to reach employees on the go",
      icon: Smartphone, // Lucide icon component
      iconColor: "text-red-500",
    },
    {
      name: "Web / Intranet",
      description: "Desktop solution for convenient computer access",
      icon: Laptop, // Lucide icon component
      iconColor: "text-yellow-400",
    },
    {
      name: "Email Newsletters",
      description:
        "Easily create intelligent email newsletters with latest content",
      icon: Mail, // Lucide icon component
      iconColor: "text-blue-400",
    },
    {
      name: "SMS Messaging",
      description: "Send important announcements directly to phones",
      icon: MessageSquare, // Lucide icon component
      iconColor: "text-purple-400",
    },
    {
      name: "Digital Displays",
      description: "Push content to TV screens to maximize exposure",
      icon: Monitor, // Lucide icon component
      iconColor: "text-lime-400",
    },
  ];

  return (
    <div className="bg-gray-900 py-12 sm:py-16 lg:py-20 font-sans text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Main Heading */}
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight mb-6 sm:mb-8">
          One Click, Multi-Channel Reach
        </h2>

        {/* Description */}
        <p className="text-base sm:text-lg lg:text-xl text-gray-300 mb-10 sm:mb-12 max-w-4xl mx-auto leading-relaxed">
          With HubEngage, deliver content across mobile apps, web, email, SMS,
          and digital signage with a single click. The platform auto-formats
          content for each channel, saving time and ensuring your message
          reaches employees where they are. Plus, gain insights on which
          channels are most effective, allowing for smarter, more targeted
          communication.
        </p>

        {/* Channels Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 sm:gap-8 lg:gap-10">
          {channels.map((channel, index) => (
            <div
              key={index}
              className="group flex flex-col items-center p-6 sm:p-8 bg-gray-800 rounded-lg shadow-xl hover:bg-blue-700 transition-all duration-300 ease-in-out cursor-pointer"
            >
              {/* Icon Container with Hover Effect */}
              <div className="transform group-hover:-translate-y-2 transition-transform duration-300 ease-in-out mb-4 sm:mb-6">
                {/* Render Lucide Icon Component */}
                <channel.icon
                  className={`w-12 h-12 sm:w-14 sm:h-14 ${channel.iconColor} group-hover:text-white transition-colors duration-300`}
                />
              </div>

              {/* Name with Hover Effect */}
              <h3 className="text-xl sm:text-2xl font-semibold mb-2 transform group-hover:-translate-y-2 transition-transform duration-300 ease-in-out group-hover:text-white">
                {channel.name}
              </h3>

              {/* Description */}
              <p className="text-sm sm:text-base text-gray-300 group-hover:text-gray-200 transition-colors duration-300">
                {channel.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ReachChannels;
