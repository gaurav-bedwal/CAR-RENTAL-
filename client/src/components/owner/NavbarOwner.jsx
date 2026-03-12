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
      <p className="text-sm tracking-wide text-gray-400">Welcome, <span className="text-white font-medium">{user?.name || "Owner"}</span></p>
    </div>
  )
}

export default NavbarOwner
