import React, { useState } from 'react'
import Title from '../../components/owner/Title'
import { assets } from '../../assets/assets'
import { useAppContext } from '../../context/AppContext'
import toast from 'react-hot-toast'

const AddCar = () => {

  const {axios, currency, isAdmin} = useAppContext()

  const [image, setImage] = useState(null)
  const [car, setCar] = useState({
    brand: '',
    model: '',
    year: 0,
    pricePerDay: 0,
    category: '',
    transmission: '',
    fuel_type: '',
    seating_capacity: 0,
    location: '',
    description: '',
    features: [],
    rtoDate: ''
  })

  const calculateAge = (dateString) => {
    if (!dateString) return 0;
    const issueDate = new Date(dateString);
    const today = new Date();
    let age = today.getFullYear() - issueDate.getFullYear();
    const m = today.getMonth() - issueDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < issueDate.getDate())) {
      age--;
    }
    return age >= 0 ? age : 0;
  }

  const [isLoading, setIsLoading] = useState(false)
  const onSubmitHandler = async (e)=>{
    e.preventDefault()
    if(isLoading) return null

    if(!image){
      return toast.error("Please upload an image for the car")
    }

    setIsLoading(true)
    try {
      const formData = new FormData()
      formData.append('image', image)
      const carDataToSubmit = {
        ...car,
        year: calculateAge(car.rtoDate) // Save calculated age to backend year schema metric
      }

      formData.append('carData', JSON.stringify(carDataToSubmit))

      const {data} = await axios.post('/api/owner/add-car', formData)

      if(data.success){
        toast.success(data.message)
        setImage(null)
        setCar({
          brand: '',
          model: '',
          year: 0,
          pricePerDay: 0,
          category: '',
          transmission: '',
          fuel_type: '',
          seating_capacity: 0,
          location: '',
          description: '',
          features: [],
          rtoDate: ''
        })
      }else{
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }finally{
      setIsLoading(false)
    }
  }

  return (
    <div className='px-4 py-10 md:px-10 flex-1'>

      <Title title={isAdmin ? "Add New Car to Fleet" : "Request Car Listing"} subTitle={isAdmin ? "Add a new vehicle directly to the platform's active fleet." : "Submit your car details to an administrator for review and approval."}/>

      <form onSubmit={onSubmitHandler} className='flex flex-col gap-8 text-gray-400 text-sm mt-10 max-w-2xl'>

        {/* Car Image Profile */}
        <div className='flex items-center gap-6 p-6 rounded-3xl bg-[#141824]/40 border border-white/5 backdrop-blur-sm'>
          <label htmlFor="car-image" className='relative group cursor-pointer'>
            <div className='w-24 h-24 rounded-2xl overflow-hidden border-2 border-dashed border-white/20 group-hover:border-primary/50 transition-all flex items-center justify-center bg-[#0B0D17]'>
              {image ? (
                <img src={URL.createObjectURL(image)} alt="" className='w-full h-full object-cover' />
              ) : (
                <img src={assets.upload_icon} alt="" className='w-8 h-8 opacity-40 group-hover:opacity-100 transition-opacity' />
              )}
            </div>
            <input type="file" id="car-image" accept="image/*" hidden onChange={e=> setImage(e.target.files[0])}/>
          </label>
          <div>
             <p className='text-white font-bold text-lg tracking-tight'>Vehicle Visual</p>
             <p className='text-xs text-gray-500 mt-1 max-w-xs'>Upload a high-quality image of the car for better platform conversion.</p>
          </div>
        </div>

        {/* Car Brand & Model */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
          <div className='flex flex-col w-full'>
            <label className='text-[10px] uppercase tracking-widest text-gray-500 font-black mb-2'>Brand</label>
            <input type="text" placeholder="e.g. BMW, Mercedes..." required className='px-4 py-3 bg-[#0B0D17] border border-white/10 rounded-xl outline-none focus:border-primary/50 text-white transition-all' value={car.brand} onChange={e=> setCar({...car, brand: e.target.value})}/>
          </div>
          <div className='flex flex-col w-full'>
            <label className='text-[10px] uppercase tracking-widest text-gray-500 font-black mb-2'>Model</label>
            <input type="text" placeholder="e.g. X5, E-Class..." required className='px-4 py-3 bg-[#0B0D17] border border-white/10 rounded-xl outline-none focus:border-primary/50 text-white transition-all' value={car.model} onChange={e=> setCar({...car, model: e.target.value})}/>
          </div>
        </div>

        {/* Car Year, Price, Category */}
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8'>
          <div className='flex flex-col w-full'>
            <label className='text-[10px] uppercase tracking-widest text-gray-500 font-black mb-2'>RTO Issue Date (Age)</label>
            <input type="date" required className='px-4 py-3 bg-[#0B0D17] border border-white/10 rounded-xl outline-none focus:border-primary/50 text-white transition-all appearance-none' value={car.rtoDate} onChange={e=> setCar({...car, rtoDate: e.target.value})}/>
            {car.rtoDate && <span className="text-[10px] text-primary mt-1.5 font-semibold">Calculated Age: <span className="text-white">{calculateAge(car.rtoDate)} years</span></span>}
          </div>
          <div className='flex flex-col w-full'>
            <label className='text-[10px] uppercase tracking-widest text-gray-500 font-black mb-2'>Daily Rate ({currency})</label>
            <input type="number" placeholder="100" required className='px-4 py-3 bg-[#0B0D17] border border-white/10 rounded-xl outline-none focus:border-primary/50 text-white transition-all' value={car.pricePerDay} onChange={e=> setCar({...car, pricePerDay: e.target.value})}/>
          </div>
          <div className='flex flex-col w-full'>
            <label className='text-[10px] uppercase tracking-widest text-gray-500 font-black mb-2'>Category</label>
            <select onChange={e=> setCar({...car, category: e.target.value})} value={car.category} className='px-4 py-3 bg-[#0B0D17] border border-white/10 rounded-xl outline-none focus:border-primary/50 text-white transition-all appearance-none cursor-pointer'>
              <option value="">Select Category</option>
              <option value="Sedan">Sedan</option>
              <option value="SUV">SUV</option>
              <option value="Van">Van</option>
            </select>
          </div>
        </div>

         {/* Car Transmission, Fuel Type, Seating Capacity */}
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8'>
          <div className='flex flex-col w-full'>
            <label className='text-[10px] uppercase tracking-widest text-gray-500 font-black mb-2'>Transmission</label>
            <select onChange={e=> setCar({...car, transmission: e.target.value})} value={car.transmission} className='px-4 py-3 bg-[#0B0D17] border border-white/10 rounded-xl outline-none focus:border-primary/50 text-white transition-all appearance-none cursor-pointer'>
              <option value="">Select Type</option>
              <option value="Automatic">Automatic</option>
              <option value="Manual">Manual</option>
              <option value="Semi-Automatic">Semi-Automatic</option>
            </select>
          </div>
          <div className='flex flex-col w-full'>
            <label className='text-[10px] uppercase tracking-widest text-gray-500 font-black mb-2'>Fuel Type</label>
            <select onChange={e=> setCar({...car, fuel_type: e.target.value})} value={car.fuel_type} className='px-4 py-3 bg-[#0B0D17] border border-white/10 rounded-xl outline-none focus:border-primary/50 text-white transition-all appearance-none cursor-pointer'>
              <option value="">Select Fuel</option>
              <option value="Gas">Gas</option>
              <option value="Diesel">Diesel</option>
              <option value="Petrol">Petrol</option>
              <option value="Electric">Electric</option>
              <option value="Hybrid">Hybrid</option>
            </select>
          </div>
          <div className='flex flex-col w-full'>
            <label className='text-[10px] uppercase tracking-widest text-gray-500 font-black mb-2'>Capacity</label>
            <input type="number" placeholder="4" required className='px-4 py-3 bg-[#0B0D17] border border-white/10 rounded-xl outline-none focus:border-primary/50 text-white transition-all' value={car.seating_capacity} onChange={e=> setCar({...car, seating_capacity: e.target.value})}/>
          </div>
        </div>

         {/* Car Location */}
         <div className='flex flex-col w-full'>
            <label className='text-[10px] uppercase tracking-widest text-gray-500 font-black mb-2'>Deployment Location</label>
            <select onChange={e=> setCar({...car, location: e.target.value})} value={car.location} className='px-4 py-3 bg-[#0B0D17] border border-white/10 rounded-xl outline-none focus:border-primary/50 text-white transition-all appearance-none cursor-pointer'>
              <option value="">Select City</option>
              <option value="New York">New York</option>
              <option value="Los Angeles">Los Angeles</option>
              <option value="Houston">Houston</option>
              <option value="Chicago">Chicago</option>
            </select>
         </div>
        {/* Car Description */}
         <div className='flex flex-col w-full'>
            <label className='text-[10px] uppercase tracking-widest text-gray-500 font-black mb-2'>Detailed Description</label>
            <textarea rows={5} placeholder="Briefly describe the vehicle's unique features, condition, and optional extras..." required className='px-4 py-3 bg-[#0B0D17] border border-white/10 rounded-xl outline-none focus:border-primary/50 text-white transition-all resize-none' value={car.description} onChange={e=> setCar({...car, description: e.target.value})}></textarea>
          </div>

        {/* Custom Admin Features */}
        {isAdmin && (
          <div className='flex flex-col w-full col-span-full'>
            <label className='text-[10px] uppercase tracking-widest text-gray-500 font-black mb-2'>Premium Features</label>
            <div className='flex gap-2 items-center mb-4'>
               <input 
                 type="text" 
                 id="feature-input"
                 placeholder="e.g. Panoramic Sunroof, GPS..." 
                 className='px-4 py-3 bg-[#0B0D17] border border-white/10 rounded-xl outline-none focus:border-primary/50 text-white transition-all w-full flex-1'
                 onKeyDown={(e) => {
                   if (e.key === 'Enter') {
                     e.preventDefault();
                     if (e.target.value.trim()) {
                       setCar({...car, features: [...(car.features || []), e.target.value.trim()]});
                       e.target.value = '';
                     }
                   }
                 }}
               />
               <button 
                 type="button" 
                 onClick={() => {
                   const input = document.getElementById('feature-input');
                   if (input.value.trim()) {
                     setCar({...car, features: [...(car.features || []), input.value.trim()]});
                     input.value = '';
                   }
                 }}
                 className='px-6 py-3 bg-white/5 hover:bg-primary/20 text-white rounded-xl border border-white/10 hover:border-primary/50 transition-all font-bold text-sm h-full whitespace-nowrap outline-none'
               >
                 Add
               </button>
            </div>
            <div className='flex flex-wrap gap-2 min-h-8'>
               {car.features?.map((feat, idx) => (
                 <div key={idx} className='flex items-center gap-2 px-3 py-1.5 bg-primary/10 border border-primary/20 rounded-lg group'>
                    <span className='text-xs font-semibold text-primary'>{feat}</span>
                    <button type="button" onClick={() => setCar({...car, features: car.features.filter((_, i) => i !== idx)})} className='text-primary/50 hover:text-red-400 outline-none'>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3 h-3"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>
                    </button>
                 </div>
               ))}
               {(!car.features || car.features.length === 0) && <span className='text-xs text-gray-600 font-medium italic'>No custom features added. Type and press Add/Enter.</span>}
            </div>
          </div>
        )}

        <button className='w-full md:w-max px-10 py-5 bg-primary text-[#0a0a0a] rounded-2xl font-black uppercase tracking-[0.2em] shadow-[0_0_30px_rgba(212,175,55,0.2)] hover:shadow-[0_0_40px_rgba(212,175,55,0.4)] hover:bg-primary-dull transition-all cursor-pointer flex items-center justify-center gap-4 text-xs'>
          {isLoading ? 'Processing Fleet Data...' : (
            <>
              {isAdmin && <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>}
              {isAdmin ? 'Deploy Vehicle' : 'Submit Listing Request'}
            </>
          )}
        </button>

      </form>

    </div>
  )
}

export default AddCar
