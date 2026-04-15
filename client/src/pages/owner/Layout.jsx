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
    <div className='flex flex-col min-h-screen bg-[#0B0D17] text-gray-300'>
      <NavbarOwner />
      <div className='flex flex-1 overflow-hidden'>
        <Sidebar />
        <div className="flex-1 overflow-y-auto">
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default Layout
