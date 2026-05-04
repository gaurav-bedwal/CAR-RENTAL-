import React, { useState } from 'react'
import Navbar from './components/Navbar'
import { Route, Routes, useLocation } from 'react-router-dom'
import Home from './pages/Home'
import CarDetails from './pages/CarDetails'
import Cars from './pages/Cars'
import MyBookings from './pages/MyBookings'
import Footer from './components/Footer'
import Layout from './pages/owner/Layout'
import Dashboard from './pages/owner/Dashboard'
import AddCar from './pages/owner/AddCar'
import ManageCars from './pages/owner/ManageCars'
import ManageBookings from './pages/owner/ManageBookings'
import Clients from './pages/owner/Clients'
import Login from './components/Login'
import Chatbot from './components/Chatbot'
import FeedbackPopup from './components/FeedbackPopup'
import ProvideFeedback from './pages/ProvideFeedback'
import Profile from './pages/Profile'
import { Toaster } from 'react-hot-toast'
import { useAppContext } from './context/AppContext'

const App = () => {

  const {showLogin, isDbConnected, dbMessage, isAdmin} = useAppContext()
  const isOwnerPath = useLocation().pathname.startsWith('/owner')

  return (
    <div className='min-h-screen relative'>
     <Toaster />
      {!isDbConnected && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[200] flex items-center gap-2 px-4 py-2 bg-red-500/10 border border-red-500/20 backdrop-blur-md rounded-full shadow-lg transition-all animate-pulse">
            <div className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]"></div>
            <p className="text-xs font-medium text-red-100 uppercase tracking-widest">{dbMessage || "Database Disconnected"}</p>
        </div>
      )}

      {!isOwnerPath && !isAdmin && <Chatbot />}
      <FeedbackPopup />

      {showLogin && <Login/>}

      {!isOwnerPath && <Navbar/>}

    <Routes>
      <Route path='/' element={<Home/>}/>
      <Route path='/car-details/:id' element={<CarDetails/>}/>
      <Route path='/cars' element={<Cars/>}/>
      <Route path='/my-bookings' element={<MyBookings/>}/>
      <Route path='/feedback' element={<ProvideFeedback/>}/>
      <Route path='/profile' element={<Profile/>}/>
      <Route path='/request-listing' element={<div className="bg-[#0a0a0a] min-h-screen pt-20"><div className="max-w-7xl mx-auto"><AddCar /></div></div>}/>
      <Route path='/owner' element={<Layout />}>
        <Route index element={<Dashboard />}/>
        <Route path="add-car" element={<AddCar />}/>
        <Route path="manage-cars" element={<ManageCars />}/>
        <Route path="manage-bookings" element={<ManageBookings />}/>
        <Route path="clients" element={<Clients />}/>
      </Route>
    </Routes>

    {!isOwnerPath && <Footer />}
    
    </div>
  )
}

export default App
