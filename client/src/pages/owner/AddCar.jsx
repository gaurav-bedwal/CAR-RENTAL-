import React, { useState } from 'react'
import Title from '../../components/owner/Title'
import { assets } from '../../assets/assets'
import { useAppContext } from '../../context/AppContext'
import toast from 'react-hot-toast'

const AddCar = () => {

  const {axios, currency, isAdmin, fetchCars} = useAppContext()

  const [image, setImage] = useState(null)
  const [rcFile, setRcFile] = useState(null)
  const [pucFile, setPucFile] = useState(null)
  const [insuranceFile, setInsuranceFile] = useState(null)

  const [car, setCar] = useState({
    brand: '',
    model: '',
    year: 0,
    pricePerDay: 0,
    pricePerHour: 0,
    category: '',
    transmission: '',
    fuel_type: '',
    seating_capacity: 0,
    location: '',
    description: '',
    features: [],
    threeSixtyImages: '',
    rtoDate: '',
    fitnessExpiryDate: '',
    luggageCapacity: 0,
    image: '' 
  })

  const commonFeatures = [
    "Air Conditioning", "ABS", "Airbags", "Bluetooth", "Music System", 
    "GPS / Navigation", "Sunroof", "Reverse Camera", "USB Charger", 
    "Child Seat", "Power Steering", "Central Locking"
  ]

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

    if(!image && !car.image){
      return toast.error("Please upload a vehicle image")
    }

    if (!isAdmin && (!rcFile || !pucFile || !insuranceFile)) {
      return toast.error("Please upload all mandatory documents (RC, PUC, Insurance)")
    }

    setIsLoading(true)
    try {
      const formData = new FormData()
      formData.append('image', image)
      if (rcFile) formData.append('rc', rcFile)
      if (pucFile) formData.append('puc', pucFile)
      if (insuranceFile) formData.append('insurance', insuranceFile)

      const carDataToSubmit = {
        ...car,
        year: calculateAge(car.rtoDate),
        threeSixtyImages: typeof car.threeSixtyImages === 'string' 
          ? car.threeSixtyImages.split('\n').filter(url => url.trim() !== '') 
          : car.threeSixtyImages
      }

      formData.append('carData', JSON.stringify(carDataToSubmit))

      const {data} = await axios.post('/api/owner/add-car', formData)

      if(data.success){
        toast.success(data.message)
        fetchCars()
        setImage(null)
        setRcFile(null)
        setPucFile(null)
        setInsuranceFile(null)
        setCar({
          brand: '',
          model: '',
          year: 0,
          pricePerDay: 0,
          pricePerHour: 0,
          category: '',
          transmission: '',
          fuel_type: '',
          seating_capacity: 0,
          location: '',
          description: '',
          features: [],
          threeSixtyImages: '',
          rtoDate: '',
          fitnessExpiryDate: '',
          luggageCapacity: 0,
          image: ''
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

  const toggleFeature = (feat) => {
    if (car.features?.includes(feat)) {
      setCar({ ...car, features: car.features.filter(f => f !== feat) })
    } else {
      setCar({ ...car, features: [...(car.features || []), feat] })
    }
  }

  return (
    <div className='px-4 py-10 md:px-10 flex-1'>

      <Title title={isAdmin ? "Add New Car to Fleet" : "Request Car Listing"} subTitle={isAdmin ? "Add a new vehicle directly to the platform's active fleet." : "Submit your car details and mandatory documents for administrative review."}/>

      <form onSubmit={onSubmitHandler} className='flex flex-col gap-8 text-gray-400 text-sm mt-10 max-w-2xl'>

        {/* SECTION: Basic Vehicle Visuals */}
        <div className='flex flex-col gap-1 pr-4'>
           <h3 className='text-white font-bold text-lg'>1. Vehicle Identity</h3>
           <p className='text-[10px] uppercase tracking-[0.2em] text-primary font-black'>First impressions matter</p>
        </div>

        <div className='flex flex-col gap-6 p-6 rounded-3xl bg-[#141824]/40 border border-white/5 backdrop-blur-sm'>
          <div className="flex items-center gap-6">
            <label htmlFor="car-image" className='relative group cursor-pointer'>
              <div className='w-24 h-24 rounded-2xl overflow-hidden border-2 border-dashed border-white/20 group-hover:border-primary/50 transition-all flex items-center justify-center bg-[#0B0D17]'>
                {image ? (
                  <img src={URL.createObjectURL(image)} alt="" className='w-full h-full object-cover' />
                ) : car.image ? (
                  <img src={car.image} alt="" className='w-full h-full object-cover' />
                ) : (
                  <img src={assets.upload_icon} alt="" className='w-8 h-8 opacity-40 group-hover:opacity-100 transition-opacity' />
                )}
              </div>
              <input type="file" id="car-image" accept="image/*" hidden onChange={e=> {setImage(e.target.files[0]); setCar({...car, image: ''})}}/>
            </label>
            <div>
              <p className='text-white font-bold text-lg tracking-tight'>Main Profile Photo</p>
              <p className='text-xs text-gray-500 mt-1 max-w-xs'>Full exterior view. Square aspect ratio (1:1) recommended.</p>
            </div>
          </div>
          
          <div className='flex flex-col w-full'>
            <label className='text-[9px] uppercase tracking-widest text-primary font-black mb-2'>Or Direct Image URL</label>
            <input 
              type="text" 
              placeholder="https://images.unsplash.com/photo-xxx" 
              className='px-4 py-3 bg-[#0B0D17] border border-white/10 rounded-xl outline-none focus:border-primary/50 text-white transition-all text-xs' 
              value={car.image} 
              onChange={e=> {setCar({...car, image: e.target.value}); setImage(null)}}
            />
          </div>
        </div>

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

        {/* SECTION: Documents & Compliance */}
        <div className='flex flex-col gap-1 pr-4 mt-4'>
           <h3 className='text-white font-bold text-lg'>2. Compliance & Documents</h3>
           <p className='text-[10px] uppercase tracking-[0.2em] text-orange-500 font-black'>Mandatory for validation</p>
        </div>

        <div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
            {/* RC Upload */}
            <div className={`p-4 rounded-2xl bg-[#141824]/40 border ${rcFile ? 'border-green-500/30' : 'border-white/5'} transition-all`}>
                <label className='block text-[9px] uppercase tracking-widest text-gray-500 mb-3'>Car RC (Book)</label>
                <label className='cursor-pointer flex items-center justify-center h-24 bg-[#0B0D17] rounded-xl border border-dashed border-white/10 hover:border-primary/50 transition-all'>
                    {!rcFile ? (
                        <div className='text-center'>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 mx-auto mb-1 opacity-40"><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" /></svg>
                            <span className='text-[10px] opacity-40'>Upload RC</span>
                        </div>
                    ) : (
                        <div className='text-center text-green-400'>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8 mx-auto mb-1"><path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg>
                            <span className='text-[10px] font-bold'>Captured</span>
                        </div>
                    )}
                    <input type="file" hidden accept=".pdf,image/*" onChange={e => setRcFile(e.target.files[0])}/>
                </label>
            </div>
            {/* PUC Upload */}
            <div className={`p-4 rounded-2xl bg-[#141824]/40 border ${pucFile ? 'border-green-500/30' : 'border-white/5'} transition-all`}>
                <label className='block text-[9px] uppercase tracking-widest text-gray-500 mb-3'>PUC Certificate</label>
                <label className='cursor-pointer flex items-center justify-center h-24 bg-[#0B0D17] rounded-xl border border-dashed border-white/10 hover:border-primary/50 transition-all'>
                    {!pucFile ? (
                        <div className='text-center'>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 mx-auto mb-1 opacity-40"><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" /></svg>
                            <span className='text-[10px] opacity-40'>Upload PUC</span>
                        </div>
                    ) : (
                        <div className='text-center text-green-400'>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8 mx-auto mb-1"><path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg>
                            <span className='text-[10px] font-bold'>Captured</span>
                        </div>
                    )}
                    <input type="file" hidden accept=".pdf,image/*" onChange={e => setPucFile(e.target.files[0])}/>
                </label>
            </div>
            {/* Insurance Upload */}
            <div className={`p-4 rounded-2xl bg-[#141824]/40 border ${insuranceFile ? 'border-green-500/30' : 'border-white/5'} transition-all`}>
                <label className='block text-[9px] uppercase tracking-widest text-gray-500 mb-3'>Insurance Policy</label>
                <label className='cursor-pointer flex items-center justify-center h-24 bg-[#0B0D17] rounded-xl border border-dashed border-white/10 hover:border-primary/50 transition-all'>
                    {!insuranceFile ? (
                        <div className='text-center'>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 mx-auto mb-1 opacity-40"><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" /></svg>
                            <span className='text-[10px] opacity-40'>Upload Policy</span>
                        </div>
                    ) : (
                        <div className='text-center text-green-400'>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8 mx-auto mb-1"><path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg>
                            <span className='text-[10px] font-bold'>Captured</span>
                        </div>
                    )}
                    <input type="file" hidden accept=".pdf,image/*" onChange={e => setInsuranceFile(e.target.files[0])}/>
                </label>
            </div>
        </div>

        <div className='grid grid-cols-1 sm:grid-cols-2 gap-8'>
          <div className='flex flex-col w-full'>
            <label className='text-[10px] uppercase tracking-widest text-gray-500 font-black mb-2'>RTO Issue Date (Original)</label>
            <input type="date" required className='px-4 py-3 bg-[#0B0D17] border border-white/10 rounded-xl outline-none focus:border-primary/50 text-white transition-all appearance-none [color-scheme:dark]' value={car.rtoDate} onChange={e=> setCar({...car, rtoDate: e.target.value})}/>
          </div>
          <div className='flex flex-col w-full'>
            <label className='text-[10px] uppercase tracking-widest text-primary font-black mb-2'>Vehicle Fitness Valid Upto</label>
            <input type="date" required className='px-4 py-3 bg-[#0B0D17] border border-primary/20 rounded-xl outline-none focus:border-primary/50 text-white transition-all appearance-none [color-scheme:dark]' value={car.fitnessExpiryDate} onChange={e=> setCar({...car, fitnessExpiryDate: e.target.value})}/>
          </div>
        </div>

        {/* SECTION: Technical Specifications */}
        <div className='flex flex-col gap-1 pr-4 mt-4'>
           <h3 className='text-white font-bold text-lg'>3. Technical Specs</h3>
           <p className='text-[10px] uppercase tracking-[0.2em] text-gray-500 font-black'>The nitty-gritty details</p>
        </div>

        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8'>
          <div className='flex flex-col w-full'>
            <label className='text-[10px] uppercase tracking-widest text-gray-500 font-black mb-2'>Daily Rate ({currency})</label>
            <input type="number" placeholder="5000" className='px-4 py-3 bg-[#0B0D17] border border-white/10 rounded-xl outline-none focus:border-primary/50 text-white transition-all' required value={car.pricePerDay} onChange={e=> setCar({...car, pricePerDay: e.target.value})}/>
          </div>
          <div className='flex flex-col w-full'>
            <label className='text-[10px] uppercase tracking-widest text-gray-500 font-black mb-2'>Hourly Rate ({currency})</label>
            <input type="number" placeholder="250" className='px-4 py-3 bg-[#0B0D17] border border-white/10 rounded-xl outline-none focus:border-primary/50 text-white transition-all' required value={car.pricePerHour} onChange={e=> setCar({...car, pricePerHour: e.target.value})}/>
          </div>
          <div className='flex flex-col w-full'>
            <label className='text-[10px] uppercase tracking-widest text-gray-500 font-black mb-2'>Category</label>
            <select required onChange={e=> setCar({...car, category: e.target.value})} value={car.category} className='px-4 py-3 bg-[#0B0D17] border border-white/10 rounded-xl outline-none focus:border-primary/50 text-white transition-all appearance-none cursor-pointer'>
              <option value="">Select Category</option>
              <option value="Sedan">Sedan</option>
              <option value="SUV">SUV</option>
              <option value="Van">Van</option>
              <option value="Luxury">Luxury</option>
              <option value="Sport">Sport</option>
            </select>
          </div>
        </div>

        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8'>
          <div className='flex flex-col w-full'>
            <label className='text-[10px] uppercase tracking-widest text-gray-500 font-black mb-2'>Transmission</label>
            <select required onChange={e=> setCar({...car, transmission: e.target.value})} value={car.transmission} className='px-4 py-3 bg-[#0B0D17] border border-white/10 rounded-xl outline-none focus:border-primary/50 text-white transition-all appearance-none cursor-pointer'>
              <option value="">Select Type</option>
              <option value="Automatic">Automatic</option>
              <option value="Manual">Manual</option>
            </select>
          </div>
          <div className='flex flex-col w-full'>
            <label className='text-[10px] uppercase tracking-widest text-gray-500 font-black mb-2'>Fuel Type</label>
            <select required onChange={e=> setCar({...car, fuel_type: e.target.value})} value={car.fuel_type} className='px-4 py-3 bg-[#0B0D17] border border-white/10 rounded-xl outline-none focus:border-primary/50 text-white transition-all appearance-none cursor-pointer'>
              <option value="">Select Fuel</option>
              <option value="Diesel">Diesel</option>
              <option value="Petrol">Petrol</option>
              <option value="Electric">Electric</option>
              <option value="Hybrid">Hybrid</option>
            </select>
          </div>
          <div className='flex flex-col w-full'>
            <label className='text-[10px] uppercase tracking-widest text-gray-500 font-black mb-2'>Capacity (Person)</label>
            <input type="number" placeholder="4" required className='px-4 py-3 bg-[#0B0D17] border border-white/10 rounded-xl outline-none focus:border-primary/50 text-white transition-all' value={car.seating_capacity} onChange={e=> setCar({...car, seating_capacity: e.target.value})}/>
          </div>
        </div>

        <div className='grid grid-cols-1 sm:grid-cols-2 gap-8'>
          <div className='flex flex-col w-full'>
            <label className='text-[10px] uppercase tracking-widest text-gray-500 font-black mb-2'>Deployment City</label>
            <select required onChange={e=> setCar({...car, location: e.target.value})} value={car.location} className='px-4 py-3 bg-[#0B0D17] border border-white/10 rounded-xl outline-none focus:border-primary/50 text-white transition-all appearance-none cursor-pointer'>
              <option value="">Select City</option>
              <option value="New York">New York</option>
              <option value="Los Angeles">Los Angeles</option>
              <option value="Houston">Houston</option>
              <option value="Chicago">Chicago</option>
              <option value="Miami">Miami</option>
            </select>
          </div>
           <div className='flex flex-col w-full'>
            <label className='text-[10px] uppercase tracking-widest text-gray-500 font-black mb-2'>Luggage Capacity (Total Bags)</label>
            <input type="number" placeholder="e.g. 2 Large, 1 Small" required className='px-4 py-3 bg-[#0B0D17] border border-white/10 rounded-xl outline-none focus:border-primary/50 text-white transition-all' value={car.luggageCapacity} onChange={e=> setCar({...car, luggageCapacity: e.target.value})}/>
          </div>
        </div>

         <div className='flex flex-col w-full'>
            <label className='text-[10px] uppercase tracking-widest text-gray-500 font-black mb-2'>Vehicle Bio (Description)</label>
            <textarea rows={5} placeholder="Tell us what makes your car special..." required className='px-4 py-3 bg-[#0B0D17] border border-white/10 rounded-xl outline-none focus:border-primary/50 text-white transition-all resize-none' value={car.description} onChange={e=> setCar({...car, description: e.target.value})}></textarea>
          </div>

        {/* SECTION: Features Selector */}
        <div className='flex flex-col gap-1 pr-4 mt-4'>
           <h3 className='text-white font-bold text-lg'>4. Features & Amenities</h3>
           <p className='text-[10px] uppercase tracking-[0.2em] text-primary font-black'>Check everything that applies</p>
        </div>

        <div className='flex flex-col w-full p-6 rounded-3xl bg-[#141824]/40 border border-white/5'>
            <div className='flex flex-wrap gap-2'>
               {commonFeatures.map(feat => (
                 <button 
                  key={feat}
                  type='button'
                  onClick={() => toggleFeature(feat)}
                  className={`px-4 py-2 rounded-xl text-[11px] font-bold transition-all border ${car.features?.includes(feat) ? 'bg-primary text-black border-primary' : 'bg-white/5 text-gray-400 border-white/10 hover:border-primary/50'}`}
                 >
                   {feat}
                 </button>
               ))}
            </div>
            
            {/* Custom Admin Features Input */}
            <div className='mt-6 border-t border-white/5 pt-6'>
                <label className='text-[10px] uppercase tracking-widest text-gray-500 font-black mb-4 block'>Custom Extras (Press Enter)</label>
                <div className='flex gap-2 items-center'>
                <input 
                    type="text" 
                    id="feature-input"
                    placeholder="e.g. Panoramic Sunroof, GPS..." 
                    className='px-4 py-3 bg-[#0B0D17] border border-white/10 rounded-xl outline-none focus:border-primary/50 text-white transition-all w-full flex-1'
                    onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                        e.preventDefault();
                        if (e.target.value.trim() && !car.features?.includes(e.target.value.trim())) {
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
                    if (input.value.trim() && !car.features?.includes(input.value.trim())) {
                        setCar({...car, features: [...(car.features || []), input.value.trim()]});
                        input.value = '';
                    }
                    }}
                    className='px-6 py-3 bg-white/5 hover:bg-primary/20 text-white rounded-xl border border-white/10 hover:border-primary/50 transition-all font-bold text-sm h-full whitespace-nowrap outline-none'
                >
                    Add
                </button>
                </div>
            </div>
        </div>

        {/* SECTION: Interactive View */}
        <div className='flex flex-col gap-1 pr-4 mt-4'>
           <h3 className='text-white font-bold text-lg'>5. Ultra-Vision 360</h3>
           <p className='text-[10px] uppercase tracking-[0.2em] text-primary font-black'>Optional premium presentation</p>
        </div>

        <div className='flex flex-col w-full p-6 rounded-3xl bg-primary/5 border border-primary/10 backdrop-blur-sm'>
            <p className='text-xs text-gray-500 mb-4 leading-relaxed'>To enable interactive 360° rotation, paste image URLs for each frame on a <span className='text-white font-semibold'>new line</span>.</p>
            <textarea 
              rows={6} 
              placeholder="https://example.com/frame_1.jpg&#10;https://example.com/frame_2.jpg&#10;..." 
              className='px-4 py-4 bg-[#0B0D17] border border-white/10 rounded-xl outline-none focus:border-primary/50 text-white transition-all resize-none font-mono text-xs custom-scrollbar' 
              value={car.threeSixtyImages} 
              onChange={e=> setCar({...car, threeSixtyImages: e.target.value})}
            ></textarea>
        </div>

        <div className='pt-10'>
            <button disabled={isLoading} className='w-full md:w-max px-12 py-6 bg-primary text-[#0a0a0a] rounded-2xl font-black uppercase tracking-[0.2em] shadow-[0_0_30px_rgba(212,175,55,0.2)] hover:shadow-[0_0_40px_rgba(212,175,55,0.4)] hover:bg-primary-dull transition-all cursor-pointer flex items-center justify-center gap-4 text-sm disabled:opacity-50 disabled:cursor-not-allowed'>
                {isLoading ? 'Processing Listing...' : (
                    <>
                    {isAdmin ? 'Deploy Immediately' : 'Send Listing for Approval'}
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" /></svg>
                    </>
                )}
            </button>
            <p className='text-[10px] text-gray-600 mt-4 uppercase tracking-widest text-center md:text-left'>By submitting, you agree to our vehicle maintenance and safety standards.</p>
        </div>

      </form>

    </div>
  )
}

export default AddCar
