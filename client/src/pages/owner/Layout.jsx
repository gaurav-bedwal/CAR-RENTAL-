import React, { useEffect } from 'react'
import NavbarOwner from '../../components/owner/NavbarOwner'
import Sidebar from '../../components/owner/Sidebar'
import { Outlet, useNavigate } from 'react-router-dom'
import { useAppContext } from '../../context/AppContext'

const Layout = () => {

  const { token } = useAppContext()
  const navigate = useNavigate()

  useEffect(() => {
    if (!token) {
      navigate('/')
    }
  }, [token])

  return token && (
    <div className='flex flex-col min-h-screen bg-gray-100 text-black font-sans'>
      {/* Top Navbar */}
      <NavbarOwner />
      
      {/* Horizontal Tabs / Navigation */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 w-full max-w-7xl mx-auto p-4 md:p-8">
        <Outlet />
      </div>
    </div>
  )
}

export default Layout
