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

  // Large, high-contrast dashboard cards
  const dashboardCards = [
    { title: "Total Fleet", value: data.totalCars, color: "bg-blue-100", textColor: "text-blue-800" },
    { title: "Total Orders", value: data.totalBookings, color: "bg-purple-100", textColor: "text-purple-800" },
    { title: "Needs Attention", value: data.pendingBookings, color: "bg-yellow-100", textColor: "text-yellow-800" },
    { title: "Successful Rentals", value: data.completedBookings, color: "bg-green-100", textColor: "text-green-800" },
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
    <div className='w-full min-h-screen pb-20'>
      <Title title="Platform Overview" subTitle="Quick look at your business numbers. Big boxes show your current progress." />

      {/* Massive Stat Boxes */}
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mt-10 w-full'>
        {dashboardCards.map((card, index) => (
          <div key={index} className={`p-10 rounded-3xl border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] ${card.color}`}>
              <h2 className={`text-sm font-black uppercase tracking-widest ${card.textColor} mb-2`}>{card.title}</h2>
              <p className='text-6xl font-black text-black tracking-tighter'>{card.value}</p>
          </div>
        ))}
      </div>


      <div className='flex flex-col lg:flex-row items-stretch gap-10 mt-12 w-full'>
        
        {/* Money Box - Extremely Prominent */}
        <div className='p-10 bg-primary border-4 border-black rounded-3xl shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] flex-shrink-0 lg:w-96 flex flex-col justify-center text-center'>
            <h2 className='text-2xl font-black uppercase text-black tracking-tighter mb-2'>Total Earnings</h2>
            <p className='text-7xl font-black text-black tracking-tighter mb-4'>{currency}{data.monthlyRevenue}</p>
            <div className='bg-black/10 py-2 rounded-xl font-bold uppercase text-xs tracking-widest'>Revenue this month</div>
        </div>

        {/* Recent Activity Mini-Card List */}
        <div className='p-8 bg-white border-4 border-black rounded-3xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex-1'>
          <h2 className='text-3xl font-black text-black uppercase tracking-tighter mb-6'>Latest History</h2>
          
          <div className="space-y-4">
            {data.recentBookings.map((booking, index) => (
              <div key={index} className='p-5 bg-gray-50 border-2 border-black rounded-2xl flex flex-wrap items-center justify-between gap-4'>

                <div className='flex items-center gap-5'>
                  <div className='w-16 h-16 rounded-xl border-2 border-black overflow-hidden bg-white'>
                      <img src={booking.car?.image || assets.car_logo} alt="" className='w-full h-full object-cover' />
                  </div>
                  <div>
                    <p className="text-xl font-black text-black uppercase leading-none">{booking.car?.brand} {booking.car?.model}</p>
                    <p className='text-sm font-bold text-gray-400 mt-1 uppercase tracking-widest'>{booking.user?.name}</p>
                  </div>
                </div>

                <div className='flex items-center gap-6'>
                  <p className='text-2xl font-black text-black'>{currency}{booking.price}</p>
                  <div className={`px-4 py-1.5 rounded-full border-2 border-black text-[10px] font-black uppercase tracking-widest ${
                    booking.status === 'confirmed' ? 'bg-green-400' : 
                    booking.status === 'completed' ? 'bg-blue-400' : 'bg-red-400'
                  }`}>
                    {booking.status}
                  </div>
                </div>
              </div>
            ))}
          </div>
          {data.recentBookings.length === 0 && <p className="text-gray-500 font-bold uppercase italic mt-4">History is empty.</p>}
        </div>

      </div>


    </div>
  )
}

export default Dashboard
