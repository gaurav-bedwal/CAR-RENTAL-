import React from 'react'
import { Link } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';

const NavbarOwner = () => {

  const { user } = useAppContext()

  return (
    <div className='flex items-center justify-between px-6 md:px-10 py-5 bg-white border-b-4 border-black relative transition-all shadow-sm z-20'>
      <div className='flex items-center gap-6'>
        <Link to='/' className="text-3xl font-black tracking-widest text-black">
          ADMIN<span className="text-primary italic ml-2">PORTAL</span>
        </Link>
        <Link to='/' className="hidden sm:flex items-center gap-2 px-4 py-2 bg-gray-100 border-2 border-black rounded-xl text-xs font-black uppercase tracking-widest hover:bg-white transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[1px] hover:translate-y-[1px]">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
          </svg>
          Home
        </Link>
      </div>
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
