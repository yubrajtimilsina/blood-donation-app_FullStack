import { useState } from "react";
import { Link } from "react-router-dom";

import {
  FaBox,
  FaCalendarAlt,
  FaChartBar,
  FaClipboard,
  FaClipboardList,
  FaCog,
  FaElementor,
  FaHdd,
  FaHome,
  FaUser,
  FaUsers,
  FaBars,
  FaTimes,
  FaSignOutAlt,
  FaTint,
  FaHeartbeat
} from "react-icons/fa";


const Menu = () => {
  const [activeLink, setActiveLink] = useState("/admin");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLinkClick = (link) => {
    setActiveLink(link);
    setIsMobileMenuOpen(false); // Close mobile menu when link is clicked
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const menuItems = [
    {
      section: "Main",
      items: [
        { path: "/admin", icon: FaHome, label: "Dashboard", primary: true },
      ]
    },
    {
      section: "Blood Management",
      items: [
        { path: "/admin/donors", icon: FaTint, label: "Donors", primary: true },
        { path: "/admin/prospects", icon: FaUsers, label: "Prospects", primary: true },
        { path: "/admin/bloodrequests", icon: FaHeartbeat, label: "Blood Requests", primary: true },
        { path: "/orders", icon: FaClipboardList, label: "Orders" }
      ]
    },
    {
      section: "System",
      items: [
        { path: "/elements", icon: FaElementor, label: "Elements" },
        { path: "/settings", icon: FaCog, label: "Settings" },
        { path: "/backups", icon: FaHdd, label: "Backups" }
      ]
    },
    {
      section: "Analytics",
      items: [
        { path: "/charts", icon: FaChartBar, label: "Charts" },
        { path: "/logs", icon: FaClipboard, label: "Activity Logs" },
        { path: "/calendar", icon: FaCalendarAlt, label: "Calendar" }
      ]
    }
  ];

  const MenuItem = ({ item, isPrimary = false }) => {
    const Icon = item.icon;
    const isActive = activeLink === item.path;
    
    return (
      <Link
        to={item.path}
        onClick={() => handleLinkClick(item.path)}
        className="block w-full"
      >
        <li
          className={`
            flex items-center px-4 py-3 mb-2 rounded-lg cursor-pointer
            transition-all duration-300 ease-in-out group
            ${isActive 
              ? 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg transform scale-105' 
              : 'text-gray-700 hover:bg-red-50 hover:text-red-600 hover:shadow-md hover:transform hover:translate-x-2'
            }
            ${isPrimary && !isActive ? 'border-l-4 border-red-200' : ''}
          `}
        >
          <Icon
            className={`
              mr-4 text-lg transition-colors duration-300
              ${isActive ? 'text-white' : 'text-red-500 group-hover:text-red-600'}
            `}
          />
          <span className="font-medium text-sm md:text-base">{item.label}</span>
          {isPrimary && !isActive && (
            <span className="ml-auto w-2 h-2 bg-red-400 rounded-full opacity-60"></span>
          )}
        </li>
      </Link>
    );
  };

  return (
    <>
      {/* Mobile Menu Toggle Button */}
      <button
        onClick={toggleMobileMenu}
        className="lg:hidden fixed top-4 left-4 z-50 bg-red-500 text-white p-3 rounded-lg shadow-lg hover:bg-red-600 transition-colors duration-300"
      >
        {isMobileMenuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
      </button>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        ></div>
      )}

      {/* Sidebar Menu */}
      <aside
        className={`
          fixed lg:sticky top-0 left-0 h-screen bg-white shadow-2xl z-50
          transition-transform duration-300 ease-in-out
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          w-80 lg:w-72 xl:w-80
        `}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-red-500 to-red-600 p-6 text-white">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <FaTint className="text-white text-lg" />
            </div>
            <div>
              <h2 className="text-xl font-bold">LifeLink</h2>
              <p className="text-red-100 text-sm">Admin Portal</p>
            </div>
          </div>
          <div className="text-red-100 text-xs">
            Managing life-saving connections
          </div>
        </div>

        {/* Menu Content */}
        <div className="flex-1 overflow-y-auto p-4 h-full pb-20">
          <nav>
            {menuItems.map((section, sectionIndex) => (
              <div key={sectionIndex} className="mb-6">
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-2">
                  {section.section}
                </h3>
                <ul>
                  {section.items.map((item, itemIndex) => (
                    <MenuItem
                      key={itemIndex}
                      item={item}
                      isPrimary={item.primary}
                    />
                  ))}
                </ul>
                {sectionIndex < menuItems.length - 1 && (
                  <hr className="my-4 border-gray-200" />
                )}
              </div>
            ))}
          </nav>
        </div>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gray-50 border-t">
          <Link
            to="/logout"
            onClick={() => handleLinkClick("/logout")}
            className="flex items-center px-4 py-3 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-300 w-full"
          >
            <FaSignOutAlt className="mr-4 text-red-500" />
            <span className="font-medium">Sign Out</span>
          </Link>
        </div>
      </aside>
    </>
  );
};

export default Menu;