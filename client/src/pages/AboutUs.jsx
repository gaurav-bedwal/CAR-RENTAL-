import React from 'react'
import { motion } from 'motion/react'
import { assets } from '../assets/assets'

const AboutUs = () => {
  const values = [
    {
      title: "Premium Experience",
      description: "We offer curated luxury vehicles maintained to pristine factory standards, ensuring an elite driving experience.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-primary">
          <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499c.174-.407.74-.407.915 0l2.392 5.568 5.793.818c.451.064.63.606.302.916l-4.305 4.102 1.157 5.706c.09.444-.396.793-.787.562L12 18.257l-5.11 3.018c-.391.232-.877-.118-.787-.562l1.157-5.706-4.305-4.102c-.328-.31-.149-.852.302-.916l5.793-.818 2.392-5.568z" />
        </svg>
      )
    },
    {
      title: "Professional Support",
      description: "Our customer service concierge operates 24/7, ready to assist you with bookings, roadside queries, and listings.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-primary">
          <path strokeLinecap="round" strokeLinejoin="round" d="M14.25 9.75v-4.5m0 9v4.5M12 3v1.5m0 15V21m-6.75-4.25h1.5m10.5 0h1.5M3 12h1.5m15 0H21M5.25 5.25l1.06 1.06m10.38 10.38l1.06 1.06M5.25 18.75l1.06-1.06m10.38-10.38l1.06-1.06" />
        </svg>
      )
    },
    {
      title: "Flexible Bookings",
      description: "Rent by the hour (minimum 6 hours) or by the day. Change your schedule seamlessly with our user-friendly dashboard.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-primary">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H16.5v-.008zm0 2.25h.008v.008H16.5V15z" />
        </svg>
      )
    },
    {
      title: "Verified Trust",
      description: "Every vehicle goes through a mandatory compliance review, including RTO records, PUC certificates, and valid insurance validation.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-primary">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
        </svg>
      )
    }
  ]

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className='px-6 md:px-16 lg:px-24 xl:px-32 py-12 md:py-20 bg-[#0B0D17] min-h-screen text-gray-300 max-w-7xl mx-auto'
    >
      {/* Hero Section */}
      <div className="text-center max-w-3xl mx-auto mb-16 md:mb-24">
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-xs uppercase tracking-[0.3em] text-primary font-bold mb-3"
        >
          Discover RentLux
        </motion.p>
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="text-4xl md:text-6xl font-black text-white tracking-tight leading-none uppercase mb-6"
        >
          Elite Travel <span className="text-primary italic">Reimagined</span>
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-sm md:text-base text-gray-400 leading-relaxed"
        >
          At RentLux, we bridge the gap between premium performance and seamless reservation dynamics. Whether you're listing your vehicle or finding your next journey, we build trust every mile of the way.
        </motion.p>
      </div>

      {/* Story & Vision */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20 md:mb-32">
        <div className="relative group rounded-3xl overflow-hidden border border-white/5 shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B0D17] via-transparent to-transparent z-10"></div>
          <img 
            src={assets.banner_car_image || assets.main_car} 
            alt="Luxury vehicle" 
            className="w-full h-auto aspect-[4/3] object-cover group-hover:scale-105 transition-transform duration-700" 
          />
          <div className="absolute bottom-6 left-6 z-20">
            <span className="px-4 py-1.5 rounded-full bg-primary/20 border border-primary/30 text-[10px] text-primary font-bold uppercase tracking-widest">Est. 2025</span>
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="text-2xl md:text-3xl font-black text-white uppercase tracking-wider flex items-center gap-3">
            <span className="w-2.5 h-7 bg-primary rounded-full"></span>
            Our Story & Vision
          </h2>
          <p className="text-gray-400 leading-relaxed text-sm md:text-base font-light">
            Founded with the ambition to simplify premium rentals, RentLux has evolved into a trusted ecosystem connecting owners with premium drivers. We offer an exclusive selection of sedans, SUVs, and luxury sport segments with transparent hourly and daily packages.
          </p>
          <p className="text-gray-400 leading-relaxed text-sm md:text-base font-light">
            We are dedicated to safety and transparency. Our mandatory technical audit checks for RC books, PUC certificates, and insurance policies, ensuring that every drive is legal, safe, and absolute.
          </p>
        </div>
      </div>

      {/* Core Values Section */}
      <div className="mb-20 md:mb-32">
        <div className="text-center max-w-xl mx-auto mb-12 md:mb-16">
          <h2 className="text-3xl font-black text-white uppercase tracking-wider mb-4">Our Core Values</h2>
          <p className="text-xs text-gray-500 uppercase tracking-widest font-semibold">The principles guiding every trip</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {values.map((val, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
              className="p-6 md:p-8 bg-[#141824] border border-white/5 rounded-3xl hover:border-primary/30 transition-all duration-300 flex gap-5 items-start group relative overflow-hidden"
            >
              <div className="absolute -right-10 -bottom-10 w-24 h-24 bg-primary/5 blur-2xl rounded-full group-hover:bg-primary/10 transition-colors"></div>
              <div className="p-3 bg-white/5 rounded-2xl border border-white/10 group-hover:border-primary/30 transition-all">
                {val.icon}
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-white tracking-wide">{val.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed font-light">{val.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Contact & Custom Locations Quick Info */}
      <div className="p-8 md:p-12 bg-white/[0.02] border border-white/5 rounded-[2.5rem] relative overflow-hidden text-center md:text-left flex flex-col md:flex-row md:items-center justify-between gap-8 backdrop-blur-xl">
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-primary/10 blur-[80px] rounded-full pointer-events-none"></div>
        <div>
          <h2 className="text-2xl font-black text-white uppercase tracking-wider mb-2">Want to partner with us?</h2>
          <p className="text-xs text-gray-500 max-w-md uppercase tracking-wider leading-relaxed">
            List your vehicle from Nathupur, Rai, Sonipat, or Murthal and start earning high returns today.
          </p>
        </div>
        <div className="flex flex-wrap gap-4 justify-center">
          <a href="mailto:sumittravel1122@gmail.com" className="px-6 py-3.5 bg-primary text-black font-black uppercase text-[10px] tracking-widest rounded-xl hover:bg-white transition-all shadow-lg shadow-primary/10">
            Email Us
          </a>
          <a href="tel:7988269193" className="px-6 py-3.5 bg-white/5 border border-white/10 text-white font-black uppercase text-[10px] tracking-widest rounded-xl hover:bg-white/10 transition-all">
            Call Concierge
          </a>
        </div>
      </div>
    </motion.div>
  )
}

export default AboutUs
