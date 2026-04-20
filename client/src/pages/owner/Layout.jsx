import React, { useEffect } from 'react'
import NavbarOwner from '../../components/owner/NavbarOwner'
import Sidebar from '../../components/owner/Sidebar'
import { Outlet, useNavigate } from 'react-router-dom'
import { useAppContext } from '../../context/AppContext'

const Layout = () => {

  const { token, isAdmin } = useAppContext()
  const navigate = useNavigate()

  useEffect(() => {
    if (!token) {
      navigate('/')
    } else if (!isAdmin) {
      navigate('/profile') // Redirect regular users to profile
    }
  }, [token, isAdmin])

  if (!token) return null;

  return (
    <div className='flex flex-col min-h-screen bg-[#06070a] text-gray-300 font-sans selection:bg-primary/30 selection:text-white'>
      {/* Dynamic Background Glows */}
      <div className='fixed inset-0 pointer-events-none overflow-hidden z-0'>
        <div className='absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-primary/5 blur-[120px] rounded-full'></div>
        <div className='absolute bottom-[10%] -right-[10%] w-[30%] h-[30%] bg-blue-500/5 blur-[100px] rounded-full'></div>
      </div>

      <div className='relative z-10 flex flex-col min-h-screen'>
        {/* Top Navbar */}
        <NavbarOwner />
        
        {/* Horizontal Navigation Tabs */}
        <Sidebar />

        {/* Main Content Area */}
        <div className="flex-1 w-full max-w-7xl mx-auto p-4 md:p-8 xl:p-12 overflow-y-auto custom-scrollbar">
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
             <Outlet />
          </div>
        </div>

        {/* Footer */}
        <div className='py-8 border-t border-white/5 text-center mt-auto bg-black/20'>
            <p className='text-[10px] uppercase tracking-[0.3em] text-gray-600 font-bold'>RentLux Control Systems • Restricted Access</p>
        </div>
      </div>
    </div>
  )
}

export default Layout
