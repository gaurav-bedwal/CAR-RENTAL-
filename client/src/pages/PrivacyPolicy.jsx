import React from 'react'
import { motion } from 'motion/react'

const PrivacyPolicy = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className='px-6 md:px-16 lg:px-24 xl:px-32 py-12 md:py-20 bg-[#0B0D17] min-h-screen text-gray-300 max-w-7xl mx-auto'
    >
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-black text-white uppercase tracking-tight mb-3">Privacy Policy</h1>
        <p className="text-xs text-gray-500 uppercase tracking-widest font-semibold mb-12">Last Updated: May 2026</p>

        <div className="space-y-8 text-sm leading-relaxed text-gray-400 font-light">
          <section>
            <h2 className="text-lg font-bold text-white mb-3">1. Information We Collect</h2>
            <p>
              We collect personal data necessary to provide a secure and customized luxury rental service. This includes your name, email address, mobile number, driving license details, and billing details. If you list a vehicle, we collect vehicle details and mandatory verification documents (RC, PUC, and Insurance policies).
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-3">2. How We Use Your Information</h2>
            <p>
              Your information is utilized to verify driver eligibility, manage bookings, facilitate payments, and connect active renters with owners. We also track session data to protect user accounts and prevent concurrent logins on unauthorized devices.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-3">3. Data Sharing & Security</h2>
            <p>
              We do not sell your personal data. We utilize secure hosting environments and encrypted database services to protect your credentials and driving documents. Financial transactions are processed securely through verified payment gateways, and we do not store raw card numbers.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-3">4. Cookies & Session Tracking</h2>
            <p>
              We use local storage tokens to maintain user sessions across page refreshes. These tokens are saved securely on your device and are cleared upon explicit logout or authentication expiry.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-3">5. User Control & Data Deletion</h2>
            <p>
              You have the right to access, edit, or permanently delete your account details through your Profile panel. Deleting your account will completely purge your profile data from our databases, provided you do not have any pending or active reservations.
            </p>
          </section>

          <section className="pt-6 border-t border-white/5">
            <h2 className="text-lg font-bold text-white mb-3">6. Privacy Concierge</h2>
            <p>
              For privacy concerns or to request a full backup of your platform records, contact us at:
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

export default PrivacyPolicy
