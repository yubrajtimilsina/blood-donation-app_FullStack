import React, { useState } from 'react';
import { FaNewspaper, FaCalendarAlt, FaArrowRight, FaExternalLinkAlt } from 'react-icons/fa';

const NewsUpdates = () => {
  const [activeCategory, setActiveCategory] = useState('all');

  const newsItems = [
    {
      id: 1,
      title: "New Blood Drive Campaign Launched in Kathmandu",
      excerpt: "A massive blood donation drive organized by LifeLink in partnership with local hospitals collected over 500 units of blood in just 3 days.",
      date: "2024-01-15",
      category: "campaign",
      image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=250&fit=crop",
      readTime: "3 min read",
      urgent: true
    },
    {
      id: 2,
      title: "Rare Blood Type AB- Donor Registry Expanded",
      excerpt: "We've successfully expanded our AB- donor database by 40% through targeted outreach programs in rural areas.",
      date: "2024-01-12",
      category: "achievement",
      image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400&h=250&fit=crop",
      readTime: "2 min read",
      urgent: false
    },
    {
      id: 3,
      title: "Mobile Blood Donation Vans Now Available",
      excerpt: "Introducing our new fleet of mobile blood donation vans that will bring donation services directly to communities.",
      date: "2024-01-10",
      category: "service",
      image: "https://images.unsplash.com/photo-1551190822-a9333d879b1f?w=400&h=250&fit=crop",
      readTime: "4 min read",
      urgent: false
    },
    {
      id: 4,
      title: "Emergency Response: 50 Lives Saved in December",
      excerpt: "Our emergency blood request system successfully facilitated 50 critical blood transfusions during the holiday season.",
      date: "2024-01-08",
      category: "impact",
      image: "https://images.unsplash.com/photo-1551190822-a9333d879b1f?w=400&h=250&fit=crop",
      readTime: "5 min read",
      urgent: true
    },
    {
      id: 5,
      title: "Partnership with Nepal Red Cross Society",
      excerpt: "LifeLink announces strategic partnership with Nepal Red Cross Society to enhance blood donation infrastructure nationwide.",
      date: "2024-01-05",
      category: "partnership",
      image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=250&fit=crop",
      readTime: "3 min read",
      urgent: false
    },
    {
      id: 6,
      title: "Digital Health Records Integration Complete",
      excerpt: "Our new digital health records system ensures seamless integration with hospital databases for faster donor verification.",
      date: "2024-01-03",
      category: "technology",
      image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400&h=250&fit=crop",
      readTime: "4 min read",
      urgent: false
    }
  ];

  const categories = [
    { id: 'all', label: 'All Updates', count: newsItems.length },
    { id: 'campaign', label: 'Campaigns', count: newsItems.filter(item => item.category === 'campaign').length },
    { id: 'achievement', label: 'Achievements', count: newsItems.filter(item => item.category === 'achievement').length },
    { id: 'service', label: 'Services', count: newsItems.filter(item => item.category === 'service').length },
    { id: 'impact', label: 'Impact', count: newsItems.filter(item => item.category === 'impact').length }
  ];

  const filteredNews = activeCategory === 'all'
    ? newsItems
    : newsItems.filter(item => item.category === activeCategory);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="py-16 lg:py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-3 bg-red-100 text-red-600 px-4 py-2 rounded-full mb-6">
            <FaNewspaper className="text-xl" />
            <span className="font-semibold">Latest Updates</span>
          </div>

          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Stay Informed
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-red-500 to-red-600 rounded-full mx-auto mb-6"></div>
          <p className="text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto">
            Keep up with the latest developments, success stories, and important announcements from LifeLink.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                activeCategory === category.id
                  ? 'bg-red-500 text-white shadow-lg transform scale-105'
                  : 'bg-white text-gray-700 hover:bg-red-50 hover:text-red-600 border border-gray-200'
              }`}
            >
              {category.label} ({category.count})
            </button>
          ))}
        </div>

        {/* News Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredNews.map((item) => (
            <article
              key={item.id}
              className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100"
            >
              {/* Image */}
              <div className="relative">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-48 object-cover"
                />
                {item.urgent && (
                  <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    Urgent
                  </div>
                )}
                <div className="absolute top-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                  {item.category}
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                  <div className="flex items-center gap-1">
                    <FaCalendarAlt />
                    {formatDate(item.date)}
                  </div>
                  <span>{item.readTime}</span>
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                  {item.title}
                </h3>

                <p className="text-gray-600 mb-4 line-clamp-3">
                  {item.excerpt}
                </p>

                <button className="inline-flex items-center gap-2 text-red-500 font-semibold hover:text-red-600 transition-colors group">
                  Read More
                  <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </article>
          ))}
        </div>

        {/* Newsletter Signup */}
        <div className="mt-16 bg-gradient-to-r from-red-500 to-red-600 rounded-3xl p-8 lg:p-12 text-white text-left">
  <h3 className="text-3xl font-bold mb-4 text-left">
    Stay Updated
  </h3>

  <p className="mb-8 opacity-90 max-w-2xl">
    Subscribe to our newsletter and be the first to know about new campaigns, emergency needs, and success stories.
  </p>

  <div className="max-w-md flex gap-4">
    <input
      type="email"
      placeholder="Enter your email"
      className="flex-1 px-4 py-3 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white"
    />
    <button className="bg-white text-red-500 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
      Subscribe
    </button>
  </div>

  <p className="text-sm opacity-75 mt-4">
    We respect your privacy. Unsubscribe at any time.
  </p>
</div>

      </div>
    </div>
  );
};

export default NewsUpdates;
