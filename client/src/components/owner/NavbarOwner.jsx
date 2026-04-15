import React from 'react'
import { assets } from '../../assets/assets'
import { Link } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';

const NavbarOwner = () => {

  const { user } = useAppContext()

  return (
    <div className='flex items-center justify-between px-6 md:px-10 py-4 bg-[#141824] text-gray-300 border-b border-white/5 relative transition-all shadow-xl z-20'>
      <Link to='/' className="text-2xl font-bold tracking-wider text-white">
        <span className="text-primary italic pr-1">Rent</span>Lux
        <span className="text-xs text-primary font-normal tracking-widest uppercase ml-2 px-2 py-0.5 border border-primary/30 rounded-full bg-primary/10">Admin</span>
      </Link>
      <div className='flex items-center gap-4 border-l border-white/5 pl-4 ml-4'>
        <Link to='/' className="text-xs font-bold uppercase tracking-widest text-primary hover:text-white transition-colors flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
          </svg>
          Back to Home
        </Link>
        <p className="text-sm tracking-wide text-gray-400">Welcome, <span className="text-white font-medium">{user?.name || "Owner"}</span></p>
      </div>
    </div>
  )
}

export default NavbarOwner
