import React from 'react'
import { assets } from '../assets/assets'
import { motion } from 'motion/react'

const Banner = () => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className='flex flex-col md:flex-row md:items-center items-center justify-between px-10 md:px-20 py-12 bg-gradient-to-br from-[#111] via-[#151515] to-[#0a0a0a] border border-white/5 max-w-7xl mx-4 md:mx-auto rounded-[3rem] overflow-hidden shadow-2xl relative my-20 group'
    >

      {/* Dynamic background glow */}
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/20 blur-[100px] rounded-full pointer-events-none group-hover:bg-primary/30 transition-all duration-1000"></div>
      <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-primary/10 blur-[80px] rounded-full pointer-events-none"></div>

      <div className='text-white z-10 text-center md:text-left flex-1'>
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className='text-3xl md:text-5xl font-black tracking-tighter leading-none'
        >
          EARN WITH YOUR <br />
          <span className="text-primary italic">LUXURY ASSET</span>
        </motion.h2>
        <p className='mt-6 text-gray-400 text-lg font-light max-w-md leading-relaxed'>
          Join an exclusive network of high-net-worth owners. Monetize your vehicle with complete security, insurance coverage, and white-glove management.
        </p>

        <motion.button
          whileHover={{ scale: 1.05, boxShadow: "0 0 25px rgba(212,175,55,0.4)" }}
          whileTap={{ scale: 0.95 }}
          className='px-10 py-4 bg-primary text-[#0a0a0a] font-black tracking-widest uppercase text-xs rounded-2xl mt-10 transition-all cursor-pointer shadow-xl'
        >
          Begin Listing
        </motion.button>
      </div>

      <motion.div 
        initial={{ opacity: 0, x: 100, rotate: 5 }}
        whileInView={{ opacity: 1, x: 0, rotate: 0 }}
        transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
        className='flex-1 flex justify-end mt-12 md:mt-0'
      >
        <img 
          src={assets.banner_car_image} 
          alt="Luxury Car" 
          className='w-full max-w-md md:max-w-xl object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.6)]' 
        />
      </motion.div>

    </motion.div>
  )
}

export default Banner
