import React, { useEffect, useState } from 'react'
import { useAppContext } from '../../context/AppContext'
import Title from '../../components/owner/Title'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import { assets } from '../../assets/assets'

const RevenueFilter = () => {
  const { axios, isAdmin, currency } = useAppContext()
  const navigate = useNavigate()

  const [data, setData] = useState({
    totalBookings: 0,
    pendingBookings: 0,
    completedBookings: 0,
    monthlyRevenue: 0,
  })

  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const fetchFilteredData = async (start = startDate, end = endDate) => {
    setIsLoading(true)
    try {
      const queryParams = new URLSearchParams();
      if (start) queryParams.append('startDate', start);
      if (end) queryParams.append('endDate', end);

      const { data } = await axios.get(`/api/owner/dashboard?${queryParams.toString()}`)
      if (data.success) {
        setData(data.dashboardData)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (isAdmin) {
      fetchFilteredData()
    }
  }, [isAdmin])

  const dashboardCards = [
    { title: "Total Bookings", value: data.totalBookings, icon: assets.listIconColored },
    { title: "Pending", value: data.pendingBookings, icon: assets.cautionIconColored },
    { title: "Confirmed/Completed", value: data.completedBookings, icon: assets.listIconColored },
  ]

  return (
    <div className='flex-1 py-10'>
      <div className='flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6'>
        <Title title="Revenue Analytics" subTitle="Filter and analyze your platform revenue by specific date ranges" />
        <button 
          onClick={() => navigate('/owner')}
          className='px-6 py-3 bg-[#141824] border border-white/10 rounded-xl hover:border-primary/50 text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-white transition-all w-max'
        >
          Back to Dashboard
        </button>
      </div>

      {/* Date Filter Section */}
      <div className='my-8 p-6 md:p-8 bg-[#141824] border border-white/5 rounded-3xl shadow-2xl flex flex-col md:flex-row gap-6 items-end justify-between relative overflow-hidden'>
        <div className="absolute top-0 left-0 w-64 h-64 bg-primary/5 blur-[80px] rounded-full pointer-events-none"></div>
        <div className='flex flex-col md:flex-row gap-6 w-full md:w-auto relative z-10'>
          <div className='flex flex-col gap-2'>
            <label className='text-xs text-gray-500 uppercase tracking-widest font-bold'>Start Date</label>
            <input 
              type="date" 
              value={startDate} 
              onChange={(e) => setStartDate(e.target.value)} 
              className='bg-[#0B0D17] text-gray-300 border border-white/10 p-3.5 rounded-xl focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all cursor-pointer'
            />
          </div>
          <div className='flex flex-col gap-2'>
            <label className='text-xs text-gray-500 uppercase tracking-widest font-bold'>End Date</label>
            <input 
              type="date" 
              value={endDate} 
              onChange={(e) => setEndDate(e.target.value)} 
              className='bg-[#0B0D17] text-gray-300 border border-white/10 p-3.5 rounded-xl focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all cursor-pointer'
            />
          </div>
        </div>
        <div className='flex gap-4 w-full md:w-auto relative z-10'>
          <button 
            onClick={() => fetchFilteredData()}
            disabled={isLoading}
            className='flex-1 md:flex-none px-10 py-3.5 bg-primary text-black font-black uppercase tracking-widest text-xs rounded-xl hover:bg-yellow-500 transition-colors shadow-[0_0_20px_rgba(212,175,55,0.2)] disabled:opacity-50'
          >
            {isLoading ? 'Loading...' : 'Apply Filter'}
          </button>
          <button 
            onClick={() => {
              setStartDate('');
              setEndDate('');
              fetchFilteredData('', '');
            }}
            disabled={isLoading}
            className='flex-1 md:flex-none px-10 py-3.5 bg-red-500/10 text-red-400 font-black uppercase tracking-widest text-xs rounded-xl border border-red-500/20 hover:bg-red-500 hover:text-white transition-all disabled:opacity-50'
          >
            Reset
          </button>
        </div>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-8 my-10 w-full'>
        {/* Filtered Revenue */}
        <div className='lg:col-span-2 p-8 md:p-12 bg-[#141824] border border-white/5 rounded-3xl shadow-2xl relative overflow-hidden flex flex-col justify-center'>
          <div className="absolute top-1/2 right-10 -translate-y-1/2 w-48 h-48 bg-primary/20 blur-[60px] rounded-full pointer-events-none"></div>
          <h1 className='text-2xl md:text-3xl font-bold text-white tracking-wide relative z-10'>Filtered Revenue</h1>
          <p className='text-sm text-gray-400 mt-2 mb-8 font-light relative z-10'>
            {startDate && endDate ? `Earnings from ${startDate} to ${endDate}` : 'Earnings generated this month (Default)'}
          </p>
          <p className='text-6xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-primary to-yellow-600 tracking-tighter relative z-10'>{currency}{data.monthlyRevenue}</p>
        </div>

        {/* Stats Column */}
        <div className='flex flex-col gap-6'>
            {dashboardCards.map((card, index) => (
              <div key={index} className='flex gap-4 items-center justify-between p-6 rounded-[2rem] border border-white/10 bg-[#141824]/40 backdrop-blur-sm hover:border-primary/40 hover:bg-primary/5 transition-all duration-500 shadow-xl group flex-1'>
                <div>
                  <h1 className='text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-2 group-hover:text-primary transition-colors'>{card.title}</h1>
                  <p className='text-3xl font-extrabold tracking-tighter text-white leading-none'>{card.value}</p>
                </div>
                <div className='flex items-center justify-center w-14 h-14 rounded-2xl bg-[#0B0D17] border border-white/5 shadow-inner group-hover:scale-110 transition-transform'>
                  <img src={card.icon} alt="" className='h-6 w-6 opacity-90' />
                </div>
              </div>
            ))}
        </div>
      </div>

    </div>
  )
}

export default RevenueFilter
