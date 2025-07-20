import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import Modal from "./Modal";
import { Menu, X } from "lucide-react";

function Dropdown({ text, isMobile = false }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <div className="relative">
      <button
        aria-expanded={dropdownOpen}
        aria-haspopup="true"
        className={`flex items-center space-x-1 font-semibold focus:outline-none ${
          text === "Platform" ? "text-[#1D9BF0]" : "text-black"
        } ${isMobile ? "py-2 px-4 w-full justify-start" : ""}`}
        type="button"
        onClick={toggleDropdown}
      >
        <span>{text}</span>
        <ChevronDown
          className={`w-3 h-3 ${
            text === "Platform" ? "text-[#1D9BF0]" : "text-black"
          }`}
        />
      </button>
      {dropdownOpen && (
        <div
          className={`${
            isMobile
              ? "static bg-gray-50 shadow-none pl-4"
              : "absolute mt-2 bg-white rounded-md shadow-lg z-50"
          } w-full py-1`}
        >
          <a
            href="#"
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            onClick={() => setDropdownOpen(false)}
          >
            Sub-item 1
          </a>
          <a
            href="#"
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            onClick={() => setDropdownOpen(false)}
          >
            Sub-item 2
          </a>
        </div>
      )}
    </div>
  );
}

function Navbar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [showRegisterForm, setShowRegisterForm] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  const openLoginForm = () => {
    setShowRegisterForm(false);
    setShowLoginForm(true);
  };

  const openRegisterForm = () => {
    setShowLoginForm(false);
    setShowRegisterForm(true);
  };

  const closeAllModals = () => {
    setShowLoginForm(false);
    setShowRegisterForm(false);
  };

  return (
    <nav className="fixed top-0  w-full flex items-center justify-between px-4 md:px-8 py-3 z-50 bg-white shadow-sm">
      {/* Logo (Desktop Only) */}
      <div className="hidden md:flex items-center space-x-2">
        <img
          src="https://storage.googleapis.com/a1aa/image/e1a7e582-3385-4a88-10d7-f99ef4d4a1aa.jpg"
          alt="HubEngage logo"
          className="w-6 h-6"
        />
        <span className="text-2xl font-normal text-black select-none">Hub</span>
      </div>

      {/* Desktop Nav */}
      <ul className="hidden md:flex items-center space-x-8 text-base font-semibold">
        <li>
          <Dropdown text="Platform" />
        </li>
        <li>
          <Dropdown text="Channels" />
        </li>
        <li>
          <a className="text-black hover:text-gray-700" href="#">
            Why Hub
          </a>
        </li>
        <li>
          <a className="text-black hover:text-gray-700" href="#">
            Insights
          </a>
        </li>
        <li>
          <Dropdown text="About" />
        </li>
        <li>
          <Dropdown text="Resources" />
        </li>
      </ul>

      {/* Hamburger Button */}
      <button
        className="md:hidden focus:outline-none text-2xl"
        onClick={toggleSidebar}
        aria-label="Toggle mobile menu"
      >
        <Menu className="w-6 h-6 text-gray-800"></Menu>
      </button>

      {/* Desktop CTA */}
      <button
        className="hidden md:inline-block bg-[#0D4C8E] text-white font-semibold px-4 py-2 rounded hover:bg-[#0a386b] cursor-pointer"
        type="button"
        onClick={openLoginForm}
      >
        Login
      </button>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={closeSidebar}
          aria-hidden="true"
        ></div>
      )}

      {/* ✅ Mobile Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-50 md:hidden ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b">
            <div className="flex items-center space-x-2">
              <img
                src="https://storage.googleapis.com/a1aa/image/e1a7e582-3385-4a88-10d7-f99ef4d4a1aa.jpg"
                alt="HubEngage logo"
                className="w-6 h-6"
              />
              <span className="text-xl font-normal text-black select-none">
                Hub
              </span>
            </div>
            <button
              className="focus:outline-none text-2xl"
              onClick={closeSidebar}
              aria-label="Close mobile menu"
            >
              <X className="w-6 h-6 text-gray-800"></X>
            </button>
          </div>

          {/* Sidebar Nav Items */}
          <ul className="flex flex-col p-4 space-y-2 text-base font-semibold flex-grow">
            <li>
              <Dropdown text="Platform" isMobile={true} />
            </li>
            <li>
              <Dropdown text="Channels" isMobile={true} />
            </li>
            <li>
              <a
                className="block py-2 px-4 text-black hover:bg-gray-100 rounded"
                href="#"
                onClick={closeSidebar}
              >
                Why Hub
              </a>
            </li>
            <li>
              <a
                className="block py-2 px-4 text-black hover:bg-gray-100 rounded"
                href="#"
                onClick={closeSidebar}
              >
                Insights
              </a>
            </li>
            <li>
              <Dropdown text="About" isMobile={true} />
            </li>
            <li>
              <Dropdown text="Resources" isMobile={true} />
            </li>
          </ul>

          {/* CTA Button */}
          <div className="p-4 border-t">
            <button
              className="bg-[#0D4C8E] text-white w-full px-4 py-2 rounded font-semibold hover:bg-[#0a386b] cursor-pointer"
              type="button"
              onClick={() => {
                closeSidebar();
                openLoginForm();
              }}
            >
              Login
            </button>
          </div>
        </div>
      </div>
      {showLoginForm && (
        <Modal onClose={closeAllModals}>
          <LoginForm
            onSwitchToRegister={openRegisterForm}
            onClose={closeAllModals}
          />
        </Modal>
      )}
      {showRegisterForm && (
        <Modal onClose={closeAllModals}>
          <RegisterForm
            onSwitchToLogin={openLoginForm}
            onClose={closeAllModals}
          />
        </Modal>
      )}
    </nav>
  );
}

export default Navbar;
