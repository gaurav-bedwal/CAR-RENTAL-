import React, { useEffect, useState } from 'react'
import Title from '../../components/owner/Title'
import { useAppContext } from '../../context/AppContext'
import toast from 'react-hot-toast'

const ManageBookings = () => {

  const { currency, axios } = useAppContext()

  const [bookings, setBookings] = useState([])

  const fetchOwnerBookings = async ()=>{
    try {
      const { data } = await axios.get('/api/bookings/owner')
      data.success ? setBookings(data.bookings) : toast.error(data.message)
    } catch (error) {
      toast.error(error.message)
    }
  }

  const changeBookingStatus = async (bookingId, status)=>{
    try {
      const { data } = await axios.post('/api/bookings/change-status', {bookingId, status})
      if(data.success){
        toast.success(data.message)
        fetchOwnerBookings()
      }else{
        toast.error(data.message)
      }
      
    } catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(()=>{
    fetchOwnerBookings()
  },[])

  return (
    <div className='px-4 pt-10 md:px-10 w-full min-h-screen bg-[#0B0D17]'>
      
      <Title title="Manage Bookings" subTitle="Track all customer bookings, approve or cancel requests, and manage booking statuses."/>

      <div className='max-w-5xl w-full rounded-3xl overflow-x-auto bg-[#141824] border border-white/5 shadow-2xl mt-8 mb-20'>

        <table className='w-full border-collapse text-left text-sm text-gray-400 min-w-[700px]'>
          <thead className='text-gray-500 uppercase tracking-widest text-xs bg-[#1a1a1a]'>
            <tr>
              <th className="p-4 pl-6 font-medium">Car & User</th>
              <th className="p-4 font-medium max-md:hidden">Date Range</th>
              <th className="p-4 font-medium">Total</th>
              <th className="p-4 font-medium">Status / Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking, index)=>(
              <tr key={index} className='border-t border-white/5 hover:bg-white/[0.02] transition-colors'>

                <td className='p-4 pl-6 flex items-center gap-4'>
                  <img src={booking.car?.image || assets.car_logo} alt="" className='h-12 w-12 xl:h-14 xl:w-14 aspect-square rounded-xl object-cover border border-white/10'/>
                  <div>
                    <p className='font-bold text-white tracking-wide'>{booking.car?.brand || 'Deleted'} {booking.car?.model || 'Car'}</p>
                    <p className='text-xs text-gray-500 mt-1 uppercase tracking-wider'>{booking.user?.name || "Deleted User"}</p>
                  </div>
                </td>

                <td className='p-4 max-md:hidden'>
                  <div className='flex flex-col'>
                    <span className="text-white">{new Date(booking.pickupDate).toLocaleDateString()}</span>
                    <span className="text-gray-500 text-xs mt-1">to {new Date(booking.returnDate).toLocaleDateString()}</span>
                  </div>
                </td>

                <td className='p-4'>
                  <span className='text-base text-primary font-bold tracking-tight'>{currency}{booking.price}</span>
                </td>

                <td className='p-4 align-middle'>
                  {booking.status === 'pending' ? (
                     <div className="flex items-center gap-2">
                        <button 
                           onClick={() => changeBookingStatus(booking._id, 'confirmed')}
                           className="px-3 py-1.5 rounded-lg bg-green-500/10 text-green-400 border border-green-500/20 hover:bg-green-500/20 transition-colors font-semibold text-xs uppercase tracking-wider"
                        >
                           Accept
                        </button>
                        <button 
                           onClick={() => changeBookingStatus(booking._id, 'cancelled')}
                           className="px-3 py-1.5 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-colors font-semibold text-xs uppercase tracking-wider"
                        >
                           Decline
                        </button>
                     </div>
                  ): (
                    <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest ${booking.status === 'confirmed' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                      {booking.status}
                    </span>
                  )}
                </td>

              </tr>
            ))}
          </tbody>
        </table>

        {bookings.length === 0 && <div className='p-8 text-center text-gray-500 italic'>No bookings found.</div>}

      </div>

    </div>
  )
}

export default ManageBookings
