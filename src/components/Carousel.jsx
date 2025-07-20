// Carousel.jsx
import React from "react";

function Carousel() {
  const logos = [
    {
      name: "Riley Resource Group",
      src: "https://www.hubengage.com/wp-content/uploads/2024/09/Riley-Resource-Group-Feed-energy.png.webp",
    },
    {
      name: "Matrix Services",
      src: "https://www.hubengage.com/wp-content/uploads/2024/09/Matrix-Services.png.webp",
    },
    {
      name: "EnerCorp",
      src: "https://www.hubengage.com/wp-content/uploads/2024/09/Extended-Stay-America.png.webp", // Corrected URL based on previous context
    },
    {
      name: "Extended Stay America",
      src: "https://www.hubengage.com/wp-content/uploads/2024/09/EnerCorp.png.webp", // Corrected URL based on previous context
    },
    {
      name: "Resolute B2B",
      src: "https://www.hubengage.com/wp-content/uploads/2024/09/Resolute-B2B.png.webp",
    },
    // Adding a couple more to ensure a good loop effect if the original list is short
    {
      name: "Pactiv Evergreen",
      src: "https://www.hubengage.com/wp-content/uploads/2024/09/Pactiv-Evergreen.png.webp", // Placeholder, as this wasn't in the last list
    },
    {
      name: "Brightline",
      src: "https://www.hubengage.com/wp-content/uploads/2024/09/Brightline.png.webp", // Placeholder
    },
    {
      name: "masai",
      src: "https://news.easyshiksha.com/wp-content/uploads/masai.png",
    },
  ];

  // Duplicate logos to create a seamless infinite scroll effect
  const duplicatedLogos = [...logos, ...logos, ...logos]; // Duplicate 3 times for a smoother loop

  return (
    <div className="bg-green-50 py-12 sm:py-16 lg:py-20 font-sans overflow-hidden">
      {/* Add custom styles for the scrolling animation and scrollbar hiding */}
      <style>
        {`
        @keyframes scroll-logos {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-33.33%); /* Adjust based on duplication factor (100% / number of original sets) */
          }
        }

        .animate-scroll {
          animation: scroll-logos 60s linear infinite; /* Adjust duration for speed */
        }

        /* Hide scrollbar for various browsers */
        .scrollbar-hide::-webkit-scrollbar {
            display: none;
        }
        .scrollbar-hide {
            -ms-overflow-style: none; /* IE and Edge */
            scrollbar-width: none; /* Firefox */
        }
        `}
      </style>

      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <h2 className="text-center text-gray-600 text-sm sm:text-base lg:text-lg font-medium uppercase tracking-wider mb-8 sm:mb-10">
          Engaging and Empowering Organizations Like Yours
        </h2>

        {/* Logos Container with Infinite Auto-Scroll */}
        {/* overflow-hidden on parent to clip content outside, overflow-x-hidden on inner to prevent manual scroll */}
        <div className="relative w-full overflow-hidden">
          <div className="flex items-center animate-scroll min-w-max">
            {duplicatedLogos.map((logo, index) => (
              <div
                key={index}
                className="flex-shrink-0 flex justify-center items-center mx-4"
              >
                <img
                  src={logo.src}
                  alt={logo.name}
                  className="max-h-16 h-auto w-auto object-contain"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = `https://placehold.co/150x60/cccccc/333333?text=${encodeURIComponent(
                      logo.name
                    )}`;
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Carousel;
