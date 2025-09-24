import React from 'react'
import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import Featured from '../components/Featured'
import Contact from '../components/Contact'

const Home = () => {
  return (
    <div>
      <Navbar />
      <Hero />
      <Featured />
      <Contact />
    </div>
  )
}

export default Home