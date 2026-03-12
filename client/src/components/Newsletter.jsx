import React from 'react'
import { motion } from 'motion/react';

const Newsletter = () => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            viewport={{ once: true, amount: 0.3 }}

            className="flex flex-col items-center justify-center text-center space-y-4 px-6 md:px-16 lg:px-24 xl:px-32 bg-[#0a0a0a] py-24 border-t border-white/5 relative overflow-hidden">

            {/* Glow behind newsletter */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 blur-[100px] rounded-full point-events-none"></div>

            <motion.h1
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}

                className="md:text-5xl text-3xl font-bold text-white tracking-wide relative z-10">Never Miss a <span className="text-primary italic">Deal</span></motion.h1>

            <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}

                className="md:text-lg text-gray-400 pb-8 relative z-10">
                Subscribe to get the latest luxury offers, new fleet arrivals, and exclusive client discounts.
            </motion.p>
            <motion.form
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}

                className="flex items-center justify-between max-w-2xl w-full md:h-14 h-12 relative z-10">
                <input
                    className="border border-[#333] bg-[#111] text-white rounded-xl h-full outline-none w-full rounded-r-none px-6 placeholder-gray-500 focus:border-primary/50 transition-colors"
                    type="email"
                    placeholder="Enter your email address"
                    required
                />
                <button type="submit" className="md:px-10 px-6 h-full text-[#0a0a0a] font-bold tracking-wider uppercase text-sm bg-primary hover:bg-primary-dull transition-all cursor-pointer rounded-xl rounded-l-none">
                    Subscribe
                </button>
            </motion.form>
        </motion.div>
    )
}

export default Newsletter
