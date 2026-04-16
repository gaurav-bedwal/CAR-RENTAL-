import React, { useEffect, useState } from 'react'
import { assets } from '../../assets/assets'
import Title from '../../components/owner/Title'
import { useAppContext } from '../../context/AppContext'
import toast from 'react-hot-toast'

const Dashboard = () => {

  const { axios, isAdmin, currency } = useAppContext()

  const [data, setData] = useState({
    totalCars: 0,
    totalBookings: 0,
    pendingBookings: 0,
    completedBookings: 0,
    recentBookings: [],
    monthlyRevenue: 0,
  })

  const dashboardCards = [
    { title: "Total Cars", value: data.totalCars, icon: assets.carIconColored },
    { title: "Total Bookings", value: data.totalBookings, icon: assets.listIconColored },
    { title: "Pending", value: data.pendingBookings, icon: assets.cautionIconColored },
    { title: "Confirmed", value: data.completedBookings, icon: assets.listIconColored },
  ]

  const fetchDashboardData = async () => {
    try {
      const { data } = await axios.get('/api/owner/dashboard')
      if (data.success) {
        setData(data.dashboardData)
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
        fetchDashboardData()
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  const deleteCar = async (carId) => {
    if (!window.confirm("Are you sure you want to remove this car permanently?")) return;
    try {
      const { data } = await axios.post('/api/owner/delete-car', { carId })
      if (data.success) {
        toast.success(data.message)
        fetchDashboardData()
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(() => {
    if (isAdmin) {
      fetchDashboardData()
    }
  }, [isAdmin])

  return (
    <div className='flex-1 py-10'>
      <div className='flex flex-col md:flex-row md:items-center justify-between gap-6'>
        <Title title="Admin Dashboard" subTitle="Monitor overall platform performance including total cars, bookings, revenue, and recent activities" />
        <div className="flex items-center gap-4">
          <button 
            onClick={() => {
              const el = document.getElementById('customer-feedback-section');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            className='flex items-center justify-center gap-3 px-8 py-4 bg-[#141824] text-white border border-white/10 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:border-primary/50 hover:bg-primary/5 transition-all group'
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-primary group-hover:scale-110 transition-transform">
              <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
            </svg>
            View Ratings
          </button>
        </div>
      </div>

      <div className='grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 my-10 w-full'>
        {dashboardCards.map((card, index) => (
          <div key={index} className='flex gap-4 items-center justify-between p-8 rounded-[2rem] border border-white/10 bg-[#141824]/40 backdrop-blur-sm hover:border-primary/40 hover:bg-primary/5 transition-all duration-500 shadow-2xl group'>
            <div>
              <h1 className='text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-2 group-hover:text-primary transition-colors'>{card.title}</h1>
              <p className='text-4xl font-extrabold tracking-tighter text-white leading-none'>{card.value}</p>
            </div>
            <div className='flex items-center justify-center w-16 h-16 rounded-2xl bg-[#0B0D17] border border-white/5 shadow-inner group-hover:scale-110 transition-transform'>
              <img src={card.icon} alt="" className='h-7 w-7 opacity-90' />
            </div>
          </div>
        ))}
      </div>


      <div className='grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12 w-full'>
        {/* recent booking  */}
        <div className='lg:col-span-2 p-6 md:p-8 bg-[#141824] border border-white/5 rounded-3xl shadow-2xl'>
          <h1 className='text-xl md:text-2xl font-bold text-white tracking-wide'>Recent Bookings</h1>
          <p className='text-sm text-gray-400 mt-1 mb-6 font-light'>Quickly manage or cancel recent customer requests</p>

          <div className="space-y-4">
            {data.recentBookings.map((booking, index) => (
              <div key={index} className='p-4 bg-[#0B0D17] border border-white/5 rounded-2xl flex items-center justify-between hover:border-primary/30 transition-all duration-300'>

                <div className='flex items-center gap-4'>
                  <div className='hidden md:flex items-center justify-center w-12 h-12 rounded-xl bg-[#141824] border border-white/5'>
                    <img src={assets.listIconColored} alt="" className='h-5 w-5 opacity-90' />
                  </div>
                  <div>
                    <p className="text-white font-semibold tracking-wide">{booking.car?.brand || 'Deleted Car'} {booking.car?.model || ''}</p>
                    <p className='text-xs text-gray-400 mt-0.5 tracking-wider'>{booking.user?.name || 'User'}</p>
                    <p className='text-[10px] uppercase tracking-widest text-gray-500 mt-1'>{booking.createdAt ? booking.createdAt.split('T')[0] : 'N/A'}</p>
                  </div>
                </div>

                <div className='flex items-center gap-4 font-medium'>
                   <p className='hidden md:block text-base text-primary font-bold tracking-tight'>{currency}{booking.price}</p>
                   <p className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest ${booking.status === 'confirmed' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : booking.status === 'cancelled' ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-orange-500/10 text-orange-400 border border-orange-500/20'}`}>{booking.status}</p>
                   
                   {/* Quick Action: Cancel Accepted Booking */}
                   {booking.status === 'confirmed' && (
                     <button 
                       onClick={() => changeBookingStatus(booking._id, 'cancelled')}
                       className='p-2 rounded-lg bg-red-500/10 hover:bg-red-500 text-red-100 transition-all text-[10px] font-bold uppercase tracking-widest'
                       title="Cancel Accepted Booking"
                     >
                       Cancel
                     </button>
                   )}
                </div>
              </div>
            ))}
          </div>
          {data.recentBookings.length === 0 && <p className="text-gray-500 text-sm italic">No recent bookings found.</p>}
        </div>

        {/* monthly revenue */}
        <div className='p-8 bg-[#141824] border border-white/5 rounded-3xl shadow-2xl relative overflow-hidden flex flex-col justify-center'>
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-[50px] rounded-full pointer-events-none"></div>
          <h1 className='text-xl md:text-2xl font-bold text-white tracking-wide'>Revenue</h1>
          <p className='text-sm text-gray-400 mt-1 mb-6 font-light'>Earnings generated this month</p>
          <p className='text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-primary to-yellow-600 tracking-tighter'>{currency}{data.monthlyRevenue}</p>
        </div>
      </div>

      {/* Quick Manage Cars Section */}
      <div className='w-full p-6 md:p-8 bg-[#141824] border border-white/5 rounded-3xl shadow-2xl mb-20'>
          <div className='flex items-center justify-between mb-6'>
             <div>
                <h1 className='text-xl md:text-2xl font-bold text-white tracking-wide'>Quick Fleet Manage</h1>
                <p className='text-sm text-gray-400 mt-1 font-light'>Instantly remove vehicles from your platform fleet</p>
             </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
             {data.allCars && data.allCars.slice(0, 6).map((car) => {
               if (!car) return null;
               return (
                 <div key={car._id} className='p-4 bg-[#0B0D17] border border-white/5 rounded-2xl flex items-center justify-between hover:border-red-500/30 transition-all duration-300'>
                   <div className='flex items-center gap-3'>
                      <img src={car.image} alt="" className='w-12 h-12 rounded-xl object-cover border border-white/10' />
                      <div>
                        <p className='text-white font-bold text-sm'>{car.brand} {car.model}</p>
                        <p className='text-[10px] uppercase text-gray-500 tracking-widest'>{car.category}</p>
                      </div>
                   </div>
                   <button 
                     onClick={() => deleteCar(car._id)}
                     className='p-2.5 rounded-xl bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white transition-all'
                     title="Remove Car Permanently"
                   >
                     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                       <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                     </svg>
                   </button>
                 </div>
               )
             })}
          </div>
          {(!data.allCars || data.allCars.length === 0) && <p className='mt-6 text-[10px] text-gray-500 italic'>No cars currently exist in the platform fleet.</p>}
          {(data.allCars && data.allCars.length > 0) && <p className='mt-6 text-[10px] text-gray-500 italic'>* This section displays cars from your fleet for rapid access.</p>}
      </div>

      {/* Recent Feedback Section */}
      <div id="customer-feedback-section" className='w-full p-6 md:p-8 bg-[#141824] border border-white/5 rounded-3xl shadow-2xl mb-8'>
          <div className='flex items-center justify-between mb-6'>
             <div>
                <h1 className='text-xl md:text-2xl font-bold text-white tracking-wide'>Recent Customer Feedback</h1>
                <p className='text-sm text-gray-400 mt-1 font-light'>Direct insights and ratings from your clientele</p>
             </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                 {(!data.recentFeedbacks || data.recentFeedbacks.length === 0) ? (
                     <p className="text-gray-500 italic col-span-full">No customer feedback has been submitted yet.</p>
                 ) : (
                     data.recentFeedbacks.map((item, index) => (
                         <div key={index} className="p-6 bg-[#0B0D17] border border-white/5 rounded-3xl relative overflow-hidden group hover:border-primary/30 transition-all duration-300 shadow-xl">
                             
                             <div className="flex justify-between items-start mb-4">
                                 <div className="flex items-center gap-3 relative z-10">
                                     {item.user?.image ? (
                                        <img src={item.user.image} alt="User" className="w-10 h-10 rounded-full border border-white/20 object-cover" />
                                     ) : (
                                        <div className="w-10 h-10 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center text-primary font-black uppercase">
                                            {item.user?.name?.charAt(0) || '?'}
                                        </div>
                                     )}
                                     <div>
                                         <p className="text-white font-bold text-sm leading-tight flex items-center gap-2">
                                            {item.user?.name || "Unknown Customer"}
                                            {item.user?._id && <span className="text-[8px] bg-white/10 px-1.5 py-0.5 rounded text-gray-400 font-mono tracking-tighter">ID:{item.user._id.toString().substring(18, 24)}</span>}
                                         </p>
                                         <p className="text-[10px] text-gray-500 tracking-widest">{item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'N/A'}</p>
                                     </div>
                                 </div>

                                 <div className="flex items-center bg-[#141824] px-3 py-1.5 rounded-xl border border-white/10 relative z-10">
                                      <span className="text-primary font-black mr-1">{item.rating}</span>
                                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-primary">
                                         <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z" clipRule="evenodd" />
                                      </svg>
                                 </div>
                             </div>

                             <div className="relative z-10">
                                 <p className="text-gray-300 text-sm leading-relaxed font-light whitespace-pre-wrap">{item.message}</p>
                             </div>

                         </div>
                     ))
                 )}
          </div>
      </div>

    </div>
  )
}

export default Dashboard
