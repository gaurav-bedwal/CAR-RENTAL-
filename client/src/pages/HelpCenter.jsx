import React, { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'

const HelpCenter = () => {
  const [activeAccordion, setActiveAccordion] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')

  const faqs = [
    {
      category: "Booking & Rentals",
      question: "What is the minimum rental duration?",
      answer: "For hourly bookings, our minimum package is 6 hours. We also offer 8-hour, 12-hour, and full daily packages."
    },
    {
      category: "Booking & Rentals",
      question: "What documents are required to rent a vehicle?",
      answer: "You must provide a valid driving license (DL-XXXX-XXXX format) and verify your contact details during registration."
    },
    {
      category: "Listing a Car",
      question: "How do I list my luxury car on RentLux?",
      answer: "Go to the 'Request Listing' page, upload your main profile image along with mandatory documents (Registration Certificate (RC), PUC, and Insurance policy), specify your rates, and submit for approval."
    },
    {
      category: "Listing a Car",
      question: "What are the compliance requirements for listed cars?",
      answer: "Every listed car must have a valid original RTO issue date, valid fitness registration, valid PUC certificate, active insurance, and standard features. Listings are reviewed and approved by platform administrators."
    },
    {
      category: "Payments & Refunds",
      question: "Is there a security deposit required?",
      answer: "Yes, security deposits vary by car category (SUV, Sedan, Luxury, Sport) and are fully refundable within 48 hours of vehicle return."
    },
    {
      category: "Insurance & Safety",
      question: "What does your white-glove insurance cover?",
      answer: "All active rentals are covered by our comprehensive damage protection, third-party liability, and roadside collision insurance."
    }
  ]

  const filteredFaqs = faqs.filter(faq => 
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.category.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const toggleAccordion = (index) => {
    setActiveAccordion(activeAccordion === index ? null : index)
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className='px-6 md:px-16 lg:px-24 xl:px-32 py-12 md:py-20 bg-[#0B0D17] min-h-screen text-gray-300 max-w-7xl mx-auto'
    >
      {/* Title */}
      <div className="text-center max-w-2xl mx-auto mb-16">
        <p className="text-xs uppercase tracking-[0.3em] text-primary font-bold mb-3">Support Desk</p>
        <h1 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tight mb-6">Help Center</h1>
        <p className="text-sm text-gray-400">Search our knowledge base or contact our 24/7 concierge service for personalized support.</p>
        
        {/* Search Bar */}
        <div className="mt-8 relative max-w-md mx-auto">
          <input 
            type="text" 
            placeholder="Search FAQs, categories, or keywords..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-6 py-4 text-sm text-white focus:outline-none focus:border-primary/50 transition-all font-medium placeholder-gray-600"
          />
        </div>
      </div>

      {/* Accordion Grid */}
      <div className="max-w-3xl mx-auto space-y-4 mb-20">
        {filteredFaqs.length === 0 ? (
          <div className="text-center py-10 text-gray-500 uppercase tracking-widest text-xs">No matching questions found.</div>
        ) : (
          filteredFaqs.map((faq, idx) => (
            <div key={idx} className="bg-[#141824] border border-white/5 rounded-2xl overflow-hidden transition-all duration-300">
              <button 
                onClick={() => toggleAccordion(idx)}
                className="w-full p-6 text-left flex justify-between items-center gap-4 hover:bg-white/[0.01]"
              >
                <div>
                  <span className="text-[9px] uppercase tracking-widest text-primary font-bold block mb-1.5">{faq.category}</span>
                  <span className="text-white font-bold text-sm md:text-base">{faq.question}</span>
                </div>
                <svg 
                  className={`w-5 h-5 text-gray-500 transition-transform duration-300 ${activeAccordion === idx ? 'rotate-180 text-primary' : ''}`} 
                  fill="none" stroke="currentColor" viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              <AnimatePresence initial={false}>
                {activeAccordion === idx && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="px-6 pb-6 text-xs md:text-sm text-gray-400 border-t border-white/5 pt-4 leading-relaxed font-light">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))
        )}
      </div>

      {/* Concierge Contact Card */}
      <div className="p-8 md:p-12 bg-white/[0.02] border border-white/5 rounded-[2.5rem] relative overflow-hidden text-center max-w-4xl mx-auto">
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/10 blur-[80px] rounded-full pointer-events-none"></div>
        <h2 className="text-2xl font-black text-white uppercase tracking-wider mb-2">Need direct concierge support?</h2>
        <p className="text-xs text-gray-500 max-w-md mx-auto uppercase tracking-wider leading-relaxed mb-8">
          Our team is standing by to assist you. Call us or send an email to resolve any booking issues.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4 items-center">
          <div className="bg-[#141824] border border-white/5 rounded-2xl p-5 w-full sm:max-w-xs text-center">
            <p className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-2">Email Address</p>
            <a href="mailto:sumittravel1122@gmail.com" className="text-sm text-primary font-black hover:text-white transition-colors">sumittravel1122@gmail.com</a>
          </div>
          <div className="bg-[#141824] border border-white/5 rounded-2xl p-5 w-full sm:max-w-xs text-center">
            <p className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-2">Concierge Phone</p>
            <a href="tel:7988269193" className="text-sm text-primary font-black hover:text-white transition-colors">7988269193</a>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default HelpCenter
