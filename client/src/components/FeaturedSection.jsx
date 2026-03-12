import React from 'react'
import Title from './Title'
import { assets } from '../assets/assets'
import CarCard from './CarCard'
import { useNavigate } from 'react-router-dom'
import { useAppContext } from '../context/AppContext'
import { motion } from 'motion/react'

const FeaturedSection = () => {

    const navigate = useNavigate()
    const { cars } = useAppContext()

    return (
        <section className='flex flex-col items-center py-20 px-6 md:px-16 lg:px-24 xl:px-32 bg-[#0a0a0a] min-h-screen relative overflow-hidden'>
            {/* Ambient background glow */}
            <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 blur-[120px] rounded-full pointer-events-none"></div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.5 }}
            >
                <Title title='Featured Vehicles' subTitle='Explore our selection of premium vehicles available for your next adventure.' />
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 100 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 1 }}
                className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-18 w-full'>
                {
                    cars.slice(0, 6).map((car) => (
                        <motion.div key={car._id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.4, ease: "easeOut" }}
                        >
                            <CarCard car={car} />
                        </motion.div>
                    ))
                }
            </motion.div>

            <motion.button
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3, duration: 0.6 }}
                onClick={() => {
                    navigate('/cars'); scrollTo(0, 0)
                }}
                className='flex items-center justify-center gap-3 px-10 py-4 border border-primary/30 text-primary hover:bg-primary/10 hover:border-primary rounded-full mt-24 cursor-pointer transition-all duration-500 tracking-[0.2em] uppercase text-xs font-black shadow-[0_0_20px_rgba(212,175,55,0.1)] hover:shadow-[0_0_30px_rgba(212,175,55,0.2)]'>
                Explore Entire Collection <img src={assets.arrow_icon} alt="arrow" className="brightness-200 invert w-4 h-4" />
            </motion.button>

        </section>
    )
}

export default FeaturedSection
