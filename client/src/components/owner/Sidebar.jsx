import React from 'react'
import { ownerMenuLinks } from '../../assets/assets'
import { NavLink, useLocation, Link } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';

const Sidebar = () => {

  const { isAdmin } = useAppContext()
  const location = useLocation()

  // Filter links: if not admin, only show 'Add Car'
  const visibleLinks = isAdmin ? ownerMenuLinks : ownerMenuLinks.filter((link) => link.path === '/owner/add-car')

  return (
    <div className='w-full bg-[#0B0D17]/60 backdrop-blur-lg border-b border-white/10 px-6 md:px-12 py-4 sticky top-[89px] z-20 shadow-2xl'>
      <div className='max-w-7xl mx-auto flex items-center justify-between'>
        
        {/* Navigation Tabs */}
        <div className='flex items-center gap-2 md:gap-6 overflow-x-auto no-scrollbar'>
          {visibleLinks.map((link, index) => {
             const isActive = link.path === location.pathname;
             return (
               <NavLink 
                 key={index} 
                 to={link.path} 
                 className={`flex items-center gap-3 px-5 py-3 rounded-2xl transition-all duration-300 min-w-max border border-transparent ${
                   isActive 
                    ? 'bg-primary/10 text-primary border-primary/20 shadow-[0_0_20px_rgba(212,175,55,0.1)]' 
                    : 'text-gray-500 hover:text-white hover:bg-white/5'
                 }`}
               >
                 <img 
                   src={isActive ? link.coloredIcon : link.icon} 
                   alt="icon" 
                   className={`w-5 h-5 transition-all ${isActive ? 'opacity-100 scale-110' : 'opacity-40 grayscale group-hover:grayscale-0'}`} 
                 />
                 <span className='text-xs font-bold uppercase tracking-widest'>{isAdmin ? link.name : link.path === '/owner/add-car' ? 'Add Car' : link.name}</span>
               </NavLink>
             )
          })}
        </div>

        {/* Quick Back to Site Link */}
        <Link to="/" className='hidden md:flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-white hover:border-white/20 transition-all'>
           <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
             <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
           </svg>
           Exit Portal
        </Link>
      </div>
    </div>
  )
}

export default Sidebar
