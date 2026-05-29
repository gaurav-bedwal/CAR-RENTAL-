import React from 'react'
import { motion } from 'motion/react'

const Insurance = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className='px-6 md:px-16 lg:px-24 xl:px-32 py-12 md:py-20 bg-[#0B0D17] min-h-screen text-gray-300 max-w-7xl mx-auto'
    >
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-black text-white uppercase tracking-tight mb-3">Insurance Protection</h1>
        <p className="text-xs text-gray-500 uppercase tracking-widest font-semibold mb-12">White-glove coverages for elite travel</p>

        <div className="space-y-8 text-sm leading-relaxed text-gray-400 font-light">
          <section>
            <h2 className="text-lg font-bold text-white mb-3">1. Comprehensive Damage Protection</h2>
            <p>
              Every active rental booked on RentLux is fully covered by our comprehensive damage waiver protection. This waiver limits your financial liability for any damage to the rented vehicle during the active booking period, subject to standard policy excess and compliance with our driving terms.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-3">2. Collision Damage Waiver (CDW)</h2>
            <p>
              In the event of an accidental collision, the CDW policy protects you from paying the full repair costs of the vehicle. Drivers are only liable up to the pre-authorized security deposit limit, provided they are not driving under the influence or in violation of safety limits.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-3">3. Third-Party Liability Coverage</h2>
            <p>
              RentLux provides active third-party liability insurance covering accidental damage, physical injuries, or losses to third-party properties up to statutory regulations. This protection shields you from legal and financial claims arising from active driving incidents.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-3">4. Owner Asset Shield</h2>
            <p>
              Vehicle owners listing their cars on our platform are covered by our Owner Shield policy. RentLux guarantees coverage for key repairs, mechanical breakdowns due to booking misuse, and complete white-glove security during deployment.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-3">5. Claims & Concierge Roadside Assistance</h2>
            <p>
              In the event of a collision, breakdown, or puncture, please contact our emergency hotline immediately. Do not attempt to repair the vehicle yourself or settle third-party claims without consulting our concierge desk.
            </p>
          </section>

          <section className="pt-6 border-t border-white/5">
            <h2 className="text-lg font-bold text-white mb-3">6. Claims Desk</h2>
            <p>
              For emergency claims, towing, or roadside support, contact us at:
            </p>
            <ul className="mt-3 space-y-1 text-xs uppercase tracking-wider text-gray-500 font-medium">
              <li>Sumit Travels Claims Concierge</li>
              <li>Address: NATHUPUR, SONIPAT, Sonipat, Haryana, 131029</li>
              <li>Phone: 7988269193</li>
              <li>Email: sumittravel1122@gmail.com</li>
            </ul>
          </section>
        </div>
      </div>
    </motion.div>
  )
}

export default Insurance
