import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppContext } from '../context/AppContext'
import toast from 'react-hot-toast'

const FeedbackPopup = () => {
    const { user, token, axios } = useAppContext()
    const [isVisible, setIsVisible] = useState(false)
    const [rating, setRating] = useState(0)
    const [hoveredRating, setHoveredRating] = useState(0)
    const [message, setMessage] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        if (!user || !token) return;

        const checkEligibility = async () => {
            // 1. Check timestamp locally first to save API calls
            const lastPrompt = user.lastFeedbackPromptedAt;
            if (lastPrompt) {
                const daysSince = (new Date() - new Date(lastPrompt)) / (1000 * 60 * 60 * 24);
                if (daysSince < 7) return; // Not been 7 days yet
            }

            // 2. We only want to ask them if they've ACTUALLY booked a car before
            try {
                const { data } = await axios.get('/api/bookings/my-bookings')
                if (data.success && data.bookings.length > 0) {
                    // They have bookings and haven't been asked in 7 days!
                    setIsVisible(true)
                } else if (data.success && data.bookings.length === 0) {
                    // If they have no bookings, let's just mark the timestamp so we don't spam checks?
                    // Actually, if they haven't booked, we just do nothing and keep checking silently until they do.
                }
            } catch (err) {
                console.log("Feedback eligibility check failed", err)
            }
        }

        // Delay popup by 5 seconds so it feels organic and doesn't block initial interaction
        const timer = setTimeout(checkEligibility, 5000)
        return () => clearTimeout(timer)
    }, [user, token, axios])

    const handleSkip = async () => {
        setIsVisible(false)
        try {
            await axios.post('/api/user/skip-feedback')
             // user.lastFeedbackPromptedAt is updated on backend.
             // It will take effect cleanly upon next refresh/login.
        } catch (err) {
            console.log(err)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (rating === 0) return toast.error("Please select a star rating")
        if (!message) return toast.error("Please tell us your thoughts")

        setIsLoading(true)
        try {
            const { data } = await axios.post('/api/user/submit-feedback', { rating, message, tags: ['System Prompt'] })
            if (data.success) {
                toast.success(data.message)
                setIsVisible(false)
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
        <AnimatePresence>
            {isVisible && (
                <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="glass-panel w-full max-w-lg bg-[#0B0D17] border border-white/10 rounded-3xl p-8 relative shadow-2xl"
                    >
                        <button onClick={handleSkip} className="absolute top-6 right-6 text-gray-500 hover:text-white transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                            </svg>
                        </button>

                        <div className="text-center mb-6">
                            <h2 className="text-2xl font-black text-white tracking-widest uppercase mb-2">How was your Experience?</h2>
                            <p className="text-gray-400 text-sm font-light">We constantly strive for perfection. Your feedback directly shapes our luxury fleet.</p>
                        </div>

                        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                            
                            <div className="flex items-center justify-center gap-2">
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
                                            className={`w-10 h-10 ${star <= (hoveredRating || rating) ? 'text-primary fill-primary drop-shadow-[0_0_8px_rgba(212,175,55,0.6)]' : 'text-gray-600'}`} 
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

                            <textarea 
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="Tell us about the vehicle condition, the booking process, or our support staff..."
                                className="w-full bg-[#141824] border border-white/10 rounded-xl max-h-40 min-h-32 p-4 text-white text-sm outline-none focus:border-primary/50 transition-colors resize-none"
                            ></textarea>

                            <button 
                                disabled={isLoading}
                                type="submit" 
                                className="w-full py-4 bg-primary text-[#0a0a0a] font-black uppercase tracking-widest text-sm rounded-xl cursor-pointer hover:bg-primary-dull transition-all disabled:opacity-50"
                            >
                                {isLoading ? "Submitting..." : "Submit Review"}
                            </button>
                        </form>

                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    )
}

export default FeedbackPopup
