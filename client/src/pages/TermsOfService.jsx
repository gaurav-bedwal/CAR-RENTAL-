import React from 'react'
import { motion } from 'motion/react'

const TermsOfService = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className='px-6 md:px-16 lg:px-24 xl:px-32 py-12 md:py-20 bg-[#0B0D17] min-h-screen text-gray-300 max-w-7xl mx-auto'
    >
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-black text-white uppercase tracking-tight mb-3">Terms of Service</h1>
        <p className="text-xs text-gray-500 uppercase tracking-widest font-semibold mb-12">Last Updated: May 2026</p>

        <div className="space-y-8 text-sm leading-relaxed text-gray-400 font-light">
          <section>
            <h2 className="text-lg font-bold text-white mb-3">1. Agreement to Terms</h2>
            <p>
              Welcome to RentLux. These Terms of Service constitute a legally binding agreement between you and RentLux (administered by Sumit Travels). By accessing our website, web application, or listing a vehicle, you agree to comply with and be bound by these Terms.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-3">2. User Eligibility & Driver Verification</h2>
            <p>
              To rent a vehicle, you must possess a valid driving license (DL) and complete the registry verification process. You agree to provide accurate registration information and keep your credentials confidential. You are solely responsible for all activities under your account.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-3">3. Rental Packages & Scheduling</h2>
            <p>
              We offer flexible daily and hourly rental terms. Hourly bookings require a strict minimum duration of 6 hours. Additional packages are available for 8 hours and 12 hours. Any extension beyond the selected booking period must be approved prior to the rental expiry.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-3">4. Owner Listing Compliance</h2>
            <p>
              Vehicle owners listing their luxury assets must upload valid documentation, including the Registration Certificate (RC), active insurance policies, and a valid PUC certificate. Vehicles must meet fitness compliance criteria and are subject to administrative review before deployment.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-3">5. Fees, Security Deposits & Refunds</h2>
            <p>
              Rental fees are charged based on daily or hourly rates. A refundable security deposit is collected upon booking and is fully refunded within 48 hours of vehicle return, provided the vehicle is returned in original condition with no violations or damage.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-3">6. Governing Law & Dispute Resolution</h2>
            <p>
              These terms are governed by and construed in accordance with the laws of India. Any disputes arising out of your use of our platform shall be referred to the exclusive jurisdiction of the courts in Sonipat, Haryana.
            </p>
          </section>

          <section className="pt-6 border-t border-white/5">
            <h2 className="text-lg font-bold text-white mb-3">7. Contact Information</h2>
            <p>
              If you have any queries regarding these Terms, please contact us at:
            </p>
            <ul className="mt-3 space-y-1 text-xs uppercase tracking-wider text-gray-500 font-medium">
              <li>Sumit Travels</li>
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

export default TermsOfService
