import React, { useState } from 'react'
import { assets, menuLinks } from '../assets/assets'
import {Link, useLocation, useNavigate} from 'react-router-dom'
import { useAppContext } from '../context/AppContext'
import toast from 'react-hot-toast'
import {motion} from 'motion/react'

const Navbar = () => {

    const {setShowLogin, user, logout, isAdmin, axios, setIsAdmin, searchQuery, setSearchQuery} = useAppContext()

    const location = useLocation()
    const [open, setOpen] = useState(false)
    const navigate = useNavigate()

  return (
    <motion.div 
    initial={{y: -20, opacity: 0}}
    animate={{y: 0, opacity: 1}}
    transition={{duration: 0.5}}
    className={`flex items-center justify-between px-6 md:px-16 lg:px-24 xl:px-32 py-4 text-gray-200 border-b border-borderColor sticky top-0 z-50 transition-all glass-header`}>

        <Link to='/'>
            <motion.h1 whileHover={{scale: 1.05}} className="text-2xl font-bold tracking-wider text-primary">RENT<span className="text-white">LUX</span></motion.h1>
        </Link>

        <div className={`max-sm:fixed max-sm:h-screen max-sm:w-full max-sm:top-[73px] max-sm:border-t border-borderColor right-0 flex flex-col sm:flex-row items-center gap-6 md:gap-10 lg:gap-12 max-sm:p-8 transition-all duration-300 z-50 bg-[#0a0a0ae6] backdrop-blur-md sm:bg-transparent ${open ? "max-sm:translate-x-0" : "max-sm:translate-x-full"}`}>
            
            {/* Main Navigation Links */}
            <div className='flex flex-col sm:flex-row items-center gap-6 lg:gap-10'>
                {menuLinks.filter(link => {
                    if (isAdmin) return !(link.name === 'My Bookings' || link.name === 'Feedback' || link.name === 'Request Listing' || link.name === 'Profile');
                    if (!user) return (link.name === 'Home' || link.name === 'Cars');
                    return true;
                }).map((link, index) => (
                    <Link 
                        key={index} 
                        to={link.path} 
                        onClick={() => { setOpen(false); window.scrollTo(0,0); }} 
                        className={`text-sm font-medium tracking-wide transition-all hover:text-primary ${location.pathname === link.path ? 'text-primary' : 'text-gray-400'}`}
                    >
                        {link.name}
                    </Link>
                ))}
            </div>

            {/* Right Side Actions */}
            <div className='flex flex-col sm:flex-row items-center gap-6 lg:gap-8'>
                {!isAdmin && (
                    <button 
                        onClick={() => { navigate('/cars'); setOpen(false); window.scrollTo(0,0); }} 
                        className="hidden xl:flex items-center gap-2.5 text-primary font-bold uppercase text-[10px] tracking-[0.2em] border border-primary/30 px-6 py-2.5 rounded-full hover:bg-primary hover:text-black transition-all"
                    >
                        <img src={assets.calendar_icon_colored} alt="" className="w-3.5 h-3.5 brightness-0 group-hover:brightness-100" />
                        Reserve A Car
                    </button>
                )}

                {isAdmin ? (
                   <button 
                        onClick={() => { navigate('/owner'); setOpen(false); window.scrollTo(0,0); }} 
                        className="text-sm font-bold uppercase tracking-widest text-primary hover:text-white transition-colors"
                    >
                        Admin Dashboard
                    </button>
                ) : null}

                <button 
                    onClick={()=> {user ? logout() : setShowLogin(true); setOpen(false);}} 
                    className="px-8 py-3 bg-primary hover:bg-white transition-all text-[#0a0a0a] font-bold rounded-xl shadow-[0_0_20px_rgba(212,175,55,0.2)] uppercase tracking-widest text-xs"
                >
                    {user ? 'Logout' : 'Login'}
                </button>
            </div>
        </div>

        <button className='sm:hidden cursor-pointer' aria-label="Menu" onClick={()=> setOpen(!open)}>
            <img src={open ? assets.close_icon : assets.menu_icon} alt="menu" className="brightness-200" />
        </button>
      
    </motion.div>
  )
}

export default Navbar
