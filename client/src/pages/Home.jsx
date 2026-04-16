import React from 'react'
import Hero from '../components/Hero'
import FeaturedSection from '../components/FeaturedSection'
import Banner from '../components/Banner'
import Testimonial from '../components/Testimonial'
import Newsletter from '../components/Newsletter'
import { useAppContext } from '../context/AppContext'

const Home = () => {
  const { isAdmin } = useAppContext()
  return (
    <>
      <Hero />
      <FeaturedSection />
      {!isAdmin && <Banner />}
      <Testimonial />
      <Newsletter />
    </>
  )
}

export default Home
