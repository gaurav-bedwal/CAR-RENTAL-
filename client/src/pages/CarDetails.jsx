import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { assets, dummyCarData } from '../assets/assets'
import Loader from '../components/Loader'
import { useAppContext } from '../context/AppContext'
import toast from 'react-hot-toast'
import { motion } from 'motion/react'

const CarDetails = () => {

  const { id } = useParams()

  const { cars, axios, pickupDate, setPickupDate, returnDate, setReturnDate } = useAppContext()

  const navigate = useNavigate()
  const [car, setCar] = useState(null)
  const currency = import.meta.env.VITE_CURRENCY

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post('/api/bookings/create', {
        car: id,
        pickupDate,
        returnDate
      })

      if (data.success) {
        toast.success(data.message)
        navigate('/my-bookings')
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(() => {
    setCar(cars.find(car => car._id === id))
  }, [cars, id])

  return car ? (
    <div className='px-6 md:px-16 lg:px-24 xl:px-32 py-16 bg-[#0a0a0a] min-h-screen text-gray-300'>

      <button onClick={() => navigate(-1)} className='flex items-center gap-2 mb-8 text-gray-400 hover:text-primary transition-colors cursor-pointer group uppercase tracking-wider text-sm font-semibold'>
        <img src={assets.arrow_icon} alt="" className='rotate-180 brightness-200 opacity-60 group-hover:invert transition-all mr-1' />
        Back to all cars
      </button>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12'>
        {/* Left: Car Image & Details */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}

          className='lg:col-span-2'>
          <div className="relative rounded-2xl overflow-hidden shadow-2xl mb-8 border border-white/5">
            <motion.img
              initial={{ scale: 0.98, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}

              src={car.image} alt="" className='w-full h-auto md:max-h-120 object-cover' />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] to-transparent opacity-60"></div>
          </div>

          <motion.div className='space-y-8 bg-[#111] p-8 rounded-2xl border border-white/5 shadow-xl'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <div>
              <h1 className='text-3xl md:text-4xl font-bold text-white tracking-wide'>{car.brand} {car.model}</h1>
              <p className='text-primary text-lg mt-2 uppercase tracking-wider font-semibold'>{car.category} <span className="text-gray-600 mx-2">•</span> <span className="text-gray-400">{car.year}</span></p>
            </div>
            <hr className='border-white/10 my-6' />

            <div className='grid grid-cols-2 sm:grid-cols-4 gap-4'>
              {[
                { icon: assets.users_icon, text: `${car.seating_capacity} Seats` },
                { icon: assets.fuel_icon, text: car.fuel_type },
                { icon: assets.car_icon, text: car.transmission },
                { icon: assets.location_icon, text: car.location },
              ].map(({ icon, text }) => (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}

                  key={text} className='flex flex-col items-center justify-center bg-[#0a0a0a] border border-white/5 py-6 px-4 rounded-xl hover:border-primary/30 transition-colors'>
                  <img src={icon} alt="" className='h-6 mb-3 brightness-200 opacity-60' />
                  <span className="text-sm tracking-wide text-gray-300">{text}</span>
                </motion.div>
              ))}
            </div>

            {/* Description */}
            <div>
              <h1 className='text-xl md:text-2xl font-semibold text-white mb-4 tracking-wide'>Description</h1>
              <p className='text-gray-400 leading-relaxed font-light'>{car.description}</p>
            </div>

            {/* Features */}
            <div>
              <h1 className='text-xl md:text-2xl font-semibold text-white mb-4 tracking-wide'>Features</h1>
              <ul className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                {
                  ["360 Camera", "Bluetooth", "GPS", "Heated Seats", "Rear View Mirror"].map((item) => (
                    <li key={item} className='flex items-center text-gray-400 bg-[#0a0a0a] rounded-lg px-4 py-3 border border-white/5'>
                      <img src={assets.check_icon} className='h-4 mr-3 brightness-200 opacity-80' alt="" />
                      {item}
                    </li>
                  ))
                }
              </ul>
            </div>

          </motion.div>
        </motion.div>

        {/* Right: Booking Form */}
        <motion.form
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}

          onSubmit={handleSubmit} className='bg-[#111] border border-white/5 shadow-2xl h-max sticky top-[100px] rounded-2xl p-8 space-y-6 text-gray-300'>

          <p className='flex items-end justify-between font-semibold'>
            <span className='text-3xl text-white font-bold tracking-tight'>{currency}{car.pricePerDay}</span>
            <span className='text-sm text-gray-500 uppercase tracking-widest pb-1'>per day</span>
          </p>

          <hr className='border-white/10 my-6' />

          <div className='flex flex-col gap-2'>
            <label htmlFor="pickup-date" className="text-xs uppercase tracking-widest text-gray-400 font-semibold mb-1">Pickup Date</label>
            <input value={pickupDate} onChange={(e) => setPickupDate(e.target.value)}
              type="date" className='border border-white/10 bg-[#0a0a0a] text-white px-4 py-3 rounded-xl focus:border-primary/50 outline-none transition-colors [color-scheme:dark]' required id='pickup-date' min={new Date().toISOString().split('T')[0]} />
          </div>

          <div className='flex flex-col gap-2'>
            <label htmlFor="return-date" className="text-xs uppercase tracking-widest text-gray-400 font-semibold mb-1 mt-2">Return Date</label>
            <input value={returnDate} onChange={(e) => setReturnDate(e.target.value)}
              type="date" className='border border-white/10 bg-[#0a0a0a] text-white px-4 py-3 rounded-xl focus:border-primary/50 outline-none transition-colors [color-scheme:dark]' required id='return-date' min={pickupDate || new Date().toISOString().split('T')[0]} />
          </div>

          <button className='w-full bg-primary hover:bg-primary-dull transition-all py-4 mt-4 font-bold tracking-wider uppercase text-sm text-[#0a0a0a] rounded-xl cursor-pointer shadow-[0_0_15px_rgba(212,175,55,0.3)] hover:shadow-[0_0_20px_rgba(212,175,55,0.5)]'>Book Now</button>

          <p className='text-center text-xs text-gray-500 uppercase tracking-widest mt-4'>No credit card required to reserve</p>

        </motion.form>
      </div>

    </div>
  ) : <Loader />
}

export default CarDetails
