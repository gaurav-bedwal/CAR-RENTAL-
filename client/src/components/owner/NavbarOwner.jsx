import React from 'react'
import { Link } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';

const NavbarOwner = () => {

  const { user } = useAppContext()

  return (
    <div className='flex items-center justify-between px-6 md:px-10 py-5 bg-white border-b-4 border-black relative transition-all shadow-sm z-20'>
      <Link to='/' className="text-3xl font-black tracking-widest text-black">
        ADMIN<span className="text-primary italic ml-2">PORTAL</span>
      </Link>
      <div className='flex items-center gap-4'>
        <div className='hidden md:flex flex-col text-right'>
           <p className="text-black font-bold text-lg">{user?.name || "Admin"}</p>
           <p className="text-gray-500 font-medium text-sm">System Administrator</p>
        </div>
        <img src={user?.image || "https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=300"} alt="Admin Profile" className="w-12 h-12 rounded-full border-2 border-black" />
      </div>
    </div>
  )
}

export default NavbarOwner
