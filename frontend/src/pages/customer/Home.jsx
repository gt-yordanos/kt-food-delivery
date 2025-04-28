import React from 'react'
import Navbar from '../../components/customer/Navbar'
import Hero from '../../components/customer/Hero'
import ContactInfo from '../../components/customer/ContactInfo'
import About from '../../components/customer/About'

const Home = () => {
  return (
    <>
      <Navbar/>
      <Hero/>
      <ContactInfo/>
      <About/>
    </>
  )
}

export default Home
