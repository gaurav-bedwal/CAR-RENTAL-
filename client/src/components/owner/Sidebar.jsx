import React from 'react'
import { ownerMenuLinks } from '../../assets/assets'
import { NavLink, useLocation } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';

const Sidebar = () => {

  const { isAdmin } = useAppContext()
  const location = useLocation()

  // Filter links: if not admin, only show 'Request Car'
  const visibleLinks = isAdmin ? ownerMenuLinks : ownerMenuLinks.filter((link) => link.path === '/owner/add-car')

  return (
    <div className='w-full bg-white border-b-4 border-black px-4 md:px-10 overflow-x-auto shadow-sm'>
      <div className='flex items-center gap-2 md:gap-4 py-3 min-w-max'>
        {visibleLinks.map((link, index) => {
          const isActive = link.path === location.pathname;
          return (
            <NavLink 
              key={index} 
              to={link.path} 
              className={`flex items-center gap-3 px-6 py-4 transition-all duration-200 border-2 rounded-xl text-lg font-bold uppercase tracking-widest ${isActive ? 'bg-primary text-black border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]' : 'bg-gray-100 text-gray-500 border-gray-200 hover:border-black hover:text-black hover:bg-white'}`}
            >
              <img src={isActive ? link.icon : link.coloredIcon} alt="icon" className={`w-7 h-7 filter ${isActive ? 'brightness-0' : 'grayscale opacity-50'}`} />
              <span>{isAdmin ? link.name : link.path === '/owner/add-car' ? 'Request Listing' : link.name}</span>
            </NavLink>
          )
        })}

      </div>
    </div>
  )
}

export default Sidebar
