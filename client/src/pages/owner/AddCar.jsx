import React, { useState } from 'react'
import Title from '../../components/owner/Title'
import { assets } from '../../assets/assets'
import { useAppContext } from '../../context/AppContext'
import toast from 'react-hot-toast'

const AddCar = () => {

  const { axios, currency, isAdmin } = useAppContext()

  const [image, setImage] = useState(null)
  const [car, setCar] = useState({
    brand: '',
    model: '',
    year: '',
    pricePerDay: '',
    category: '',
    transmission: '',
    fuel_type: '',
    seating_capacity: '',
    location: '',
    description: '',
  })

  const [isLoading, setIsLoading] = useState(false)

  const onSubmitHandler = async (e) => {
    e.preventDefault()
    if (isLoading) return null

    if (!image) {
      return toast.error("Please upload an image for the car")
    }

    setIsLoading(true)
    try {
      const formData = new FormData()
      formData.append('image', image)
      formData.append('carData', JSON.stringify(car))

      const { data } = await axios.post('/api/owner/add-car', formData)

      if (data.success) {
        toast.success(data.message)
        setImage(null)
        setCar({
          brand: '',
          model: '',
          year: '',
          pricePerDay: '',
          category: '',
          transmission: '',
          fuel_type: '',
          seating_capacity: '',
          location: '',
          description: '',
        })
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const InputLabel = ({ children }) => (
    <label className='block text-lg font-black uppercase text-black mb-3 tracking-tighter'>{children}</label>
  )

  const InputField = (props) => (
    <input 
      {...props} 
      className='w-full bg-white border-4 border-black rounded-2xl px-6 py-5 text-xl font-bold text-black focus:outline-none focus:ring-8 focus:ring-primary/10 transition-all placeholder:text-gray-300'
    />
  )

  const SelectField = ({ children, ...props }) => (
    <select 
      {...props} 
      className='w-full bg-white border-4 border-black rounded-2xl px-6 py-5 text-xl font-bold text-black focus:outline-none focus:ring-8 focus:ring-primary/10 transition-all appearance-none cursor-pointer'
    >
      {children}
    </select>
  )

  return (
    <div className='w-full min-h-screen pb-20'>

      <Title 
        title={isAdmin ? "Add New Vehicle" : "Submit Vehicle Request"} 
        subTitle={isAdmin ? "Fill in the details below to add a new car to the active rental fleet." : "Send your car details to the admin team for platform approval."}
      />

      <form onSubmit={onSubmitHandler} className='mt-10 max-w-4xl bg-white border-4 border-black p-8 md:p-12 rounded-[40px] shadow-[16px_16px_0px_0px_rgba(0,0,0,1)]'>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-12'>
          
          {/* Left Column - Visuals */}
          <div className='flex flex-col gap-8'>
            <div>
               <InputLabel>Vehicle Image</InputLabel>
               <label htmlFor="car-image" className='group block relative aspect-video bg-gray-50 border-4 border-dashed border-gray-300 rounded-3xl overflow-hidden cursor-pointer hover:border-primary transition-all'>
                  {image ? (
                    <img src={URL.createObjectURL(image)} alt="Preview" className='w-full h-full object-cover' />
                  ) : (
                    <div className='absolute inset-0 flex flex-col items-center justify-center text-gray-400 group-hover:text-primary transition-all'>
                       <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-16 h-16 mb-2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                       </svg>
                       <p className='font-black uppercase tracking-widest text-sm'>Select Photo</p>
                    </div>
                  )}
                  <input type="file" id="car-image" accept="image/*" hidden onChange={e => setImage(e.target.files[0])} />
               </label>
            </div>

            <div>
               <InputLabel>Description</InputLabel>
               <textarea 
                  rows={6} 
                  placeholder="Tell us about the car..." 
                  required 
                  className='w-full bg-white border-4 border-black rounded-3xl px-6 py-5 text-xl font-bold text-black focus:outline-none focus:ring-8 focus:ring-primary/10 transition-all placeholder:text-gray-300'
                  value={car.description} 
                  onChange={e => setCar({ ...car, description: e.target.value })}
               ></textarea>
            </div>
          </div>

          {/* Right Column - Data */}
          <div className='flex flex-col gap-8'>
             <div className='grid grid-cols-1 gap-8'>
                <div>
                   <InputLabel>Brand Name</InputLabel>
                   <InputField placeholder="e.g. BMW" required value={car.brand} onChange={e => setCar({ ...car, brand: e.target.value })} />
                </div>
                <div>
                   <InputLabel>Model Name</InputLabel>
                   <InputField placeholder="e.g. X5" required value={car.model} onChange={e => setCar({ ...car, model: e.target.value })} />
                </div>
             </div>

             <div className='grid grid-cols-2 gap-6'>
                <div>
                   <InputLabel>Year</InputLabel>
                   <InputField type="number" placeholder="2024" required value={car.year} onChange={e => setCar({ ...car, year: e.target.value })} />
                </div>
                <div>
                   <InputLabel>Daily Price</InputLabel>
                   <div className='relative'>
                      <span className='absolute left-6 top-1/2 -translate-y-1/2 text-2xl font-black text-primary'>{currency}</span>
                      <input 
                        type="number" 
                        placeholder="0.00" 
                        required 
                        className='w-full bg-white border-4 border-black rounded-2xl pl-14 pr-6 py-5 text-xl font-bold text-black focus:outline-none focus:ring-8 focus:ring-primary/10 transition-all'
                        value={car.pricePerDay} 
                        onChange={e => setCar({ ...car, pricePerDay: e.target.value })} 
                      />
                   </div>
                </div>
             </div>

             <div className='grid grid-cols-2 gap-6'>
                <div>
                  <InputLabel>Category</InputLabel>
                  <SelectField value={car.category} onChange={e => setCar({ ...car, category: e.target.value })} required>
                    <option value="">Select</option>
                    <option value="Sedan">Sedan</option>
                    <option value="SUV">SUV</option>
                    <option value="Van">Van</option>
                  </SelectField>
                </div>
                <div>
                  <InputLabel>Seating</InputLabel>
                  <InputField type="number" placeholder="4" required value={car.seating_capacity} onChange={e => setCar({ ...car, seating_capacity: e.target.value })} />
                </div>
             </div>

             <div className='grid grid-cols-2 gap-6'>
                <div>
                  <InputLabel>Gearbox</InputLabel>
                  <SelectField value={car.transmission} onChange={e => setCar({ ...car, transmission: e.target.value })} required>
                    <option value="">Select</option>
                    <option value="Automatic">Automatic</option>
                    <option value="Manual">Manual</option>
                  </SelectField>
                </div>
                <div>
                  <InputLabel>Fuel</InputLabel>
                  <SelectField value={car.fuel_type} onChange={e => setCar({ ...car, fuel_type: e.target.value })} required>
                    <option value="">Select</option>
                    <option value="Petrol">Petrol</option>
                    <option value="Diesel">Diesel</option>
                    <option value="Electric">Electric</option>
                    <option value="Hybrid">Hybrid</option>
                  </SelectField>
                </div>
             </div>

             <div>
                <InputLabel>Location</InputLabel>
                <SelectField value={car.location} onChange={e => setCar({ ...car, location: e.target.value })} required>
                  <option value="">Select City</option>
                  <option value="New York">New York</option>
                  <option value="Los Angeles">Los Angeles</option>
                  <option value="Houston">Houston</option>
                  <option value="Chicago">Chicago</option>
                </SelectField>
             </div>

          </div>

        </div>

        <div className='mt-16 pt-10 border-t-4 border-black'>
          <button 
            disabled={isLoading}
            className='w-full py-8 bg-black text-white rounded-3xl font-black uppercase text-3xl tracking-tighter shadow-[8px_8px_0px_0px_rgba(255,255,255,0.2)] hover:bg-primary hover:text-black hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-4px] hover:translate-y-[-4px] transition-all flex items-center justify-center gap-4 disabled:bg-gray-400 disabled:cursor-not-allowed'
          >
            {isLoading ? 'Wait...' : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={4} stroke="currentColor" className="w-10 h-10">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
                {isAdmin ? 'Add New Car to Fleet' : 'Submit Listing Request'}
              </>
            )}
          </button>
        </div>

      </form>

    </div>
  )
}

export default AddCar
