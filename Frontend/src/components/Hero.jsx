import React from "react";
import { Link as ScrollLink } from "react-scroll";
import { Link } from "react-router-dom";
import { FaTint, FaPhone } from "react-icons/fa";

const Hero = () => {
  return (
    <section className="relative bg-[url('/hero1.jpg')] bg-no-repeat bg-cover bg-center min-h-screen flex items-center pt-16 lg:pt-20">
      {/* Overlay for better text visibility */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/40"></div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-20">
        <div className="flex flex-col items-start max-w-full lg:max-w-2xl xl:max-w-3xl text-white">
          
          {/* Badge */}
          <span className="inline-flex items-center gap-2 text-xs sm:text-sm md:text-base lg:text-lg font-semibold tracking-wide uppercase text-red-400 bg-red-500/20 px-4 py-2 rounded-full backdrop-blur-sm mb-4 animate-pulse">
            <FaTint className="text-sm sm:text-base" />
            Donate Blood, Save Life!
          </span>

          {/* Main Heading */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight mb-4 sm:mb-6">
            Your Blood Can Bring a{" "}
            <span className="text-red-500 inline-block animate-pulse">Smile</span>{" "}
            In Someone's Life
          </h1>

          {/* Description */}
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-200 mb-6 sm:mb-8 leading-relaxed max-w-xl">
            Join us in making a difference. Every drop counts, and together we
            can save lives. Be a hero today!
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto">
            <ScrollLink 
              to="contact" 
              smooth={true} 
              duration={600} 
              offset={-80} 
              className="group flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 px-6 sm:px-8 py-3 sm:py-4 rounded-lg shadow-lg text-white font-semibold text-sm sm:text-base transition-all duration-300 cursor-pointer hover:scale-105 hover:shadow-xl"
            >
              <FaTint className="group-hover:animate-bounce" />
              Donate Now
            </ScrollLink>
            
            <a
              href="tel:+977987635433"
              className="flex items-center justify-center gap-2 bg-gray-800/80 hover:bg-gray-900 backdrop-blur-sm px-6 sm:px-8 py-3 sm:py-4 rounded-lg shadow-lg text-white font-semibold text-sm sm:text-base transition-all duration-300 hover:scale-105 hover:shadow-xl border border-white/20"
            >
              <FaPhone className="animate-pulse" />
              <span className="hidden xs:inline">Call:</span> +977 987635433
            </a>
          </div>

          {/* Register Link for Mobile */}
          <div className="mt-6 sm:mt-8">
            <Link
              to="/register"
              className="inline-flex items-center gap-2 text-sm sm:text-base text-white/90 hover:text-white transition-colors duration-300 group"
            >
              <span>New here?</span>
              <span className="text-red-400 font-semibold group-hover:underline">
                Register as a donor →
              </span>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 sm:gap-6 mt-8 sm:mt-12 w-full max-w-lg">
            <div className="text-center">
              <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-red-500">10K+</div>
              <div className="text-xs sm:text-sm text-gray-300 mt-1">Lives Saved</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-red-500">5K+</div>
              <div className="text-xs sm:text-sm text-gray-300 mt-1">Active Donors</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-red-500">24/7</div>
              <div className="text-xs sm:text-sm text-gray-300 mt-1">Support</div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce hidden md:block">
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex items-start justify-center p-2">
          <div className="w-1 h-3 bg-white/70 rounded-full animate-pulse"></div>
        </div>
      </div>
    </section>
  );
};

export default Hero;