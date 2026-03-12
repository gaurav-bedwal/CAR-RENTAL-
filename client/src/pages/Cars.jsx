import React, { useEffect, useState } from 'react'
import Title from '../components/Title'
import { assets, dummyCarData } from '../assets/assets'
import CarCard from '../components/CarCard'
import { useSearchParams } from 'react-router-dom'
import { useAppContext } from '../context/AppContext'
import toast from 'react-hot-toast'
import { motion } from 'motion/react'

const Cars = () => {

  // getting search params from url
  const [searchParams] = useSearchParams()
  const pickupLocation = searchParams.get('pickupLocation')
  const pickupDate = searchParams.get('pickupDate')
  const returnDate = searchParams.get('returnDate')

  const { cars, axios } = useAppContext()

  const [input, setInput] = useState('')

  const isSearchData = pickupLocation && pickupDate && returnDate
  const [filteredCars, setFilteredCars] = useState([])

  const applyFilter = async () => {

    if (input === '') {
      setFilteredCars(cars)
      return null
    }

    const filtered = cars.slice().filter((car) => {
      return car.brand.toLowerCase().includes(input.toLowerCase())
        || car.model.toLowerCase().includes(input.toLowerCase())
        || car.category.toLowerCase().includes(input.toLowerCase())
        || car.transmission.toLowerCase().includes(input.toLowerCase())
    })
    setFilteredCars(filtered)
  }

  const searchCarAvailablity = async () => {
    const { data } = await axios.post('/api/bookings/check-availability', { location: pickupLocation, pickupDate, returnDate })
    if (data.success) {
      setFilteredCars(data.availableCars)
      if (data.availableCars.length === 0) {
        toast('No cars available')
      }
      return null
    }
  }

  useEffect(() => {
    isSearchData && searchCarAvailablity()
  }, [])

  useEffect(() => {
    cars.length > 0 && !isSearchData && applyFilter()
  }, [input, cars])

  return (
    <div className="bg-[#0a0a0a] min-h-screen text-gray-300 pb-20">

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}

        className='flex flex-col items-center py-20 bg-gradient-to-b from-[#111] to-[#0a0a0a] border-b border-white/5 max-md:px-4'>
        <Title title='Available Cars' subTitle='Browse our selection of premium vehicles available for your next adventure' />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}

          className='flex items-center bg-[#111] border border-white/10 hover:border-primary/50 transition-colors px-6 mt-8 max-w-140 w-full h-14 rounded-full shadow-lg'>
          <img src={assets.search_icon} alt="" className='w-5 h-5 mr-3 brightness-200 opacity-50' />

          <input onChange={(e) => setInput(e.target.value)} value={input} type="text" placeholder='Search by make, model, or features' className='w-full h-full outline-none text-white placeholder-gray-500 bg-transparent' />

          <img src={assets.filter_icon} alt="" className='w-5 h-5 ml-3 brightness-200 opacity-50' />
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.5 }}

        className='px-6 md:px-16 lg:px-24 xl:px-32 mt-12'>
        <p className='text-gray-400 xl:px-20 max-w-7xl mx-auto uppercase tracking-wider text-sm font-medium'>Showing <span className="text-primary font-bold">{filteredCars.length}</span> Premium Cars</p>

        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-6 xl:px-20 max-w-7xl mx-auto'>
          {filteredCars.map((car, index) => (
            <motion.div key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index, duration: 0.4 }}
            >
              <CarCard car={car} />
            </motion.div>
          ))}
        </div>
      </motion.div>

    </div>
  )
}

export default Cars
