import React, { useState } from 'react'
import { motion } from 'framer-motion'
import Title from '../components/Title'
import { useAppContext } from '../context/AppContext'
import toast from 'react-hot-toast'

const ProvideFeedback = () => {
    const { axios, user } = useAppContext()
    const [rating, setRating] = useState(0)
    const [hoveredRating, setHoveredRating] = useState(0)
    const [message, setMessage] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        
        if (!user) return toast.error("Please log in to submit feedback.")
        if (rating === 0) return toast.error("Please select a star rating")
        if (!message) return toast.error("Please tell us your thoughts")

        setIsLoading(true)
        try {
            const { data } = await axios.post('/api/user/submit-feedback', { rating, message, tags: ['Manual Submission'] })
            if (data.success) {
                toast.success("Feedback submitted successfully!")
                setRating(0)
                setMessage('')
            } else {
                toast.error(data.message)
            }
        } catch (err) {
            toast.error(err.message)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="bg-[#0a0a0a] min-h-screen text-gray-300 pb-20 pt-28 px-6">
            <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className='max-w-3xl mx-auto flex flex-col items-center'
            >
                <Title title='Your Thoughts' subTitle='Help us refine the apex of luxury rentals by sharing your experience' />

                <div className="w-full mt-10 bg-[#111] border border-white/5 rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden group">
                     {/* Decorative background glow */}
                     <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[100px] rounded-full pointer-events-none group-hover:bg-primary/10 transition-colors duration-700"></div>

                     <form onSubmit={handleSubmit} className="flex flex-col gap-8 relative z-10">
                        
                        <div>
                            <p className="text-[10px] text-primary-dull font-bold uppercase tracking-[0.2em] mb-4 text-center">Rate Your Experience</p>
                            <div className="flex items-center justify-center gap-3">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        type="button"
                                        onMouseEnter={() => setHoveredRating(star)}
                                        onMouseLeave={() => setHoveredRating(0)}
                                        onClick={() => setRating(star)}
                                        className="focus:outline-none transition-transform hover:scale-110"
                                    >
                                        <svg 
                                            xmlns="http://www.w3.org/2000/svg" 
                                            className={`w-12 h-12 md:w-14 md:h-14 ${star <= (hoveredRating || rating) ? 'text-primary fill-primary drop-shadow-[0_0_15px_rgba(212,175,55,0.4)]' : 'text-gray-800'}`} 
                                            fill="none" 
                                            viewBox="0 0 24 24" 
                                            stroke="currentColor" 
                                            strokeWidth={1}
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
                                        </svg>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="flex flex-col gap-2">
                             <label className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em] ml-2">Detailed Feedback</label>
                             <textarea 
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="Describe what you loved, or what we can improve upon..."
                                className="w-full bg-[#0a0a0a]/50 text-white border border-white/10 rounded-2xl min-h-48 p-6 text-sm outline-none focus:border-primary/50 transition-colors resize-none placeholder-gray-600"
                             ></textarea>
                        </div>

                        <button 
                            disabled={isLoading}
                            type="submit" 
                            className="w-full md:w-auto md:ml-auto px-10 py-4 bg-primary text-[#0a0a0a] font-black uppercase tracking-widest text-xs rounded-xl cursor-pointer hover:bg-primary-dull transition-all shadow-[0_0_20px_rgba(212,175,55,0.15)] hover:shadow-[0_0_30px_rgba(212,175,55,0.3)] disabled:opacity-50"
                        >
                            {isLoading ? "Submitting..." : "Submit Review"}
                        </button>
                     </form>
                </div>

            </motion.div>
        </div>
    )
}

export default ProvideFeedback
