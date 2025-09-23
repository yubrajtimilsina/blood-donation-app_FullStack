import React from "react";

const Hero = () => {
  return (
    <section className="relative bg-[url('/hero1.jpg')] bg-no-repeat bg-cover bg-center h-[90vh] flex items-center">
      {/* Overlay for better text visibility */}
      <div className="absolute inset-0 bg-black/50"></div>

      <div className="relative z-10 container mx-auto px-6 md:px-12 lg:px-20">
        <div className="flex flex-col items-start max-w-2xl text-white">
          <span className="text-lg md:text-xl font-semibold tracking-wide uppercase text-red-400">
            Donate blood, Save life!
          </span>

          <h1 className="mt-4 text-3xl md:text-5xl font-bold leading-tight">
            Your Blood Can Bring a <span className="text-red-500">Smile</span>{" "}
            In Someone’s Life
          </h1>

          <p className="mt-4 text-base md:text-lg text-gray-200">
            Join us in making a difference. Every drop counts, and together we
            can save lives.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mt-8">
            <button className="bg-red-600 hover:bg-red-700 px-6 py-3 rounded-lg shadow-lg text-white font-medium transition duration-300">
              Donate Now
            </button>
            <a
              href="tel:+977987635433"
              className="bg-gray-700 hover:bg-gray-800 px-6 py-3 rounded-lg shadow-lg text-white font-medium transition duration-300 flex items-center justify-center"
            >
              📞 Call: +977 987635433
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
