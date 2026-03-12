import React from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'

const CarCard = ({ car }) => {

  const currency = import.meta.env.VITE_CURRENCY
  const navigate = useNavigate()

  return (
    <div onClick={() => { navigate(`/car-details/${car._id}`); scrollTo(0, 0) }} className='group rounded-2xl overflow-hidden shadow-2xl bg-[#111] border border-white/5 hover:border-primary/30 hover:-translate-y-2 transition-all duration-500 cursor-pointer'>

      <div className='relative h-56 overflow-hidden'>
        <img src={car.image} alt="Car Image" className='w-full h-full object-cover transition-transform duration-700 group-hover:scale-110' />
        <div className="absolute inset-0 bg-gradient-to-t from-[#111] to-transparent opacity-80"></div>

        {car.isAvaliable && <p className='absolute top-4 left-4 bg-primary text-[#0a0a0a] font-bold tracking-wide text-xs px-3 py-1.5 rounded-full shadow-[0_0_10px_rgba(212,175,55,0.4)]'>Available Now</p>}

        <div className='absolute bottom-4 right-4 bg-black/60 backdrop-blur-md border border-white/10 text-white px-4 py-2 rounded-xl'>
          <span className='font-bold text-xl text-primary'>{currency}{car.pricePerDay}</span>
          <span className='text-sm text-gray-300'> / day</span>
        </div>
      </div>

      <div className='p-6'>
        <div className='flex justify-between items-start mb-4 border-b border-white/5 pb-4'>
          <div>
            <h3 className='text-xl font-bold text-white tracking-wide'>{car.brand} {car.model}</h3>
            <p className='text-primary text-sm mt-1 uppercase tracking-wider'>{car.category} <span className="text-gray-500 mx-1">•</span> <span className="text-gray-400">{car.year}</span></p>
          </div>
        </div>

        <div className='mt-4 grid grid-cols-2 gap-y-4 text-gray-400'>
          <div className='flex items-center text-sm font-light'>
            <img src={assets.users_icon} alt="" className='h-4 mr-3 brightness-200 opacity-60' />
            <span>{car.seating_capacity} Seats</span>
          </div>
          <div className='flex items-center text-sm font-light'>
            <img src={assets.fuel_icon} alt="" className='h-4 mr-3 brightness-200 opacity-60' />
            <span>{car.fuel_type}</span>
          </div>
          <div className='flex items-center text-sm font-light'>
            <img src={assets.car_icon} alt="" className='h-4 mr-3 brightness-200 opacity-60' />
            <span>{car.transmission}</span>
          </div>
          <div className='flex items-center text-sm font-light'>
            <img src={assets.location_icon} alt="" className='h-4 mr-3 brightness-200 opacity-60' />
            <span>{car.location}</span>
          </div>
        </div>
        <div className='mt-6 flex items-center justify-between gap-4'>
          <button className='flex-1 bg-primary/10 text-primary hover:bg-primary hover:text-black py-2.5 rounded-xl font-bold transition-all duration-300 uppercase text-[10px] tracking-[0.2em] border border-primary/20 group-hover:border-primary'>
            Learn More
          </button>
          <button className='flex-[1.5] bg-primary text-[#0a0a0a] py-2.5 rounded-xl font-black transition-all duration-300 uppercase text-[10px] tracking-[0.2em] shadow-[0_5px_15px_rgba(212,175,55,0.2)] hover:shadow-[0_8px_20px_rgba(212,175,55,0.4)]'>
            Book Now
          </button>
        </div>
      </div>

    </div>
  )
}

export default CarCard
