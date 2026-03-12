import React, { useState, useEffect } from 'react'
import { assets, cityList } from '../assets/assets'
import { useAppContext } from '../context/AppContext'
import { motion, AnimatePresence } from 'framer-motion'
import BookingForm from './BookingForm'

const Hero = () => {
    const { assets } = useAppContext()

    return (
        <div className='relative min-h-[90vh] flex flex-col items-center justify-center bg-[#0a0a0a] overflow-hidden pt-28 pb-10'>
            
            {/* Background Decorative Elements */}
            <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-primary/10 blur-[100px] rounded-full point-events-none"></div>
            <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] bg-primary/5 blur-[80px] rounded-full point-events-none"></div>

            <div className='max-w-7xl w-full px-6 flex flex-col md:flex-row items-center justify-between gap-12 z-10'>
                
                {/* Text Content */}
                <div className='flex-1 text-center md:text-left'>
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                        <h2 className='text-primary font-bold uppercase tracking-[0.3em] mb-4 text-sm'>Premium Car Rental</h2>
                        <h1 className='text-5xl md:text-8xl font-black text-white leading-[1.1] mb-6 tracking-tighter'>
                            DRIVE THE <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-primary-dull to-primary/50">FUTURE</span>
                        </h1>
                        <p className='text-gray-400 text-lg md:text-xl max-w-lg mb-8 leading-relaxed font-light'>
                            Indulge in the world's most exclusive automobile collection. Seamless rentals, peerless performance, and the gold standard of service.
                        </p>
                    </motion.div>

                    {/* Quick Stats or Features */}
                    <div className='flex items-center justify-center md:justify-start gap-10 mt-4'>
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                            className='flex flex-col'
                        >
                            <span className='text-2xl font-bold text-white tracking-widest'>500+</span>
                            <span className='text-xs text-gray-500 uppercase tracking-widest'>Luxury Cars</span>
                        </motion.div>
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6 }}
                            className='flex flex-col border-l border-white/10 pl-10'
                        >
                            <span className='text-2xl font-bold text-white tracking-widest'>24/7</span>
                            <span className='text-xs text-gray-500 uppercase tracking-widest'>Vip Support</span>
                        </motion.div>
                    </div>
                </div>

                {/* Hero Image */}
                <motion.div 
                    initial={{ opacity: 0, scale: 0.8, x: 50 }}
                    animate={{ opacity: 1, scale: 1, x: 0 }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className='flex-1 relative group cursor-pointer'
                    onClick={() => {
                        const el = document.getElementById('booking-section');
                        el?.scrollIntoView({ behavior: 'smooth' });
                    }}
                >
                    <div className="absolute inset-0 bg-primary/20 blur-[120px] rounded-full scale-75 -z-10 animate-pulse"></div>
                    
                    {/* Floating Quick Action Label */}
                    <div className="absolute top-0 right-10 bg-black/60 backdrop-blur-md border border-primary/30 px-6 py-3 rounded-2xl z-20 hidden md:flex items-center gap-3 animate-bounce">
                        <div className="w-2 h-2 bg-primary rounded-full animate-ping"></div>
                        <span className="text-white text-[10px] font-black uppercase tracking-[0.2em]">Quick Book Available</span>
                    </div>

                    <img 
                        src={assets.hero_car || "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1200"} 
                        alt="Luxury Car" 
                        className='w-full h-auto object-contain drop-shadow-[0_25px_50px_rgba(0,0,0,0.5)] group-hover:scale-105 transition-transform duration-700'
                    />
                </motion.div>
            </div>

            {/* Separated Booking Form */}
            <motion.div 
                id="booking-section"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className='w-full px-6 mt-16 md:mt-24 max-w-6xl z-20'
            >
                <BookingForm />
            </motion.div>

            {/* Scroll Indicator */}
            <motion.div 
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className='absolute bottom-8 left-1/2 -translate-x-1/2 hidden md:block opacity-30'
            >
                <div className='w-[2px] h-10 bg-gradient-to-b from-primary to-transparent'></div>
            </motion.div>
        </div>
    )
}

export default Hero
