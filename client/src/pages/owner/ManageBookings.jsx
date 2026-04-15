import React, { useEffect, useState } from 'react'
import Title from '../../components/owner/Title'
import { useAppContext } from '../../context/AppContext'
import { assets } from '../../assets/assets'
import toast from 'react-hot-toast'

const ManageBookings = () => {

  const { currency, axios } = useAppContext()
  const [bookings, setBookings] = useState([])

  const fetchOwnerBookings = async () => {
    try {
      const { data } = await axios.get('/api/bookings/owner')
      if (data.success) {
        setBookings(data.bookings)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  const changeBookingStatus = async (bookingId, status) => {
    try {
      const { data } = await axios.post('/api/bookings/change-status', { bookingId, status })
      if (data.success) {
        toast.success(data.message)
        fetchOwnerBookings()
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(() => {
    fetchOwnerBookings()
  }, [])

  return (
    <div className='w-full min-h-screen pb-20'>
      
      <Title title="Customer Bookings" subTitle="Review and manage all rental requests. Use the large buttons below to take action."/>

      <div className='grid gap-8 mt-10'>
        {bookings.map((booking, index) => (
          <div key={index} className='bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-3xl overflow-hidden flex flex-col md:flex-row p-6 md:p-8 hover:translate-y-[-4px] transition-all'>
            
            {/* Display Car Image */}
            <div className='w-full md:w-64 h-48 rounded-2xl overflow-hidden border-2 border-black flex-shrink-0'>
               <img src={booking.car?.image || assets.car_logo} alt="" className='w-full h-full object-cover'/>
            </div>

            {/* Details Section */}
            <div className='flex-1 md:ml-8 mt-6 md:mt-0'>
                <div className='flex justify-between items-start'>
                   <div>
                      <h2 className='text-3xl font-black uppercase text-black'>{booking.car?.brand} {booking.car?.model}</h2>
                      <p className='text-gray-500 font-bold uppercase tracking-widest text-sm mt-1'>Price: {currency}{booking.price}</p>
                   </div>
                   <div className={`px-5 py-2 rounded-full border-2 border-black font-black uppercase tracking-widest text-sm ${
                     booking.status === 'confirmed' ? 'bg-green-400' : 
                     booking.status === 'pending' ? 'bg-yellow-400' : 
                     booking.status === 'completed' ? 'bg-blue-400' : 'bg-red-400'
                   }`}>
                      {booking.status}
                   </div>
                </div>

                <div className='mt-6 grid grid-cols-1 md:grid-cols-2 gap-6'>
                   <div className='bg-gray-50 p-4 border-2 border-black rounded-2xl'>
                      <p className='text-xs font-black uppercase text-gray-400 mb-1 tracking-tighter'>BOOKED BY</p>
                      <p className='text-xl font-bold text-black uppercase'>{booking.user?.name}</p>
                      <p className='text-gray-600 font-medium'>{booking.user?.email}</p>
                   </div>
                   <div className='bg-gray-50 p-4 border-2 border-black rounded-2xl'>
                      <p className='text-xs font-black uppercase text-gray-400 mb-1 tracking-tighter'>RENTAL DATES</p>
                      <p className='text-xl font-bold text-black uppercase'>
                        {new Date(booking.pickupDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })} → {new Date(booking.returnDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
                      </p>
                   </div>
                </div>

                {/* Big Action Buttons */}
                <div className='mt-8 pt-6 border-t-2 border-dashed border-gray-200'>
                   {booking.status === 'pending' && (
                     <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                        <button 
                           onClick={() => changeBookingStatus(booking._id, 'confirmed')}
                           className='py-5 bg-green-500 text-white rounded-2xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all font-black uppercase text-xl tracking-tighter'
                        >
                           Accept & Book
                        </button>
                        <button 
                           onClick={() => changeBookingStatus(booking._id, 'cancelled')}
                           className='py-5 bg-red-100 text-red-600 rounded-2xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all font-black uppercase text-xl tracking-tighter'
                        >
                           Decline Request
                        </button>
                     </div>
                   )}

                   {booking.status === 'confirmed' && (
                      <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                         <button 
                            onClick={() => changeBookingStatus(booking._id, 'completed')}
                            className='py-5 bg-blue-500 text-white rounded-2xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all font-black uppercase text-xl tracking-tighter'
                         >
                            Booking Completed & Relist
                         </button>
                         <button 
                            onClick={() => changeBookingStatus(booking._id, 'cancelled')}
                            className='py-5 bg-red-100 text-red-600 rounded-2xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all font-black uppercase text-xl tracking-tighter'
                         >
                            Cancel Booking
                         </button>
                      </div>
                   )}

                   {booking.status === 'completed' && (
                      <p className='text-center py-4 bg-gray-100 border-2 border-black rounded-2xl font-black uppercase text-gray-500 tracking-widest'>
                         This booking is finished. Car is relisted.
                      </p>
                   )}

                   {booking.status === 'cancelled' && (
                      <p className='text-center py-4 bg-red-50 border-2 border-black rounded-2xl font-black uppercase text-red-800 tracking-widest'>
                         This booking was cancelled.
                      </p>
                   )}
                </div>
            </div>

          </div>
        ))}

        {bookings.length === 0 && (
          <div className='py-20 text-center border-4 border-dashed border-gray-300 rounded-3xl'>
             <p className='text-2xl font-bold text-gray-400 uppercase tracking-widest'>No rental bookings yet.</p>
          </div>
        )}
      </div>

    </div>
  )
}

export default ManageBookings
