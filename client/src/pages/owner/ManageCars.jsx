import React, { useEffect, useState } from 'react'
import { assets} from '../../assets/assets'
import Title from '../../components/owner/Title'
import { useAppContext } from '../../context/AppContext'
import toast from 'react-hot-toast'

const ManageCars = () => {

  const {isAdmin, axios, currency} = useAppContext()

  const [cars, setCars] = useState([])
  const [editingCar, setEditingCar] = useState(null)

  const fetchOwnerCars = async ()=>{
    try {
      const {data} = await axios.get('/api/owner/cars')
      if(data.success){
        setCars(data.cars)
      }else{
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  const toggleAvailability = async (carId)=>{
    try {
      const {data} = await axios.post('/api/owner/toggle-car', {carId})
      if(data.success){
        toast.success(data.message)
        fetchOwnerCars()
      }else{
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  const deleteCar = async (carId)=>{
    try {

      const confirm = window.confirm('Are you sure you want to delete this car?')

      if(!confirm) return null

      const {data} = await axios.post('/api/owner/delete-car', {carId})
      if(data.success){
        toast.success(data.message)
        fetchOwnerCars()
      }else{
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  const handleEditChange = (e) => {
    setEditingCar({ ...editingCar, [e.target.name]: e.target.value })
  }

  const saveEdit = async () => {
    try {
      const { data } = await axios.post('/api/owner/update-car', { ...editingCar, carId: editingCar._id })
      if (data.success) {
        toast.success(data.message)
        setEditingCar(null)
        fetchOwnerCars()
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(()=>{
    isAdmin && fetchOwnerCars()
  },[isAdmin])

  return (
    <div className='px-4 pt-10 md:px-10 w-full relative min-h-screen bg-[#0B0D17]'>
      
      <Title title="Manage Cars" subTitle="View all listed cars, update their details, or remove them from the booking platform."/>

      <div className='max-w-4xl w-full rounded-3xl overflow-x-auto bg-[#141824] border border-white/5 shadow-2xl mt-8 mb-20'>

        <table className='w-full border-collapse text-left text-sm text-gray-400 min-w-[700px]'>
          <thead className='text-gray-500 uppercase tracking-widest text-xs bg-[#1a1a1a]'>
            <tr>
              <th className="p-4 font-medium pl-6">Car</th>
              <th className="p-4 font-medium max-md:hidden">Category</th>
              <th className="p-4 font-medium">Price</th>
              <th className="p-4 font-medium max-md:hidden">Status</th>
              <th className="p-4 font-medium text-right pr-6">Actions</th>
            </tr>
          </thead>
          <tbody>
            {cars.map((car, index)=>(
              <tr key={index} className='border-t border-white/5 hover:bg-white/[0.02] transition-colors'>

                <td className='p-4 pl-6 flex items-center gap-4'>
                  <img src={car?.image} alt="" className="h-14 w-14 aspect-square rounded-xl object-cover border border-white/10 shadow-md"/>
                  <div className='max-md:hidden'>
                    <p className='font-bold text-white tracking-wide'>{car?.brand} {car?.model}</p>
                    <p className='text-xs text-gray-500 mt-1 uppercase tracking-wider'>{car?.seating_capacity} Seater • {car?.transmission}</p>
                  </div>
                </td>

                <td className='p-4 max-md:hidden capitalize font-light'>{car.category}</td>
                <td className='p-4'>
                  <span className='text-lg text-primary font-bold tracking-tight'>{currency}{car.pricePerDay}</span>
                  <span className='text-xs text-gray-500'>/day</span>
                </td>

                <td className='p-4 max-md:hidden'>
                  <div className='flex flex-col gap-1 items-start'>
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${car.status === 'approved' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-orange-500/10 text-orange-400 border border-orange-500/20'}`}>
                      {car.status === 'approved' ? "Approved" : "Pending" }
                    </span>
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${car.isAvaliable ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                      {car.isAvaliable ? "Available" : "Hidden" }
                    </span>
                  </div>
                </td>

                <td className='p-4 align-middle text-right pr-6'>
                  <div className='flex items-center justify-end gap-3'>
                    <button onClick={()=> setEditingCar(car)} className='p-2 rounded-lg bg-white/5 hover:bg-primary/20 hover:text-primary transition-colors text-gray-400' title="Edit Pricing & Options">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
                      </svg>
                    </button>
                    <button onClick={()=> toggleAvailability(car._id)} className='p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors opacity-80 hover:opacity-100' title={car.isAvaliable ? "Hide Car" : "Show Car"}>
                      <img src={car.isAvaliable ? assets.eye_close_icon : assets.eye_icon} alt="" className='w-5 h-5 filter invert'/>
                    </button>
                    <button onClick={()=> deleteCar(car._id)} className='p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors' title="Delete Car">
                       <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                      </svg>
                    </button>
                  </div>
                </td>

              </tr>
            ))}
          </tbody>
        </table>

        {cars.length === 0 && <div className='p-8 text-center text-gray-500 italic'>No cars listed yet.</div>}
      </div>

      {/* Edit Modal */}
      {editingCar && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#111] border border-white/10 rounded-3xl shadow-2xl w-full max-w-md overflow-hidden relative">
            <div className="p-6 border-b border-white/5 flex justify-between items-center">
              <h2 className="text-xl font-bold text-white tracking-wide">Edit Car Options</h2>
              <button onClick={() => setEditingCar(null)} className="text-gray-400 hover:text-white transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="p-6 space-y-5">
              <div>
                <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">Price Per Day ({currency})</label>
                <input 
                  type="number" 
                  name="pricePerDay" 
                  value={editingCar.pricePerDay} 
                  onChange={handleEditChange}
                  className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary/50 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">Category</label>
                <select 
                  name="category" 
                  value={editingCar.category} 
                  onChange={handleEditChange}
                  className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary/50 transition-colors"
                >
                  <option value="Sedan">Sedan</option>
                  <option value="SUV">SUV</option>
                  <option value="Van">Van</option>
                </select>
              </div>

               <div>
                <label className="block text-xs uppercase tracking-widest text-primary mb-2">Listing Status (Approval)</label>
                <select 
                  name="status" 
                  value={editingCar.status || 'pending'} 
                  onChange={handleEditChange}
                  className="w-full bg-primary/10 border border-primary/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary/50 transition-colors"
                >
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                </select>
              </div>

               <div className="grid grid-cols-2 gap-4">
                 <div>
                    <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">Seating</label>
                    <input 
                      type="number" 
                      name="seating_capacity" 
                      value={editingCar.seating_capacity} 
                      onChange={handleEditChange}
                      className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary/50 transition-colors"
                    />
                 </div>
                 <div>
                    <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">Transmission</label>
                    <select 
                      name="transmission" 
                      value={editingCar.transmission} 
                      onChange={handleEditChange}
                      className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary/50 transition-colors"
                    >
                      <option value="Automatic">Automatic</option>
                      <option value="Manual">Manual</option>
                    </select>
                 </div>
               </div>
            </div>

            <div className="p-6 border-t border-white/5 bg-[#0a0a0a]/50 flex justify-end gap-3">
               <button onClick={() => setEditingCar(null)} className="px-5 py-2.5 rounded-xl border border-white/10 text-gray-300 hover:bg-white/5 transition-colors font-medium">
                 Cancel
               </button>
               <button onClick={saveEdit} className="px-5 py-2.5 rounded-xl bg-primary text-black font-bold hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20">
                 Save Changes
               </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}

export default ManageCars
