import React, { useEffect, useState } from 'react'
import { assets } from '../../assets/assets'
import Title from '../../components/owner/Title'
import { useAppContext } from '../../context/AppContext'
import toast from 'react-hot-toast'

const ManageCars = () => {

  const { isAdmin, axios, currency } = useAppContext()

  const [cars, setCars] = useState([])
  const [editingCar, setEditingCar] = useState(null)
  const [deletingCarId, setDeletingCarId] = useState(null)

  const fetchOwnerCars = async () => {
    try {
      const { data } = await axios.get('/api/owner/cars')
      if (data.success) {
        setCars(data.cars)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  const toggleAvailability = async (carId) => {
    try {
      const { data } = await axios.post('/api/owner/toggle-car', { carId })
      if (data.success) {
        toast.success(data.message)
        fetchOwnerCars()
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  const deleteCar = async () => {
    if (!deletingCarId) return;
    try {
      const { data } = await axios.post('/api/owner/delete-car', { carId: deletingCarId })
      if (data.success) {
        toast.success(data.message)
        fetchOwnerCars()
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    } finally {
      setDeletingCarId(null)
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

  useEffect(() => {
    isAdmin && fetchOwnerCars()
  }, [isAdmin])

  return (
    <div className='w-full min-h-screen pb-20'>

      <Title title="Manage Fleet" subTitle="View every car in the platform. You can change their details, hide them from users, or permanently remove them." />

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mt-10'>
        {cars.map((car, index) => (
          <div key={index} className='bg-white border-4 border-black p-5 rounded-3xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[-4px] transition-all flex flex-col'>
            
            {/* Polaroid Image */}
            <div className='aspect-square rounded-2xl overflow-hidden border-2 border-black mb-6'>
                <img src={car?.image} alt="" className="w-full h-full object-cover" />
            </div>

            <div className='flex-1'>
               <div className='flex justify-between items-start mb-4'>
                  <div>
                     <h3 className='text-2xl font-black uppercase text-black leading-tight'>{car?.brand} {car?.model}</h3>
                     <p className='text-gray-500 font-bold uppercase tracking-widest text-xs'>{car?.category} • {car?.transmission}</p>
                  </div>
                  <div className='text-right'>
                     <p className='text-2xl font-black text-primary'>{currency}{car.pricePerDay}</p>
                     <p className='text-[10px] font-black uppercase text-gray-400'>per day</p>
                  </div>
               </div>

               <div className='flex gap-2 mb-6'>
                  <span className={`px-3 py-1 rounded-lg border-2 border-black text-[10px] font-black uppercase tracking-widest ${car.status === 'approved' ? 'bg-green-400' : 'bg-yellow-400'}`}>
                    {car.status}
                  </span>
                  <span className={`px-3 py-1 rounded-lg border-2 border-black text-[10px] font-black uppercase tracking-widest ${car.isAvaliable ? 'bg-blue-400' : 'bg-gray-400 opacity-50'}`}>
                    {car.isAvaliable ? "Live" : "Hidden" }
                  </span>
               </div>
            </div>

            {/* Huge Action Buttons */}
            <div className='grid grid-cols-1 gap-3 mt-auto border-t-2 border-dashed border-gray-100 pt-6'>
               <div className='grid grid-cols-2 gap-3'>
                  <button onClick={() => setEditingCar(car)} className='py-3 bg-gray-100 border-2 border-black rounded-xl font-black uppercase text-xs tracking-widest hover:bg-white transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[1px] hover:translate-y-[1px]'>
                    Edit Details
                  </button>
                  <button onClick={() => toggleAvailability(car._id)} className={`py-3 border-2 border-black rounded-xl font-black uppercase text-xs tracking-widest transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[1px] hover:translate-y-[1px] ${car.isAvaliable ? 'bg-orange-100 text-orange-600' : 'bg-green-100 text-green-600'}`}>
                    {car.isAvaliable ? "Hide Car" : "Show Car"}
                  </button>
               </div>
               <button 
                  onClick={() => setDeletingCarId(car._id)} 
                  className='py-5 bg-red-600 text-white border-2 border-black rounded-xl font-black uppercase text-lg tracking-tighter shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all flex items-center justify-center gap-3'
               >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                  </svg>
                  REMOVE THIS CAR
               </button>
            </div>

          </div>
        ))}

        {cars.length === 0 && (
           <div className='col-span-full py-20 text-center border-4 border-dashed border-gray-300 rounded-3xl'>
             <p className='text-2xl font-bold text-gray-400 uppercase tracking-widest'>Fleet is empty.</p>
           </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deletingCarId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white border-4 border-black rounded-3xl shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] w-full max-w-sm overflow-hidden relative p-10 text-center">
            <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-red-100 border-4 border-black mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-10 h-10 text-red-600">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 className="text-3xl font-black text-black uppercase mb-4 tracking-tighter">Are you sure?</h3>
            <p className="text-gray-600 font-bold mb-8">This car will be deleted and all its history will be lost forever!</p>
            <div className="flex gap-4">
              <button onClick={() => setDeletingCarId(null)} className="flex-1 py-4 rounded-xl border-4 border-black font-black uppercase tracking-widest bg-gray-100 hover:bg-white text-black transition-all">No, Keep it</button>
              <button onClick={deleteCar} className="flex-1 py-4 rounded-xl border-4 border-black font-black uppercase tracking-widest bg-red-600 text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px] transition-all">Yes, Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editingCar && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white border-4 border-black rounded-3xl shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] w-full max-w-md overflow-hidden relative">
            <div className="p-8 border-b-4 border-black flex justify-between items-center bg-gray-50">
              <h2 className="text-2xl font-black text-black uppercase tracking-tighter">Edit Vehicle</h2>
              <button onClick={() => setEditingCar(null)} className="text-black hover:scale-110 transition-transform">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-8 h-8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="p-8 space-y-6">
              <div>
                <label className="block text-sm font-black uppercase text-gray-500 mb-2 tracking-widest">Price Per Day ({currency})</label>
                <input 
                  type="number" 
                  name="pricePerDay" 
                  value={editingCar.pricePerDay} 
                  onChange={handleEditChange}
                  className="w-full bg-gray-50 border-4 border-black rounded-2xl px-5 py-4 text-xl font-bold text-black focus:outline-none focus:ring-4 focus:ring-primary/20 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-black uppercase text-gray-500 mb-2 tracking-widest">Category</label>
                <select 
                  name="category" 
                  value={editingCar.category} 
                  onChange={handleEditChange}
                  className="w-full bg-gray-50 border-4 border-black rounded-2xl px-5 py-4 text-xl font-bold text-black focus:outline-none focus:ring-4 focus:ring-primary/20 transition-all appearance-none"
                >
                  <option value="Sedan">Sedan</option>
                  <option value="SUV">SUV</option>
                  <option value="Van">Van</option>
                </select>
              </div>

               <div>
                <label className="block text-sm font-black uppercase text-gray-500 mb-2 tracking-widest">Status</label>
                <select 
                  name="status" 
                  value={editingCar.status || 'pending'} 
                  onChange={handleEditChange}
                  className="w-full bg-gray-50 border-4 border-black rounded-2xl px-5 py-4 text-xl font-bold text-black focus:outline-none focus:ring-4 focus:ring-primary/20 transition-all appearance-none"
                >
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                </select>
              </div>

               <div className="grid grid-cols-2 gap-4">
                 <div>
                    <label className="block text-sm font-black uppercase text-gray-500 mb-2 tracking-widest">Seating</label>
                    <input 
                      type="number" 
                      name="seating_capacity" 
                      value={editingCar.seating_capacity} 
                      onChange={handleEditChange}
                      className="w-full bg-gray-50 border-4 border-black rounded-2xl px-5 py-4 text-xl font-bold text-black focus:outline-none focus:ring-4 focus:ring-primary/20 transition-all"
                    />
                 </div>
                 <div>
                    <label className="block text-sm font-black uppercase text-gray-500 mb-2 tracking-widest">Gear</label>
                    <select 
                      name="transmission" 
                      value={editingCar.transmission} 
                      onChange={handleEditChange}
                      className="w-full bg-gray-50 border-4 border-black rounded-2xl px-5 py-4 text-xl font-bold text-black focus:outline-none focus:ring-4 focus:ring-primary/20 transition-all appearance-none"
                    >
                      <option value="Automatic">Automatic</option>
                      <option value="Manual">Manual</option>
                    </select>
                 </div>
               </div>
            </div>

            <div className="p-8 border-t-4 border-black bg-gray-50 flex gap-4">
               <button onClick={() => setEditingCar(null)} className="flex-1 py-4 rounded-xl border-4 border-black font-black uppercase tracking-widest text-black hover:bg-white transition-all">Cancel</button>
               <button onClick={saveEdit} className="flex-1 py-4 rounded-xl border-4 border-black font-black uppercase tracking-widest bg-primary text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px] transition-all">Save Fleet</button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}

export default ManageCars
