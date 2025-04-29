import React from 'react'
import Navbar from '../../components/customer/Navbar'
import Hero from '../../components/customer/Hero'
import ContactInfo from '../../components/customer/ContactInfo'
import About from '../../components/customer/About'
import ClientReviews from '../../components/customer/ClientReview'
import Footer from '../../components/customer/Footer'
import Menu from './Menu'

const Home = () => {
  return (
    <>
      <Navbar/>
      <Hero/>
      <ContactInfo/>
      <About/>
      <ClientReviews/>
      <Menu/>
      <Footer/>
    </>
  )
}

export default Home
