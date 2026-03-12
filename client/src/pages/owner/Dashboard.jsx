import React, { useEffect, useState } from 'react'
import { assets, dummyDashboardData } from '../../assets/assets'
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

  useEffect(() => {
    if (isAdmin) {
      fetchDashboardData()
    }
  }, [isAdmin])

  return (
    <div className='px-6 md:px-12 py-10 flex-1 bg-[#0B0D17] min-h-screen'>
      <Title title="Admin Dashboard" subTitle="Monitor overall platform performance including total cars, bookings, revenue, and recent activities" />

      <div className='grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 my-10 w-full'>
        {dashboardCards.map((card, index) => (
          <div key={index} className='flex gap-4 items-center justify-between p-6 rounded-2xl border border-white/5 bg-[#141824] hover:border-primary/40 hover:shadow-primary/5 transition-all duration-300 shadow-xl'>
            <div>
              <h1 className='text-xs uppercase tracking-widest text-gray-500 mb-1'>{card.title}</h1>
              <p className='text-3xl font-bold tracking-tight text-white'>{card.value}</p>
            </div>
            <div className='flex items-center justify-center w-14 h-14 rounded-xl bg-[#0B0D17] border border-white/5 shadow-inner'>
              <img src={card.icon} alt="" className='h-6 w-6 opacity-90' />
            </div>
          </div>
        ))}
      </div>


      <div className='flex flex-col lg:flex-row items-start gap-8 mb-8 w-full'>
        {/* recent booking  */}
        <div className='p-6 md:p-8 bg-[#141824] border border-white/5 rounded-3xl shadow-2xl w-full flex-grow'>
          <h1 className='text-xl md:text-2xl font-bold text-white tracking-wide'>Recent Bookings</h1>
          <p className='text-sm text-gray-400 mt-1 mb-6 font-light'>Latest customer bookings across the platform</p>

          <div className="space-y-4">
            {data.recentBookings.map((booking, index) => (
              <div key={index} className='p-4 bg-[#0B0D17] border border-white/5 rounded-2xl flex items-center justify-between hover:border-primary/30 transition-all duration-300'>

                <div className='flex items-center gap-4'>
                  <div className='hidden md:flex items-center justify-center w-12 h-12 rounded-xl bg-[#141824] border border-white/5'>
                    <img src={assets.listIconColored} alt="" className='h-5 w-5 opacity-90' />
                  </div>
                  <div>
                    <p className="text-white font-semibold tracking-wide">{booking.car?.brand || 'Deleted Car'} {booking.car?.model || ''}</p>
                    <p className='text-xs uppercase tracking-widest text-gray-500 mt-1'>{booking.createdAt ? booking.createdAt.split('T')[0] : 'N/A'}</p>
                  </div>
                </div>

                <div className='flex items-center gap-4 font-medium'>
                  <p className='text-base text-primary font-bold tracking-tight'>{currency}{booking.price}</p>
                  <p className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest ${booking.status === 'confirmed' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>{booking.status}</p>
                </div>
              </div>
            ))}
          </div>
          {data.recentBookings.length === 0 && <p className="text-gray-500 text-sm italic">No recent bookings found.</p>}
        </div>

        {/* monthly revenue */}
        <div className='p-6 md:p-8 bg-[#141824] border border-white/5 rounded-3xl shadow-2xl w-full lg:max-w-md relative overflow-hidden'>
          {/* subtle glow */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-[50px] rounded-full pointer-events-none"></div>

          <h1 className='text-xl md:text-2xl font-bold text-white tracking-wide'>Monthly Revenue</h1>
          <p className='text-sm text-gray-400 mt-1 mb-6 font-light'>Revenue generated this month</p>
          <p className='text-5xl mt-6 font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-primary to-yellow-600 tracking-tighter'>{currency}{data.monthlyRevenue}</p>
        </div>

      </div>


    </div>
  )
}

export default Dashboard
