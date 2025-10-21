import { useState } from "react";
import { Link } from "react-router-dom";
import {
  FaHome,
  FaTint,
  FaUsers,
  FaBars,
  FaTimes,
  FaSignOutAlt,
  FaHeartbeat,
  FaUserShield,
  FaChevronDown,
  FaChevronUp
} from "react-icons/fa";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../redux/userRedux";

const Menu = () => {
  const [activeLink, setActiveLink] = useState("/admin");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState({});
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLinkClick = (link) => {
    setActiveLink(link);
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
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
      ]
    },
    {
      section: "System",
      items: [
        { path: "/admin/users", icon: FaUserShield, label: "Users", primary: true },
        { path: "/admin/chat", icon: FaUsers, label: "Chat", primary: true }
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
            flex items-center px-4 py-3 rounded-lg cursor-pointer
            transition-all duration-300 ease-in-out group
            ${isActive 
              ? 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg' 
              : 'text-gray-700 hover:bg-red-50 hover:text-red-600 hover:shadow-md'
            }
          `}
        >
          <Icon
            className={`
              mr-3 text-lg transition-colors duration-300
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
          w-72 lg:w-64 xl:w-72
        `}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-red-500 to-red-600 p-4 lg:p-6 text-white">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center flex-shrink-0">
              <FaTint className="text-white text-lg" />
            </div>
            <div className="min-w-0">
              <h2 className="text-lg lg:text-xl font-bold truncate">LifeLink</h2>
              <p className="text-red-100 text-xs lg:text-sm truncate">Admin Portal</p>
            </div>
          </div>
        </div>

        {/* Menu Content */}
        <div className="flex-1 overflow-y-auto p-3 lg:p-4 h-[calc(100vh-180px)]">
          <nav>
            {menuItems.map((section, sectionIndex) => (
              <div key={sectionIndex} className="mb-4">
                <button
                  onClick={() => toggleSection(section.section)}
                  className="w-full flex items-center justify-between text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-2 py-1 hover:text-gray-600 transition-colors lg:cursor-default"
                >
                  <span>{section.section}</span>
                  <span className="lg:hidden">
                    {expandedSections[section.section] ? <FaChevronUp /> : <FaChevronDown />}
                  </span>
                </button>
                <ul className={`space-y-1 ${!expandedSections[section.section] && 'hidden lg:block'}`}>
                  {section.items.map((item, itemIndex) => (
                    <MenuItem
                      key={itemIndex}
                      item={item}
                      isPrimary={item.primary}
                    />
                  ))}
                </ul>
                {sectionIndex < menuItems.length - 1 && (
                  <hr className="my-3 border-gray-200" />
                )}
              </div>
            ))}
          </nav>
        </div>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-3 lg:p-4 bg-gray-50 border-t">
          <button
            onClick={handleLogout}
            className="flex items-center justify-center w-full px-4 py-3 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-300 font-medium"
          >
            <FaSignOutAlt className="mr-3 text-red-500" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Menu;