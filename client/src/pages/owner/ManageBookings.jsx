import React, { useEffect, useState } from 'react'
import Title from '../../components/owner/Title'
import { useAppContext } from '../../context/AppContext'
import { assets } from '../../assets/assets'
import toast from 'react-hot-toast'

const ManageBookings = () => {

  const { currency, axios } = useAppContext()

  const [bookings, setBookings] = useState([])
  const [filter, setFilter] = useState('all')

  const tabs = [
    { id: 'all', label: 'All Bookings' },
    { id: 'pending', label: 'Pending Action' },
    { id: 'confirmed', label: 'Confirmed' },
    { id: 'completed', label: 'Completed' },
    { id: 'cancelled', label: 'Cancelled' },
  ]

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

  const deleteBooking = async (bookingId) => {
    if (!window.confirm("Are you sure you want to permanently delete this booking? This action cannot be undone.")) return;
    
    try {
      const { data } = await axios.post('/api/bookings/delete', { bookingId })
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

  useEffect(()=>{
    fetchOwnerBookings()
  },[])

  return (
    <div className='w-full'>
      
      <Title title="Manage Bookings" subTitle="Track all customer bookings, approve or cancel requests, and manage booking statuses."/>

      {/* Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar mt-6 mb-2 pb-2">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id)}
            className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap ${
              filter === tab.id 
              ? 'bg-primary text-[#0a0a0a] shadow-[0_0_15px_rgba(212,175,55,0.3)]' 
              : 'bg-[#141824] text-gray-400 border border-white/5 hover:border-primary/50 hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className='max-w-5xl w-full rounded-3xl overflow-x-auto bg-[#141824] border border-white/5 shadow-2xl mt-4 mb-20'>

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
            {(filter === 'all' ? bookings : bookings.filter(b => b.status === filter)).map((booking, index)=>(
              <tr key={index} className='border-t border-white/5 hover:bg-white/[0.02] transition-colors'>

                <td className='p-4 pl-6 flex items-center gap-4'>
                  <img src={booking.car?.image || assets.car_logo} alt="" className='h-12 w-12 xl:h-14 xl:w-14 aspect-square rounded-xl object-cover border border-white/10'/>
                  <div>
                    <p className='font-bold text-white tracking-wide'>{booking.car?.brand || 'Deleted'} {booking.car?.model || 'Car'}</p>
                    <div className='flex flex-col mt-1'>
                       <p className='text-xs text-primary uppercase tracking-wider font-semibold'>{booking.user?.name || "Deleted User"}</p>
                       <p className='text-[11px] text-gray-500 tracking-wide lowercase'>{booking.user?.email || "No email"}</p>
                    </div>
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
                     <div className="flex items-center gap-2">
                       <select 
                         value={booking.status} 
                         onChange={(e) => changeBookingStatus(booking._id, e.target.value)}
                         className={`outline-none px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-widest cursor-pointer ${booking.status === 'confirmed' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}
                       >
                         <option value="pending" className='bg-[#0a0a0a] text-gray-300'>Pending</option>
                         <option value="confirmed" className='bg-[#0a0a0a] text-green-400'>Confirmed</option>
                         <option value="completed" className='bg-[#0a0a0a] text-blue-400'>Completed</option>
                         <option value="cancelled" className='bg-[#0a0a0a] text-red-400'>Cancelled</option>
                       </select>

                       {(booking.status === 'cancelled' || booking.status === 'completed') && (
                          <button 
                            onClick={() => deleteBooking(booking._id)}
                            className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-all border border-red-500/20"
                            title="Delete Permanently"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                              <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                            </svg>
                          </button>
                       )}
                    </div>
                  )}
                </td>

              </tr>
            ))}
          </tbody>
        </table>

        {(filter === 'all' ? bookings : bookings.filter(b => b.status === filter)).length === 0 && (
          <div className='p-12 text-center text-gray-500 flex flex-col items-center justify-center gap-3'>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 opacity-30">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
            </svg>
            <p className="text-xs uppercase tracking-widest font-medium">No {filter !== 'all' ? filter : ''} bookings found.</p>
          </div>
        )}

      </div>

    </div>
  )
}

export default ManageBookings
