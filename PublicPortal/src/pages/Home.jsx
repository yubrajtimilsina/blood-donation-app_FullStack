import React from 'react'
import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import HowItWorks from '../components/HowItWorks'
import Featured from '../components/Featured'
import EmergencyCTA from '../components/EmergencyCTA'
import Testimonials from '../components/Testimonials'
import NewsUpdates from '../components/NewsUpdates'
import Contact from '../components/Contact'
import Footer from '../components/Footer'
import{ Element } from "react-scroll";

const Home = () => {
  return (
    <div>
      <Navbar />
      <Element name="hero">
      <Hero />
      </Element>
      <HowItWorks />
      <Element name="featured">
      <Featured />
      </Element>
      <EmergencyCTA />
      <Testimonials />
      <NewsUpdates />
      <Element name="contact">
      <Contact />
      </Element>
      <Footer />
    </div>
  )
}

export default Home
