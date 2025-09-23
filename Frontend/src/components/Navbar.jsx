import { Link } from "react-scroll";

const Navbar = () => {
  return (
    <div className="flex items-center justify-between h-[100px] px-[200px] shadow-md bg-white sticky top-0 z-50">
      {/* Logo */}
      <img
        src="/logo2.png"
        alt="Logo"
        className="cursor-pointer w-[120px] h-auto"
      />

      {/* Menu Links */}
      <div className="flex items-center space-x-10 cursor-pointer">
        <Link
          to="hero"
          smooth={true}
          duration={1000}
          className="text-[16px] font-medium transition duration-300 hover:text-red-500 hover:underline"
        >
          Home
        </Link>
        <Link
          to="featured"
          smooth={true}
          duration={1000}
          className="text-[16px] font-medium transition duration-300 hover:text-red-500 hover:underline"
        >
          About Us
        </Link>
        <Link
          to="contact"
          smooth={true}
          duration={1000}
          className="text-[16px] font-medium transition duration-300 hover:text-red-500 hover:underline"
        >
          Contact Us
        </Link>
      </div>
    </div>
  );
};

export default Navbar;
