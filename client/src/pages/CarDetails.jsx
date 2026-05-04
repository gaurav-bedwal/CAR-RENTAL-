import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { assets, dummyCarData } from '../assets/assets'
import Loader from '../components/Loader'
import { useAppContext } from '../context/AppContext'
import toast from 'react-hot-toast'
import { motion, AnimatePresence } from 'motion/react'
import Car360Viewer from '../components/Car360Viewer'

const CarDetails = () => {

  const { id } = useParams()

  const { cars, axios, pickupDate, setPickupDate, returnDate, setReturnDate, user } = useAppContext()

  const getLocalISOString = () => {
    const now = new Date();
    const tzoffset = now.getTimezoneOffset() * 60000;
    return (new Date(now - tzoffset)).toISOString().slice(0, 16);
  };

  const navigate = useNavigate()
  const [car, setCar] = useState(null)
  const currency = import.meta.env.VITE_CURRENCY

  const [bookingMode, setBookingMode] = useState('daily'); // 'daily' | 'hourly'
  const [calculatedPrice, setCalculatedPrice] = useState(0);
  const [totalDuration, setTotalDuration] = useState('');
  const [bookingError, setBookingError] = useState('');
  const [viewMode, setViewMode] = useState('static'); // 'static' | '360'
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (pickupDate && returnDate && car) {
      const p = new Date(pickupDate);
      const r = new Date(returnDate);
      const diffHrs = (r - p) / (1000 * 60 * 60);

      if (diffHrs <= 0) {
        setBookingError("Return time must be after pickup time.");
        setCalculatedPrice(0);
        setTotalDuration('');
        return;
      }

      // Automatically suggest/switch to hourly if same day and <= 6 hours
      // but only if the user hasn't explicitly chosen a mode or if it's clearly an hourly intent
      const isSameDay = p.toDateString() === r.toDateString();
      
      if (bookingMode === 'hourly') {
        if (diffHrs > 6) {
          setBookingError("Hourly reservations are strictly limited to a maximum of 6 hours.");
          setCalculatedPrice(0);
          setTotalDuration('');
        } else {
          setBookingError("");
          const hrs = Math.ceil(diffHrs);
          const rate = car.pricePerHour > 0 ? car.pricePerHour : Math.ceil(car.pricePerDay / 10); // Fallback to 10% of daily if not set
          setCalculatedPrice(hrs * rate);
          setTotalDuration(`${hrs} Hour${hrs > 1 ? 's' : ''}`);
        }
      } else {
        setBookingError("");
        const days = Math.max(1, Math.ceil(diffHrs / 24));
        setCalculatedPrice(days * (car.pricePerDay || 0));
        setTotalDuration(`${days} Day${days > 1 ? 's' : ''}`);
      }
    } else {
      setCalculatedPrice(0);
      setTotalDuration('');
      setBookingError('');
    }
  }, [pickupDate, returnDate, bookingMode, car]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (bookingError) {
        return toast.error(bookingError);
      }
      if (calculatedPrice <= 0 && !bookingError) {
        return toast.error("Pricing information is missing for this selection. Please try another vehicle.");
      }

      setIsSubmitting(true);

      const { data } = await axios.post('/api/bookings/create-order', {
        car: id,
        pickupDate,
        returnDate,
        bookingMode // Transmit mode to ensure correct bill processing backend
      })

      if (data.success) {
         const options = {
             key: import.meta.env.VITE_RAZORPAY_KEY_ID,
             amount: data.order.amount,
             currency: data.order.currency,
             name: "RentLux",
             description: `Booking ${car.brand} ${car.model}`,
             order_id: data.order.id,
             handler: async function (response) {
                 try {
                     const verifyData = await axios.post('/api/bookings/verify-payment', {
                         razorpay_order_id: response.razorpay_order_id,
                         razorpay_payment_id: response.razorpay_payment_id,
                         razorpay_signature: response.razorpay_signature,
                     });
                     
                     if (verifyData.data.success) {
                         toast.success("Payment successful!");
                         navigate('/my-bookings');
                     } else {
                         toast.error(verifyData.data.message);
                     }
                 } catch (err) {
                     toast.error("Payment verification failed");
                 } finally {
                     setIsSubmitting(false);
                 }
             },
             prefill: {
                 name: user?.name,
                 email: user?.email,
                 contact: user?.mobile
             },
             theme: {
                 color: "#d4af37" // primary color
             },
             modal: {
                 ondismiss: function() {
                     setIsSubmitting(false);
                 }
             }
         };
         
         const rzp1 = new window.Razorpay(options);
         
         rzp1.on('payment.failed', function (response){
             toast.error("Payment failed: " + response.error.description);
             setIsSubmitting(false);
         });
         
         rzp1.open();
      } else {
        toast.error(data.message)
        setIsSubmitting(false);
      }
    } catch (error) {
      toast.error(error.message)
      setIsSubmitting(false);
    }
  }

  useEffect(() => {
    setCar(cars.find(car => car._id === id))
  }, [cars, id])

  return car ? (
    <div className='px-4 md:px-16 lg:px-24 xl:px-32 py-10 md:py-16 bg-[#0a0a0a] min-h-screen text-gray-300'>

      <button onClick={() => navigate(-1)} className='flex items-center gap-2 mb-8 text-gray-400 hover:text-primary transition-colors cursor-pointer group uppercase tracking-wider text-sm font-semibold'>
        <img src={assets.arrow_icon} alt="" className='rotate-180 brightness-200 opacity-60 group-hover:invert transition-all mr-1' />
        Back to all cars
      </button>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12'>
        {/* Left: Car Image & Details */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}

          className='lg:col-span-2'>
          <div className="relative rounded-2xl overflow-hidden shadow-2xl mb-8 border border-white/5 bg-[#0a0a0a]">
            <AnimatePresence mode='wait'>
              {viewMode === 'static' ? (
                <motion.img
                  key="static"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  src={car.image} 
                  alt="" 
                  className='w-full h-auto md:max-h-120 object-cover' 
                />
              ) : (
                <motion.div
                  key="360"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Car360Viewer images={car.threeSixtyImages} />
                </motion.div>
              )}
            </AnimatePresence>
            
            {car.threeSixtyImages && car.threeSixtyImages.length > 0 && (
              <div className="absolute top-4 left-4 z-10 flex gap-2">
                 <button 
                  type="button"
                  onClick={() => setViewMode('static')}
                  className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${viewMode === 'static' ? 'bg-primary text-black shadow-[0_0_15px_rgba(212,175,55,0.4)]' : 'bg-black/60 text-white hover:bg-black/80'}`}
                 >
                   Photo
                 </button>
                 <button 
                  type="button"
                  onClick={() => setViewMode('360')}
                  className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${viewMode === '360' ? 'bg-primary text-black shadow-[0_0_15px_rgba(212,175,55,0.4)]' : 'bg-black/60 text-white hover:bg-black/80'}`}
                 >
                   360° View
                 </button>
              </div>
            )}
            
            {viewMode === 'static' && <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] to-transparent opacity-60 pointer-events-none"></div>}
          </div>

          <motion.div className='space-y-8 bg-[#111] p-8 rounded-2xl border border-white/5 shadow-xl'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <div>
              <h1 className='text-3xl md:text-4xl font-bold text-white tracking-wide'>{car.brand} {car.model}</h1>
              <p className='text-primary text-lg mt-2 uppercase tracking-wider font-semibold'>{car.category} <span className="text-gray-600 mx-2">•</span> <span className="text-gray-400">{car.year}</span></p>
            </div>
            <hr className='border-white/10 my-6' />

            <div className='grid grid-cols-2 sm:grid-cols-4 gap-4'>
              {[
                { icon: assets.users_icon, text: `${car.seating_capacity} Seats` },
                { icon: assets.fuel_icon, text: car.fuel_type },
                { icon: assets.car_icon, text: car.transmission },
                { icon: assets.location_icon, text: car.location },
              ].map(({ icon, text }) => (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}

                  key={text} className='flex flex-col items-center justify-center bg-[#0a0a0a] border border-white/5 py-6 px-4 rounded-xl hover:border-primary/30 transition-colors'>
                  <img src={icon} alt="" className='h-6 mb-3 brightness-200 opacity-60' />
                  <span className="text-sm tracking-wide text-gray-300">{text}</span>
                </motion.div>
              ))}
            </div>

            {/* Description */}
            <div>
              <h1 className='text-xl md:text-2xl font-semibold text-white mb-4 tracking-wide'>Description</h1>
              <p className='text-gray-400 leading-relaxed font-light'>{car.description}</p>
            </div>

            {/* Features */}
            <div>
              <h1 className='text-xl md:text-2xl font-semibold text-white mb-4 tracking-wide'>Features</h1>
              <ul className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                {
                  (car.features && car.features.length > 0 ? car.features : ["Bluetooth", "GPS", "Air Conditioning"]).map((item) => (
                    <li key={item} className='flex items-center text-gray-400 bg-[#0a0a0a] rounded-lg px-4 py-3 border border-white/5'>
                      <img src={assets.check_icon} className='h-4 mr-3 brightness-200 opacity-80' alt="" />
                      {item}
                    </li>
                  ))
                }
              </ul>
            </div>

          </motion.div>
        </motion.div>

        {/* Right: Booking Form */}
        <motion.form
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}

          onSubmit={handleSubmit} className='bg-[#111] border border-white/5 shadow-2xl h-max lg:sticky lg:top-[100px] rounded-2xl p-6 md:p-8 space-y-6 text-gray-300'>

          <div className='flex gap-2 p-1 bg-[#0a0a0a] rounded-xl border border-white/10'>
             <button type="button" onClick={() => setBookingMode('daily')} className={`flex-1 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${bookingMode === 'daily' ? 'bg-primary text-black' : 'text-gray-500 hover:text-white'}`}>Daily</button>
             <button type="button" onClick={() => setBookingMode('hourly')} className={`flex-1 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${bookingMode === 'hourly' ? 'bg-primary text-black' : 'text-gray-500 hover:text-white'}`}>Hourly (Max 6 hrs)</button>
          </div>

          <div className='flex items-end justify-between font-semibold mt-4 bg-[#0a0a0a] p-4 rounded-xl border border-white/5'>
             <div className='flex flex-col'>
                <span className='text-sm text-gray-500 uppercase tracking-widest mb-1'>Rate ({bookingMode})</span>
                {bookingMode === 'daily' ? (
                  <span className='text-2xl text-white font-bold tracking-tight'>{currency}{car.pricePerDay} <span className="text-sm font-normal text-gray-500">/day</span></span>
                ) : (
                  <span className='text-2xl text-white font-bold tracking-tight'>{currency}{car.pricePerHour || 0} <span className="text-sm font-normal text-gray-500">/hr</span></span>
                )}
             </div>
             {calculatedPrice > 0 && !bookingError && (
               <div className='flex flex-col items-end'>
                 <span className='text-primary text-[10px] uppercase font-black tracking-widest mb-1'>Total ({totalDuration})</span>
                 <span className='text-3xl text-primary font-black tracking-tight'>{currency}{calculatedPrice}</span>
               </div>
             )}
          </div>

          <hr className='border-white/10 my-4' />
          
          <div className='flex flex-col gap-2'>
            <label htmlFor="pickup-date" className="text-xs uppercase tracking-widest text-gray-400 font-semibold mb-1">Pickup Date & Time</label>
            <input value={pickupDate} onChange={(e) => setPickupDate(e.target.value)}
              type="datetime-local" className='border border-white/10 bg-[#0a0a0a] text-white px-4 py-3 rounded-xl focus:border-primary/50 outline-none transition-colors [color-scheme:dark]' required id='pickup-date' min={getLocalISOString()} />
          </div>

          {bookingMode === 'hourly' && pickupDate && (
             <div className='flex gap-2 mt-2'>
                {[2, 4, 6].map(hrs => (
                   <button type="button" key={hrs} 
                     onClick={() => {
                        const date = new Date(pickupDate);
                        date.setHours(date.getHours() + hrs);
                        // Convert back to local ISO-like string
                        const tzoffset = date.getTimezoneOffset() * 60000;
                        const localISOTime = (new Date(date - tzoffset)).toISOString().slice(0, 16);
                        setReturnDate(localISOTime);
                     }}
                     className='flex-1 text-[10px] uppercase tracking-widest font-bold py-2 bg-[#0a0a0a] border border-white/10 hover:border-primary/50 rounded-lg text-gray-400 hover:text-white transition-colors'
                   >
                     +{hrs} Hrs
                   </button>
                ))}
             </div>
          )}

          <div className='flex flex-col gap-2'>
            <label htmlFor="return-date" className="text-xs uppercase tracking-widest text-gray-400 font-semibold mb-1 mt-2">Return Date & Time</label>
            <input value={returnDate} onChange={(e) => setReturnDate(e.target.value)}
              type="datetime-local" className='border border-white/10 bg-[#0a0a0a] text-white px-4 py-3 rounded-xl focus:border-primary/50 outline-none transition-colors [color-scheme:dark]' required id='return-date' min={pickupDate || getLocalISOString()} />
          </div>
          
          {bookingError && (
             <motion.p initial={{opacity: 0}} animate={{opacity: 1}} className="text-red-400 text-xs font-semibold bg-red-400/10 p-3 rounded-xl border border-red-400/20">{bookingError}</motion.p>
          )}

          <button disabled={!!bookingError || isSubmitting} className={`w-full transition-all py-4 mt-2 font-bold tracking-wider uppercase text-sm text-[#0a0a0a] rounded-xl shadow-[0_0_15px_rgba(212,175,55,0.3)] ${(bookingError || isSubmitting) ? 'bg-gray-600 cursor-not-allowed opacity-50 shadow-none' : 'bg-primary hover:bg-primary-dull cursor-pointer hover:shadow-[0_0_20px_rgba(212,175,55,0.5)]'}`}>
            {isSubmitting ? 'Processing...' : 'Book Now'}
          </button>

          <p className='text-center text-xs text-gray-500 uppercase tracking-widest mt-4'>Secure payment powered by Razorpay</p>

        </motion.form>
      </div>

    </div>
  ) : <Loader />
}

export default CarDetails
