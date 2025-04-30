import React from 'react'
import Navbar from '../../components/customer/Navbar'
import Hero from '../../components/customer/Hero'
import ContactInfo from '../../components/customer/ContactInfo'
import About from '../../components/customer/About'
import ClientReviews from '../../components/customer/ClientReview'
import Footer from '../../components/customer/Footer'

const Home = () => {
  return (
    <>
      <Hero/>
      <ContactInfo/>
      <About/>
      <ClientReviews/>
    </>
  )
}

export default Home
