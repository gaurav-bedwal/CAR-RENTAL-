import React, { useEffect, useState } from 'react'
import { assets } from '../assets/assets'
import Title from '../components/Title'
import { useAppContext } from '../context/AppContext'
import toast from 'react-hot-toast'
import { motion } from 'motion/react'

const MyBookings = () => {

  const { axios, user, currency } = useAppContext()

  const [bookings, setBookings] = useState([])

  const fetchMyBookings = async () => {
    try {
      const { data } = await axios.get('/api/bookings/user')
      if (data.success) {
        setBookings(data.bookings)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(() => {
    user && fetchMyBookings()
  }, [user])

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}

      className='px-4 md:px-16 lg:px-24 xl:px-32 2xl:px-48 py-10 md:py-16 text-sm max-w-7xl mx-auto bg-[#0B0D17] min-h-screen text-gray-300'>

      <Title title='My Bookings'
        subTitle='View and manage your all car bookings'
        align="left" />

      <div>
        {bookings.map((booking, index) => (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.4 }}

            key={booking._id} className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 p-6 md:p-8 bg-[#141824] border border-white/5 hover:border-primary/30 transition-all duration-300 rounded-2xl mt-5 shadow-2xl'>
            {/* Car Image + Info */}

            <div className='md:col-span-1'>
              <div className='rounded-xl overflow-hidden mb-4 shadow-md border border-white/5'>
                <img src={booking.car?.image || assets.car_logo} alt="" className='w-full h-auto aspect-video object-cover hover:scale-105 transition-transform duration-500' />
              </div>
              <p className='text-xl font-bold text-white tracking-wide mt-2'>{booking.car?.brand || 'Deleted'} {booking.car?.model || 'Car'}</p>

              <p className='text-gray-400 mt-1 uppercase tracking-wider text-xs font-semibold'>{booking.car?.year || 'N/A'} <span className="text-gray-600 mx-1">•</span> {booking.car?.category || 'Deleted'} <span className="text-gray-600 mx-1">•</span> {booking.car?.location || 'Unknown'}</p>
            </div>

            {/* Booking Info */}
            <div className='sm:col-span-2 md:px-6 order-last sm:order-none'>
              <div className='flex items-center gap-3'>
                <p className='px-4 py-1.5 bg-[#0a0a0a] border border-white/5 rounded-lg text-gray-300 font-semibold uppercase tracking-wider text-xs'>Booking #{index + 1}</p>
                <p className={`px-4 py-1.5 text-xs rounded-full font-bold uppercase tracking-wider ${booking.status === 'confirmed' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>{booking.status}</p>
              </div>

              <div className='flex items-start gap-4 mt-6 bg-[#0a0a0a] p-4 rounded-xl border border-white/5'>
                <img src={assets.calendar_icon_colored} alt="" className='w-5 h-5 mt-0.5 brightness-200 opacity-80' />
                <div>
                  <p className='text-gray-500 text-xs uppercase tracking-widest mb-1'>Rental Period</p>
                  <p className="text-gray-300 font-medium">{booking.pickupDate.split('T')[0]} <span className="text-gray-600 mx-2">to</span> {booking.returnDate.split('T')[0]}</p>
                </div>
              </div>

              <div className='flex items-start gap-4 mt-4 bg-[#0B0D17] p-4 rounded-xl border border-white/5'>
                <img src={assets.location_icon_colored} alt="" className='w-5 h-5 mt-0.5 brightness-200 opacity-80' />
                <div>
                  <p className='text-gray-500 text-xs uppercase tracking-widest mb-1'>Pick-up Location</p>
                  <p className="text-gray-300 font-medium">{booking.car?.location || 'N/A'}</p>
                </div>
              </div>
            </div>

            {/* Price */}
            <div className='md:col-span-1 flex flex-col justify-center gap-6 md:border-l border-white/10 md:pl-6'>
              <div className='text-sm text-gray-400 text-left md:text-right'>
                <p className="text-xs uppercase tracking-widest text-gray-500 mb-1">Total Price</p>
                <h1 className='text-3xl font-bold text-primary tracking-tight'>{currency}{booking.price}</h1>
                <p className="mt-4 text-xs text-gray-500">Booked on {booking.createdAt ? booking.createdAt.split('T')[0] : 'N/A'}</p>
              </div>
            </div>


          </motion.div>
        ))}
      </div>

    </motion.div>
  )
}

export default MyBookings
