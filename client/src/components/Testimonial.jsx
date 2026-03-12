import React from 'react'
import Title from './Title'
import { assets } from '../assets/assets';
import { motion } from 'motion/react';

const Testimonial = () => {

  const testimonials = [
    {
      name: "Emma Rodriguez",
      location: "Barcelona, Spain",
      image: assets.testimonial_image_1,
      testimonial: "I've rented cars from various companies, but the experience with CarRental was exceptional."
    },
    {
      name: "John Smith",
      location: "New York, USA",
      image: assets.testimonial_image_2,
      testimonial: "CarRental made my trip so much easier. The car was delivered right to my door, and the customer service was fantastic!"
    },
    {
      name: "Ava Johnson",
      location: "Sydney, Australia",
      image: assets.testimonial_image_1,
      testimonial: "I highly recommend CarRental! Their fleet is amazing, and I always feel like I'm getting the best deal with excellent service."
    }
  ];

  return (
    <div className="py-28 px-6 md:px-16 lg:px-24 xl:px-32 bg-[#0a0a0a]">

      <Title title="What Our Customers Say" subTitle="Discover why discerning travelers choose RENTLUX for their luxury transportation needs." />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-16">
        {testimonials.map((testimonial, index) => (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.2, ease: 'easeOut' }}
            viewport={{ once: true, amount: 0.3 }}

            key={index} className="bg-[#111] border border-white/5 p-8 rounded-2xl shadow-xl hover:border-primary/30 transition-colors duration-500 relative">
            <div className="absolute top-6 right-8 text-primary/20 text-6xl font-serif">"</div>

            <div className="flex items-center gap-4">
              <img className="w-14 h-14 rounded-full object-cover border-2 border-primary/50" src={testimonial.image} alt={testimonial.name} />
              <div>
                <p className="text-xl font-bold text-white tracking-wide">{testimonial.name}</p>
                <p className="text-primary text-sm uppercase tracking-wider mt-1">{testimonial.location}</p>
              </div>
            </div>
            <div className="flex items-center gap-1 mt-6">
              {Array(5).fill(0).map((_, index) => (
                <img key={index} src={assets.star_icon} alt="star-icon" className="w-4 h-4" />
              ))}
            </div>
            <p className="text-gray-400 mt-5 font-light leading-relaxed">"{testimonial.testimonial}"</p>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

export default Testimonial
