import React, { useState } from 'react'
import { assets, ownerMenuLinks } from '../../assets/assets'
import { NavLink, useLocation } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';

const Sidebar = () => {

  const { user, isAdmin, axios, fetchUser } = useAppContext()
  const location = useLocation()
  const [image, setImage] = useState('')

  const updateImage = async () => {
    try {
      const formData = new FormData()
      formData.append('image', image)

      const { data } = await axios.post('/api/owner/update-image', formData)

      if (data.success) {
        fetchUser()
        toast.success(data.message)
        setImage('')
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  // Filter links: if not admin, only show 'Add Car' (now "Request Car")
  const visibleLinks = isAdmin ? ownerMenuLinks : ownerMenuLinks.filter((link) => link.path === '/owner/add-car')

  return (
    <div className='relative min-h-screen md:flex flex-col items-center pt-8 max-w-16 md:max-w-[260px] w-full border-r border-white/5 bg-[#0B0D17] text-sm z-10'>

      <div className='group relative'>
        <label htmlFor="image">
          <img src={image ? URL.createObjectURL(image) : user?.image || "https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=300"} alt="" className='h-9 md:h-14 w-9 md:w-14 rounded-full mx-auto border-2 border-primary/20 p-0.5' />
          <input type="file" id='image' accept="image/*" hidden onChange={e => setImage(e.target.files[0])} />

          <div className='absolute hidden top-0 right-0 left-0 bottom-0 bg-black/40 rounded-full group-hover:flex items-center justify-center cursor-pointer'>
            <img src={assets.edit_icon} alt="" />
          </div>
        </label>
      </div>
      {image && (
        <button className='absolute top-0 right-0 flex p-2 gap-1 bg-primary/20 text-primary cursor-pointer rounded-bl-lg' onClick={updateImage}>Save <img src={assets.check_icon} width={13} alt="" /></button>
      )}
      <p className='mt-2 text-base font-medium text-white max-md:hidden'>{user?.name}</p>

      <div className='w-full mt-8 flex flex-col flex-grow'>
        {visibleLinks.map((link, index) => (
          <NavLink key={index} to={link.path} className={`relative flex items-center gap-3 w-full py-4 pl-6 transition-all duration-300 ${link.path === location.pathname ? 'bg-primary/10 text-primary font-semibold' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}>
            <img src={link.path === location.pathname ? link.coloredIcon : link.icon} alt="icon" className={`w-5 h-5 ${link.path === location.pathname ? 'opacity-100' : 'opacity-60'}`} />
            <span className='max-md:hidden tracking-wider'>{isAdmin ? link.name : link.path === '/owner/add-car' ? 'Request Listing' : link.name}</span>
            <div className={`${link.path === location.pathname && 'bg-primary shadow-[0_0_15px_rgba(212,175,55,0.8)]'} w-1 h-full rounded-full -left-0.5 absolute`}></div>
          </NavLink>
        ))}

        {/* Home Navigation */}
        <div className='mt-auto w-full border-t border-white/5'>
          <NavLink to="/" className="relative flex items-center gap-3 w-full py-4 pl-6 transition-all duration-300 text-gray-400 hover:bg-white/5 hover:text-white">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 opacity-60">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
            </svg>
            <span className='max-md:hidden tracking-wider'>Back to Home</span>
          </NavLink>
        </div>
      </div>

    </div>
  )
}

export default Sidebar
