import React, { useEffect, useState } from 'react'
import Title from '../components/Title'
import { assets, dummyCarData } from '../assets/assets'
import CarCard from '../components/CarCard'
import { useSearchParams } from 'react-router-dom'
import { useAppContext } from '../context/AppContext'
import toast from 'react-hot-toast'
import { motion, AnimatePresence } from 'framer-motion'

const Cars = () => {

  // getting search params from url
  const [searchParams] = useSearchParams()
  const pickupLocation = searchParams.get('pickupLocation')
  const pickupDate = searchParams.get('pickupDate')
  const returnDate = searchParams.get('returnDate')

  const { cars, axios, searchQuery, setSearchQuery } = useAppContext()

  const [input, setInput] = useState(searchQuery || '')

  const isSearchData = pickupLocation && pickupDate && returnDate
  const [filteredCars, setFilteredCars] = useState([])
  const [baseCars, setBaseCars] = useState([]) // Holds either all cars or date-available cars
  const [isDropdownVisible, setIsDropdownVisible] = useState(false)

  const applyFilter = () => {
    let sourceCars = baseCars.length > 0 ? baseCars : cars;

    if (input.trim() === '') {
      setFilteredCars(sourceCars)
      return null
    }

    const filtered = sourceCars.slice().filter((car) => {
      const searchTerms = input.toLowerCase().split(' ').filter(t => t.trim() !== '')
      
      const carText = [
        car.brand,
        car.model,
        car.category,
        car.transmission,
        car.fuel_type,
        car.seating_capacity?.toString(),
        ...(car.features || [])
      ].join(' ').toLowerCase();

      return searchTerms.every(term => carText.includes(term));
    })
    setFilteredCars(filtered)
  }

  // Effect to sync context search query with local input
  useEffect(() => {
    setInput(searchQuery)
  }, [searchQuery])

  const searchCarAvailablity = async () => {
    const { data } = await axios.post('/api/bookings/check-availability', { location: pickupLocation, pickupDate, returnDate })
    if (data.success) {
      setBaseCars(data.availableCars)
      setFilteredCars(data.availableCars)
      if (data.availableCars.length === 0) {
        toast('No cars available for the selected dates/location.')
      }
    }
  }

  useEffect(() => {
    if (isSearchData) {
      searchCarAvailablity()
    } else {
      setBaseCars(cars)
      setFilteredCars(cars)
    }
  }, [cars])

  useEffect(() => {
    applyFilter()
  }, [input, baseCars, cars])

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

          className='relative flex items-center bg-[#111] border border-white/10 hover:border-primary/50 transition-colors px-6 mt-8 max-w-140 w-full h-14 rounded-full shadow-lg z-30'>
          <img src={assets.search_icon} alt="" className='w-5 h-5 mr-3 brightness-200 opacity-50 shrink-0' />

          <input 
             onChange={(e) => {
               setInput(e.target.value);
               setSearchQuery(e.target.value);
               setIsDropdownVisible(true);
             }} 
             onFocus={() => setIsDropdownVisible(true)}
             onBlur={() => setTimeout(() => setIsDropdownVisible(false), 200)}
             value={input} 
             type="text" 
             placeholder='Search fuel, transmission, seating, or model...' 
             className='w-full h-full outline-none text-white placeholder-gray-500 bg-transparent' 
          />

          <img src={assets.filter_icon} alt="" className='w-5 h-5 ml-3 brightness-200 opacity-50 shrink-0' />
          
          {/* Autocomplete Suggestions Dropdown */}
          <AnimatePresence>
            {(input.trim() !== '' && isDropdownVisible) && (
              <motion.div 
                initial={{opacity: 0, y: -10}}
                animate={{opacity: 1, y: 0}}
                exit={{opacity: 0, y: -10}}
                transition={{duration: 0.2}}
                className="absolute top-16 left-0 w-full bg-[#111]/95 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl p-4 overflow-y-auto max-h-80 custom-scrollbar z-50 text-left"
              >
                {filteredCars.length > 0 ? (
                   <div className="flex flex-col gap-2">
                     <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] pl-2 mb-2">Matching Suggestions</p>
                     {filteredCars.map(car => (
                       <div key={car._id} onClick={() => { setInput(car.brand + ' ' + car.model); setIsDropdownVisible(false); }} className="flex items-center gap-4 p-3 hover:bg-white/5 rounded-2xl cursor-pointer transition-all group">
                         <img src={car.image} alt="" className="w-12 h-12 object-cover rounded-xl border border-white/10 group-hover:border-primary/50" />
                         <div className="flex-1">
                           <p className="text-white font-bold group-hover:text-primary transition-colors">{car.brand} {car.model}</p>
                           <p className="text-[10px] text-gray-400 capitalize mt-0.5 tracking-wider font-medium">{car.transmission} • {car.fuel_type} • {car.category} • {car.seating_capacity} Seats</p>
                         </div>
                       </div>
                     ))}
                   </div>
                ) : (
                  <p className="text-xs text-gray-500 text-center py-6 font-medium italic">No vehicles match your specific criteria.</p>
                )}
              </motion.div>
            )}
          </AnimatePresence>
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
