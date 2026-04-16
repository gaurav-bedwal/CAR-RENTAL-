import React, { useEffect, useState } from 'react'
import Title from '../../components/owner/Title'
import { useAppContext } from '../../context/AppContext'
import toast from 'react-hot-toast'

const ManageFeedback = () => {
    const { axios, isAdmin } = useAppContext()
    const [feedbacks, setFeedbacks] = useState([])
    const [isLoading, setIsLoading] = useState(true)

    const fetchFeedbacks = async () => {
        try {
            const { data } = await axios.get('/api/owner/feedbacks')
            if (data.success) {
                setFeedbacks(data.feedbacks)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        if (isAdmin) {
            fetchFeedbacks()
        }
    }, [isAdmin])

    if (isLoading) {
         return <div className="flex-1 py-10 flex items-center justify-center text-primary animate-pulse">Loading Feedback Analytics...</div>
    }

    return (
        <div className='flex-1 py-10'>
            <Title title="Customer Feedback" subTitle="Review customer sentiments, ratings, and actionable insights to improve fleet management" />

            <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                 {feedbacks.length === 0 ? (
                     <p className="text-gray-500 italic col-span-full">No customer feedback has been submitted yet.</p>
                 ) : (
                     feedbacks.map((item, index) => (
                         <div key={index} className="p-6 bg-[#141824] border border-white/5 rounded-3xl relative overflow-hidden group hover:border-primary/30 transition-all duration-300 shadow-xl">
                             
                             <div className="flex justify-between items-start mb-4">
                                 <div className="flex items-center gap-3 relative z-10">
                                     {item.user?.image ? (
                                        <img src={item.user.image} alt="User" className="w-10 h-10 rounded-full border border-white/20 object-cover" />
                                     ) : (
                                        <div className="w-10 h-10 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center text-primary font-black uppercase">
                                            {item.user?.name?.charAt(0) || '?'}
                                        </div>
                                     )}
                                     <div>
                                         <p className="text-white font-bold text-sm leading-tight">{item.user?.name || "Unknown Customer"}</p>
                                         <p className="text-[10px] text-gray-500 tracking-widest">{item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'N/A'}</p>
                                     </div>
                                 </div>

                                 <div className="flex items-center bg-[#0a0a0a] px-3 py-1.5 rounded-xl border border-white/10 relative z-10">
                                      <span className="text-primary font-black mr-1">{item.rating}</span>
                                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-primary">
                                         <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z" clipRule="evenodd" />
                                      </svg>
                                 </div>
                             </div>

                             <div className="relative z-10">
                                 <p className="text-gray-300 text-sm leading-relaxed font-light whitespace-pre-wrap">{item.message}</p>
                             </div>

                             {item.tags && item.tags.length > 0 && (
                                 <div className="mt-6 flex flex-wrap gap-2 relative z-10">
                                     {item.tags.map((tag, tIndex) => (
                                         <span key={tIndex} className="px-3 py-1 bg-primary/10 border border-primary/20 text-primary text-[9px] uppercase tracking-widest font-bold rounded-full">
                                            {tag}
                                         </span>
                                     ))}
                                 </div>
                             )}
                         </div>
                     ))
                 )}
            </div>
        </div>
    )
}

export default ManageFeedback
