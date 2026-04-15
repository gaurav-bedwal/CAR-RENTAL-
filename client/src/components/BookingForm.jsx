import React, { useState } from 'react'
import { cityList, assets } from '../assets/assets'
import { useAppContext } from '../context/AppContext'
import { motion } from 'framer-motion'

const BookingForm = () => {
    const [pickupLocation, setPickupLocation] = useState('')
    const { pickupDate, setPickupDate, returnDate, setReturnDate, navigate } = useAppContext()

    const getLocalISOString = () => {
        const now = new Date();
        const tzoffset = now.getTimezoneOffset() * 60000;
        return (new Date(now - tzoffset)).toISOString().slice(0, 16);
    };

    const handleSearch = (e) => {
        e.preventDefault()
        navigate('/cars?pickupLocation=' + pickupLocation + '&pickupDate=' + pickupDate + '&returnDate=' + returnDate)
    }

    return (
        <form 
            onSubmit={handleSearch} 
            className='glass-panel p-6 md:p-4 rounded-3xl border border-white/10 flex flex-col md:flex-row items-center gap-4 bg-[#111]/40 backdrop-blur-xl shadow-2xl overflow-hidden relative group'
        >
            {/* Animated border gradient effect on hover */}
            <div className="absolute -inset-[2px] bg-gradient-to-r from-primary/0 via-primary/50 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-[2px] rounded-[1.8rem] z-0"></div>

            <div className='flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-8 flex-grow w-full z-10 px-4'>
                <div className='flex flex-col items-start gap-1 w-full md:w-auto'>
                    <p className='text-[10px] text-primary-dull font-bold uppercase tracking-[0.2em] mb-1'>Location</p>
                    <div className='relative w-full overflow-hidden'>
                        <select 
                            required 
                            value={pickupLocation} 
                            onChange={(e) => setPickupLocation(e.target.value)} 
                            className="bg-transparent text-white text-lg font-medium outline-none w-full md:min-w-[180px] appearance-none cursor-pointer border-b border-white/10 focus:border-primary pb-2 transition-all"
                        >
                            <option value="" className="bg-[#0a0a0a] text-gray-500">Pick a City</option>
                            {cityList.map((city) => <option key={city} value={city} className="bg-[#0a0a0a] text-white py-2">{city}</option>)}
                        </select>
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none opacity-50">
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                        </div>
                    </div>
                </div>

                <div className='hidden md:block w-[1px] h-12 bg-white/5'></div>

                <div className='flex flex-col items-start gap-1 w-full md:w-auto'>
                    <label htmlFor='pickup-date' className='text-[10px] text-primary-dull font-bold uppercase tracking-[0.2em] mb-1'>Pick-up</label>
                    <input 
                        value={pickupDate} 
                        onChange={e => setPickupDate(e.target.value)} 
                        type="datetime-local" 
                        id="pickup-date" 
                        min={getLocalISOString()} 
                        className='bg-transparent text-white text-[15px] font-medium outline-none w-full md:w-auto cursor-pointer border-b border-white/10 focus:border-primary pb-2 transition-all [color-scheme:dark]' 
                        required 
                    />
                </div>

                <div className='hidden md:block w-[1px] h-12 bg-white/5'></div>

                <div className='flex flex-col items-start gap-1 w-full md:w-auto'>
                    <label htmlFor='return-date' className='text-[10px] text-primary-dull font-bold uppercase tracking-[0.2em] mb-1'>Return</label>
                    <input 
                        value={returnDate} 
                        onChange={e => setReturnDate(e.target.value)} 
                        type="datetime-local" 
                        id="return-date" 
                        min={pickupDate || getLocalISOString()} 
                        className='bg-transparent text-white text-[15px] font-medium outline-none w-full md:w-auto cursor-pointer border-b border-white/10 focus:border-primary pb-2 transition-all [color-scheme:dark]' 
                        required 
                    />
                </div>
            </div>

            <motion.button
                whileHover={{ scale: 1.02, x: 5 }}
                whileTap={{ scale: 0.98 }}
                className='flex items-center justify-center gap-3 px-10 py-5 w-full md:w-auto bg-primary text-[#0a0a0a] font-black rounded-2xl md:rounded-2xl cursor-pointer transition-all shadow-[0_15px_30px_rgba(212,175,55,0.2)] hover:shadow-[0_20px_40px_rgba(212,175,55,0.3)] z-10'
            >
                <img src={assets.search_icon} alt="search" className='brightness-0 w-5 h-5' />
                <span className="uppercase tracking-[0.1em]">Find Cars</span>
            </motion.button>
        </form>
    )
}

export default BookingForm
