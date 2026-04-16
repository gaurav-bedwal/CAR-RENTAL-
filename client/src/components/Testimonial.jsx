import React from 'react'
import Title from './Title'
import { assets } from '../assets/assets';
import { motion } from 'motion/react';
import { useAppContext } from '../context/AppContext';
import { useEffect, useState } from 'react';

const Testimonial = () => {

  const { axios } = useAppContext()
  const [testimonials, setTestimonials] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchPublicFeedback = async () => {
    try {
      const { data } = await axios.get('/api/user/public-feedback')
      if (data.success) {
        setTestimonials(data.feedbacks)
      }
    } catch (error) {
       console.log("Error fetching testimonials", error)
    } finally {
       setLoading(false)
    }
  }

  useEffect(() => {
    fetchPublicFeedback()
  }, [])


  return (
    <div className="py-28 px-6 md:px-16 lg:px-24 xl:px-32 bg-[#0a0a0a]">

      <Title title="What Our Customers Say" subTitle="Discover why discerning travelers choose RENTLUX for their luxury transportation needs." />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-16">
        {testimonials.length > 0 ? testimonials.map((testimonial, index) => (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.2, ease: 'easeOut' }}
            viewport={{ once: true, amount: 0.3 }}

            key={index} className="bg-[#111] border border-white/5 p-8 rounded-2xl shadow-xl hover:border-primary/30 transition-colors duration-500 relative">
            <div className="absolute top-6 right-8 text-primary/20 text-6xl font-serif">"</div>

            <div className="flex items-center gap-4">
              {testimonial.user?.image ? (
                <img className="w-14 h-14 rounded-full object-cover border-2 border-primary/50" src={testimonial.user.image} alt={testimonial.user.name} />
              ) : (
                <div className="w-14 h-14 rounded-full bg-primary/20 border-2 border-primary/50 flex items-center justify-center text-primary font-black text-xl">
                  {testimonial.user?.name?.charAt(0) || '?'}
                </div>
              )}
              <div>
                <p className="text-xl font-bold text-white tracking-wide">{testimonial.user?.name || "Client"}</p>
                <p className="text-primary text-[10px] uppercase tracking-[0.2em] font-black mt-1">Verified Customer</p>
              </div>
            </div>
            <div className="flex items-center gap-1 mt-6">
              {Array(testimonial.rating).fill(0).map((_, i) => (
                <img key={i} src={assets.star_icon} alt="star-icon" className="w-4 h-4" />
              ))}
              {Array(5 - testimonial.rating).fill(0).map((_, i) => (
                <img key={i} src={assets.star_icon} alt="star-icon" className="w-4 h-4 grayscale opacity-20" />
              ))}
            </div>
            <p className="text-gray-400 mt-5 font-light leading-relaxed">"{testimonial.message}"</p>
          </motion.div>
        )) : !loading && (
          <div className="col-span-full py-12 text-center">
             <p className="text-gray-500 italic uppercase tracking-[0.3em] text-xs">More exceptional reviews are being processed...</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Testimonial
