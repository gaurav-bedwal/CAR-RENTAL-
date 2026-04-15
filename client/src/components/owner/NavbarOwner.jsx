import React from 'react'
import { Link } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';

const NavbarOwner = () => {

  const { user } = useAppContext()

  return (
    <div className='flex items-center justify-between px-6 md:px-12 py-6 bg-[#0B0D17]/80 backdrop-blur-md border-b border-white/10 sticky top-0 z-30 shadow-2xl'>
      
      {/* Brand Section: Matching Homepage Image 2 */}
      <div className='flex items-center gap-10'>
        <Link to='/' className="text-2xl font-black tracking-tighter text-white uppercase flex items-center">
          <span className="text-primary pr-0.5">RENT</span>LUX
          <span className='ml-3 px-2 py-0.5 bg-primary/10 border border-primary/20 rounded-md text-[10px] text-primary tracking-widest font-black uppercase'>ADMIN</span>
        </Link>
        
        {/* Navigation Links Bridge */}
        <div className='hidden lg:flex items-center gap-8'>
          <Link to='/' className='text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-white transition-all'>Home</Link>
          <Link to='/all-cars' className='text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-white transition-all'>Fleet View</Link>
        </div>
      </div>

      {/* User Actions Section */}
      <div className='flex items-center gap-6'>
        <div className='hidden sm:flex flex-col text-right'>
           <p className="text-white font-bold text-sm tracking-tight">{user?.name || "Administrator"}</p>
           <p className="text-primary font-black text-[9px] uppercase tracking-[0.2em] opacity-80">Full Access Control</p>
        </div>
        
        <div className='relative group'>
          <img 
            src={user?.image || "https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=300"} 
            alt="Admin Profile" 
            className="w-11 h-11 rounded-xl border border-white/10 p-0.5 group-hover:border-primary/50 transition-all cursor-pointer shadow-lg" 
          />
          <div className='absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-[#0B0D17] rounded-full'></div>
        </div>
      </div>

    </div>
  )
}

export default NavbarOwner
