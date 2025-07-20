// Footer.jsx
import React from "react";
import { Facebook, X, Linkedin, Youtube } from "lucide-react"; // Importing social icons from lucide-react

function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12 sm:py-16 lg:py-20 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 lg:gap-12">
          {/* Platform Section */}
          <div>
            <h3 className="text-xl sm:text-2xl font-semibold mb-6">Platform</h3>
            <ul className="space-y-3 sm:space-y-4 text-gray-300 text-base sm:text-lg">
              <li>
                <a
                  href="#"
                  className="hover:text-blue-400 transition-colors duration-200"
                >
                  Employee Communication Platform
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-blue-400 transition-colors duration-200"
                >
                  Employee Recognition Platform
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-blue-400 transition-colors duration-200"
                >
                  Enterprise Social Platform
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-blue-400 transition-colors duration-200"
                >
                  Employee Surveys Platform
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-blue-400 transition-colors duration-200"
                >
                  Employee Messaging App
                </a>
              </li>
            </ul>
          </div>

          {/* Channels Section */}
          <div>
            <h3 className="text-xl sm:text-2xl font-semibold mb-6">Channels</h3>
            <ul className="space-y-3 sm:space-y-4 text-gray-300 text-base sm:text-lg">
              <li>
                <a
                  href="#"
                  className="hover:text-blue-400 transition-colors duration-200"
                >
                  Employee Mobile App
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-blue-400 transition-colors duration-200"
                >
                  Modern Intranet
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-blue-400 transition-colors duration-200"
                >
                  Digital Displays
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-blue-400 transition-colors duration-200"
                >
                  Internal Email Platform
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-blue-400 transition-colors duration-200"
                >
                  SMS / Text Campaigns
                </a>
              </li>
            </ul>
          </div>

          {/* Recent Posts Section */}
          <div>
            <h3 className="text-xl sm:text-2xl font-semibold mb-6">
              Recent Posts
            </h3>
            <ul className="space-y-3 sm:space-y-4 text-gray-300 text-base sm:text-lg">
              <li>
                <a
                  href="#"
                  className="hover:text-blue-400 transition-colors duration-200"
                >
                  Employee Engagement Trends To Watch In 2025
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-blue-400 transition-colors duration-200"
                >
                  Proven Ways To Calculate Employee Engagement ROI Effectively
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-blue-400 transition-colors duration-200"
                >
                  The Top 25 Engagement Software Tools For 2025
                </a>
              </li>

              <li>
                <a
                  href="#"
                  className="hover:text-blue-400 transition-colors duration-200"
                >
                  2025 Employee Satisfaction Strategies For Better Workplaces
                </a>
              </li>
            </ul>
          </div>

          {/* Resources & Connect Section */}
          <div>
            <h3 className="text-xl sm:text-2xl font-semibold mb-6">
              Resources
            </h3>
            <ul className="space-y-3 sm:space-y-4 text-gray-300 text-base sm:text-lg mb-8">
              <li>
                <a
                  href="#"
                  className="hover:text-blue-400 transition-colors duration-200"
                >
                  Webinars
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-blue-400 transition-colors duration-200"
                >
                  Podcast
                </a>
              </li>
            </ul>

            <h3 className="text-xl sm:text-2xl font-semibold mb-6">Connect</h3>
            <div className="flex space-x-4 mb-6">
              <a
                href="#"
                className="text-gray-300 hover:text-blue-400 transition-colors duration-200"
              >
                <Facebook className="w-6 h-6" />
              </a>
              <a
                href="#"
                className="text-gray-300 hover:text-blue-400 transition-colors duration-200"
              >
                <X className="w-6 h-6" /> {/* Using X for Twitter */}
              </a>
              <a
                href="#"
                className="text-gray-300 hover:text-blue-400 transition-colors duration-200"
              >
                <Linkedin className="w-6 h-6" />
              </a>
              <a
                href="#"
                className="text-gray-300 hover:text-blue-400 transition-colors duration-200"
              >
                <Youtube className="w-6 h-6" />
              </a>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="Your email address*"
                className="flex-grow p-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button className="px-6 py-3 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition duration-300 ease-in-out">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Copyright Section */}
        <div className="border-t border-gray-700 mt-12 pt-8 text-center text-gray-400 text-sm sm:text-base">
          <p>
            &copy; 2025 Hub, Inc. All Rights Reserved. |{" "}
            <a href="#" className="text-blue-400 hover:underline">
              Sitemap
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
