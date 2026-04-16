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

        <div className={`max-sm:fixed max-sm:h-screen max-sm:w-full max-sm:top-[73px] max-sm:border-t border-borderColor right-0 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-8 max-sm:p-4 transition-all duration-300 z-50 bg-[#0a0a0ae6] backdrop-blur-md sm:bg-transparent ${open ? "max-sm:translate-x-0" : "max-sm:translate-x-full"}`}>
            {menuLinks.filter(link => !(isAdmin && link.name === 'My Bookings')).map((link, index)=> (
                <Link key={index} to={link.path} onClick={() => setOpen(false)} className="hover:text-primary transition-colors text-lg tracking-wide">
                    {link.name}
                </Link>
            ))}

            <div className='hidden lg:flex items-center text-sm gap-2 border border-borderColor px-4 py-2 rounded-full max-w-56 bg-black/20 focus-within:border-primary transition-colors'>
                <input 
                    type="text" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            navigate('/cars');
                            setOpen(false);
                        }
                    }}
                    className="w-full bg-transparent outline-none placeholder-gray-400 text-white" 
                    placeholder="Search cars"
                />
                <img src={assets.search_icon} alt="search" className="brightness-200 opacity-60" />
            </div>

            <div className='flex max-sm:flex-col items-start sm:items-center gap-6'>
                {!isAdmin && (
                    <button onClick={() => { navigate('/cars'); setOpen(false); }} className="hidden lg:flex items-center gap-2 text-primary font-black uppercase text-[10px] tracking-[0.2em] border border-primary/30 px-6 py-2.5 rounded-full hover:bg-primary hover:text-black transition-all cursor-pointer">
                        <img src={assets.calendar_icon_colored} alt="" className="w-3.5 h-3.5 brightness-0 group-hover:brightness-100" />
                        Reserve A Car
                    </button>
                )}

                {isAdmin ? (
                   <button onClick={() => { navigate('/owner'); setOpen(false); }} className="cursor-pointer hover:text-primary transition-colors tracking-wide">Admin Dashboard</button>
                ) : (
                    user && <button onClick={() => { navigate('/owner/add-car'); setOpen(false); }} className="cursor-pointer hover:text-primary transition-colors tracking-wide text-xs uppercase opacity-80 border-b border-primary/50 pb-1">Request Listing</button>
                )}

                <button onClick={()=> {user ? logout() : setShowLogin(true); setOpen(false);}} className="cursor-pointer px-8 py-2.5 bg-primary hover:bg-primary-dull transition-all text-[#0a0a0a] font-semibold rounded-lg shadow-[0_0_15px_rgba(212,175,55,0.4)] hover:shadow-[0_0_20px_rgba(212,175,55,0.6)] uppercase tracking-wider text-sm">{user ? 'Logout' : 'Login'}</button>
            </div>
        </div>

        <button className='sm:hidden cursor-pointer' aria-label="Menu" onClick={()=> setOpen(!open)}>
            <img src={open ? assets.close_icon : assets.menu_icon} alt="menu" className="brightness-200" />
        </button>
      
    </motion.div>
  )
}

export default Navbar
