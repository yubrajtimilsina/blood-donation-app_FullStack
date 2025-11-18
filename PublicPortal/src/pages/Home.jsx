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
      <Element name="emergency">
      <EmergencyCTA />
      </Element>
      <Testimonials />
      
      <Element name="contact">
      <Contact />
      </Element>
      <NewsUpdates />
      <Footer />
    </div>
  )
}

export default Home
