import React, { useState, useEffect } from 'react';
import { FaQuoteLeft, FaStar, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Regular Donor",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
      content: "LifeLink has made blood donation so much easier. I've donated 15 times and helped save countless lives. The platform is user-friendly and the community is amazing!",
      rating: 5,
      bloodType: "O+"
    },
    {
      name: "Dr. Michael Chen",
      role: "Hospital Director",
      image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&h=150&fit=crop&crop=face",
      content: "As a hospital administrator, LifeLink has been a game-changer. We can now quickly find compatible donors for emergency cases. It's reliable and efficient.",
      rating: 5,
      bloodType: "A+"
    },
    {
      name: "Emma Rodriguez",
      role: "Recipient",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
      content: "I needed urgent blood transfusion for my daughter. LifeLink connected us with a donor within hours. Words cannot express our gratitude to this amazing platform.",
      rating: 5,
      bloodType: "AB-"
    },
    {
      name: "David Kim",
      role: "First-time Donor",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      content: "My first donation experience was incredible! The staff was professional, the process was smooth, and knowing I saved a life makes it all worthwhile.",
      rating: 5,
      bloodType: "B+"
    }
  ];

  const nextTestimonial = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevTestimonial = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
    );
  };

  useEffect(() => {
    const timer = setInterval(nextTestimonial, 5000);
    return () => clearInterval(timer);
  }, []);

  const currentTestimonial = testimonials[currentIndex];

  return (
    <div className="py-16 lg:py-24 bg-gradient-to-r from-gray-900 via-gray-800 to-red-900 text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-32 h-32 border border-red-500 rounded-full"></div>
        <div className="absolute bottom-10 right-10 w-24 h-24 border border-white rounded-full"></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-red-500 rounded-full"></div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold mb-4">
            What Our Community Says
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-red-500 to-white rounded-full mx-auto mb-6"></div>
          <p className="text-lg lg:text-xl text-gray-300 max-w-3xl mx-auto">
            Real stories from donors, recipients, and healthcare professionals who are part of our life-saving mission.
          </p>
        </div>

        {/* Main Testimonial */}
        <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 lg:p-12 shadow-2xl border border-white/20">
          <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">

            {/* Image and Info */}
            <div className="flex-shrink-0 text-center lg:text-left">
              <div className="relative mb-6">
                <img
                  src={currentTestimonial.image}
                  alt={currentTestimonial.name}
                  className="w-32 h-32 lg:w-40 lg:h-40 rounded-full object-cover border-4 border-white shadow-lg mx-auto"
                />
                <div className="absolute -bottom-2 -right-2 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  {currentTestimonial.bloodType}
                </div>
              </div>

              <h3 className="text-2xl font-bold mb-2">{currentTestimonial.name}</h3>
              <p className="text-red-300 font-medium mb-4">{currentTestimonial.role}</p>

              {/* Rating */}
              <div className="flex justify-center lg:justify-start gap-1 mb-4">
                {[...Array(currentTestimonial.rating)].map((_, i) => (
                  <FaStar key={i} className="text-yellow-400 text-lg" />
                ))}
              </div>
            </div>

            {/* Quote */}
            <div className="flex-1">
              <FaQuoteLeft className="text-red-400 text-4xl mb-6 opacity-50" />
              <blockquote className="text-lg lg:text-xl leading-relaxed mb-6 italic">
                "{currentTestimonial.content}"
              </blockquote>

              {/* Navigation */}
              <div className="flex items-center justify-between">
                <button
                  onClick={prevTestimonial}
                  className="flex items-center gap-2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-all duration-300"
                >
                  <FaChevronLeft />
                  Previous
                </button>

                {/* Dots Indicator */}
                <div className="flex gap-2">
                  {testimonials.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentIndex(index)}
                      className={`w-3 h-3 rounded-full transition-all duration-300 ${
                        index === currentIndex ? 'bg-red-500' : 'bg-white/50'
                      }`}
                    />
                  ))}
                </div>

                <button
                  onClick={nextTestimonial}
                  className="flex items-center gap-2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-all duration-300"
                >
                  Next
                  <FaChevronRight />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mt-16">
          <div className="text-center">
            <div className="text-3xl lg:text-4xl font-bold text-red-400 mb-2">98%</div>
            <div className="text-sm lg:text-base text-gray-300">Satisfaction Rate</div>
          </div>
          <div className="text-center">
            <div className="text-3xl lg:text-4xl font-bold text-red-400 mb-2">24/7</div>
            <div className="text-sm lg:text-base text-gray-300">Support Available</div>
          </div>
          <div className="text-center">
            <div className="text-sm lg:text-base text-gray-300 mb-2">Response Time</div>
            <div className="text-3xl lg:text-4xl font-bold text-red-400">{"< 2hrs"}</div>
          </div>
          <div className="text-center">
            <div className="text-3xl lg:text-4xl font-bold text-red-400 mb-2">100%</div>
            <div className="text-sm lg:text-base text-gray-300">Verified Donors</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Testimonials;
