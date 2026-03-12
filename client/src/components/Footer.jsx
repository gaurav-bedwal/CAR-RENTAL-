import React from 'react'
import { assets } from '../assets/assets'
import { motion } from 'motion/react';

const Footer = () => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className='px-6 md:px-16 lg:px-24 xl:px-32 mt-32 pt-16 bg-[#0a0a0a] text-sm text-gray-400 border-t border-[#1a1a1a]'>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className='flex flex-wrap justify-between items-start gap-8 pb-12 border-[#1a1a1a] border-b'>

                <div className="max-w-xs">
                    <motion.h1
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="text-3xl font-bold tracking-wider text-primary mb-4">
                        RENT<span className="text-white">LUX</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        className='leading-relaxed text-gray-500'>
                        Premium car rental service with a wide selection of luxury and everyday vehicles for all your elite driving needs.
                    </motion.p>
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.5 }}
                        className='flex items-center gap-4 mt-8'>
                        <a href="#" className="p-2 bg-[#111111] rounded-full border border-[#222] hover:border-primary transition-colors group">
                            <img src={assets.facebook_logo} className='w-4 h-4 brightness-200 opacity-60 group-hover:opacity-100 transition-opacity' alt="Facebook" />
                        </a>
                        <a href="#" className="p-2 bg-[#111111] rounded-full border border-[#222] hover:border-primary transition-colors group">
                            <img src={assets.instagram_logo} className='w-4 h-4 brightness-200 opacity-60 group-hover:opacity-100 transition-opacity' alt="Instagram" />
                        </a>
                        <a href="#" className="p-2 bg-[#111111] rounded-full border border-[#222] hover:border-primary transition-colors group">
                            <img src={assets.twitter_logo} className='w-4 h-4 brightness-200 opacity-60 group-hover:opacity-100 transition-opacity' alt="Twitter" />
                        </a>
                        <a href="#" className="p-2 bg-[#111111] rounded-full border border-[#222] hover:border-primary transition-colors group">
                            <img src={assets.gmail_logo} className='w-4 h-4 brightness-200 opacity-60 group-hover:opacity-100 transition-opacity' alt="Email" />
                        </a>
                    </motion.div>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className='flex flex-wrap justify-between w-full md:w-1/2 gap-8'>

                    <div>
                        <h2 className='text-base font-semibold text-white tracking-widest uppercase mb-4'>Quick Links</h2>
                        <ul className='flex flex-col gap-3'>
                            <li><a href="#" className="hover:text-primary transition-colors text-gray-500 hover:tracking-wide duration-300">Home</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors text-gray-500 hover:tracking-wide duration-300">Browse Cars</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors text-gray-500 hover:tracking-wide duration-300">List Your Car</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors text-gray-500 hover:tracking-wide duration-300">About Us</a></li>
                        </ul>
                    </div>

                    <div>
                        <h2 className='text-base font-semibold text-white tracking-widest uppercase mb-4'>Resources</h2>
                        <ul className='flex flex-col gap-3'>
                            <li><a href="#" className="hover:text-primary transition-colors text-gray-500 hover:tracking-wide duration-300">Help Center</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors text-gray-500 hover:tracking-wide duration-300">Terms of Service</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors text-gray-500 hover:tracking-wide duration-300">Privacy Policy</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors text-gray-500 hover:tracking-wide duration-300">Insurance</a></li>
                        </ul>
                    </div>

                    <div>
                        <h2 className='text-base font-semibold text-white tracking-widest uppercase mb-4'>Contact</h2>
                        <ul className='flex flex-col gap-3 text-gray-500'>
                            <li>1234 Luxury Drive</li>
                            <li>San Francisco, CA 94107</li>
                            <li>+1 234 567890</li>
                            <li>info@example.com</li>
                        </ul>
                    </div>

                </motion.div>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className='flex flex-col md:flex-row gap-4 items-center justify-between py-6 text-gray-600'>

                <p>© {new Date().getFullYear()} RentLux Branding. All rights reserved.</p>
                <ul className='flex items-center gap-6 text-xs uppercase tracking-wider'>
                    <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
                    <li><a href="#" className="hover:text-white transition-colors">Terms</a></li>
                    <li><a href="#" className="hover:text-white transition-colors">Cookies</a></li>
                </ul>
            </motion.div>
        </motion.div>
    )
}

export default Footer
