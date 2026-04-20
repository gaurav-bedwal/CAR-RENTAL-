import React, { useEffect, useState } from 'react'
import { useAppContext } from '../../context/AppContext'
import Title from '../../components/owner/Title'
import toast from 'react-hot-toast'
import { assets } from '../../assets/assets'

const Clients = () => {
    const { axios, currency } = useAppContext()
    const [clients, setClients] = useState([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')
    
    // Modal state for viewing bookings
    const [selectedClient, setSelectedClient] = useState(null)
    const [showModal, setShowModal] = useState(false)

    const fetchClients = async () => {
        try {
            const { data } = await axios.get('/api/owner/clients')
            if (data.success) {
                setClients(data.clients)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchClients()
    }, [])

    const filteredClients = clients.filter(client => 
        client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        client.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (client.mobile && client.mobile.includes(searchQuery))
    )

    const handleViewBookings = (client) => {
        setSelectedClient(client)
        setShowModal(true)
    }

    const handleToggleFreeze = async (userId) => {
        try {
            const { data } = await axios.post('/api/owner/toggle-freeze', { userId })
            if (data.success) {
                toast.success(data.message)
                fetchClients() // Refresh list
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    if (loading) return (
        <div className='flex items-center justify-center min-h-[60vh]'>
            <div className='w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin'></div>
        </div>
    )

    return (
        <div className='px-4 md:px-10 pb-20'>
            <div className='flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10'>
                <Title text1={"SYSTEM"} text2={"CLIENTS"} />
                
                {/* Search Bar */}
                <div className='relative group'>
                    <img src={assets.search_icon} alt="" className='absolute left-4 top-1/2 -translate-y-1/2 w-4 opacity-50' />
                    <input 
                        type="text" 
                        placeholder="Search clients..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className='bg-[#111] border border-white/10 rounded-2xl py-3 pl-12 pr-6 text-sm text-white focus:outline-none focus:border-primary/50 transition-all w-full md:w-80'
                    />
                </div>
            </div>

            {/* Clients Table */}
            <div className='bg-[#0B0D17]/40 backdrop-blur-xl border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl'>
                <div className='overflow-x-auto'>
                    <table className='w-full text-left border-collapse'>
                        <thead>
                            <tr className='bg-white/[0.02] border-b border-white/5'>
                                <th className='px-8 py-6 text-[10px] uppercase tracking-widest text-gray-500 font-bold'>Client Details</th>
                                <th className='px-8 py-6 text-[10px] uppercase tracking-widest text-gray-500 font-bold'>Contact Info</th>
                                <th className='px-8 py-6 text-[10px] uppercase tracking-widest text-gray-500 font-bold'>Status</th>
                                <th className='px-8 py-6 text-[10px] uppercase tracking-widest text-gray-500 font-bold text-center'>Bookings</th>
                                <th className='px-8 py-6 text-[10px] uppercase tracking-widest text-gray-500 font-bold text-right'>Action</th>
                            </tr>
                        </thead>
                        <tbody className='divide-y divide-white/[0.03]'>
                            {filteredClients.map((client, index) => (
                                <tr key={index} className='hover:bg-white/[0.01] transition-colors group'>
                                    <td className='px-8 py-6'>
                                        <div className='flex items-center gap-4'>
                                            <div className='w-12 h-12 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center border border-primary/20 overflow-hidden'>
                                                {client.image ? (
                                                    <img src={client.image} alt="" className='w-full h-full object-cover' />
                                                ) : (
                                                    <span className='text-lg font-bold text-primary'>{client.name.charAt(0)}</span>
                                                )}
                                            </div>
                                            <div>
                                                <p className='text-sm font-bold text-white group-hover:text-primary transition-colors'>{client.name}</p>
                                                <p className='text-[10px] text-gray-500 uppercase tracking-widest mt-1'>ID: {client._id.slice(-6)}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className='px-8 py-6'>
                                        <div className='space-y-1'>
                                            <p className='text-xs text-gray-300'>{client.email}</p>
                                            <p className='text-[11px] text-primary font-medium tracking-wide'>{client.mobile || 'No contact provided'}</p>
                                            {client.drivingLicense && (
                                                <p className='text-[9px] text-gray-500 uppercase tracking-tighter'>License: {client.drivingLicense}</p>
                                            )}
                                        </div>
                                    </td>
                                    <td className='px-8 py-6'>
                                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                                            client.bookingCount > 0 ? 'bg-green-500/10 text-green-500' : 'bg-orange-500/10 text-orange-500'
                                        }`}>
                                            {client.bookingCount > 0 ? 'Active Client' : 'New Prospect'}
                                        </span>
                                    </td>
                                    <td className='px-8 py-6 text-center'>
                                        <div className='inline-flex flex-col items-center'>
                                            <span className='text-lg font-black text-white'>{client.bookingCount}</span>
                                            <span className='text-[8px] uppercase tracking-tighter text-gray-600 font-bold'>Total Rentals</span>
                                        </div>
                                    </td>
                                    <td className='px-8 py-6 text-right flex items-center justify-end gap-3'>
                                        <button 
                                            onClick={() => handleToggleFreeze(client._id)}
                                            className={`px-5 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${
                                                client.isFrozen 
                                                ? 'bg-red-500/10 border border-red-500/20 text-red-500 hover:bg-red-500 hover:text-white' 
                                                : 'bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:border-red-500/50'
                                            }`}
                                        >
                                            {client.isFrozen ? 'Unfreeze' : 'Freeze'}
                                        </button>
                                        <button 
                                            onClick={() => handleViewBookings(client)}
                                            className='px-5 py-2 rounded-xl bg-white/5 border border-white/10 text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-white hover:border-primary/50 hover:bg-primary/5 transition-all'
                                        >
                                            View History
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {filteredClients.length === 0 && (
                    <div className='py-20 text-center border-t border-white/5'>
                        <img src={assets.users_icon} alt="" className='w-12 h-12 mx-auto grayscale opacity-20 mb-4' />
                        <p className='text-gray-500 text-sm italic'>No clients found matching your search.</p>
                    </div>
                )}
            </div>

            {/* Booking History Modal */}
            {showModal && selectedClient && (
                <div className='fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm'>
                    <div className='bg-[#0a0a0a] border border-white/10 rounded-[3rem] w-full max-w-4xl max-h-[85vh] overflow-hidden flex flex-col shadow-2xl'>
                        {/* Modal Header */}
                        <div className='p-8 border-b border-white/5 flex items-center justify-between bg-white/[0.01]'>
                            <div className='flex items-center gap-4'>
                                <div className='w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20'>
                                     <span className='text-2xl font-black text-primary'>{selectedClient.name.charAt(0)}</span>
                                </div>
                                <div>
                                    <h3 className='text-xl font-black text-white uppercase tracking-tight'>{selectedClient.name}'s <span className='text-primary'>History</span></h3>
                                    <p className='text-[10px] text-gray-500 uppercase tracking-widest mt-1'>Registered on {new Date(selectedClient.createdAt).toLocaleDateString()}</p>
                                </div>
                            </div>
                            <button onClick={() => setShowModal(false)} className='w-12 h-12 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/5 transition-colors'>
                                <img src={assets.close_icon} alt="" className='w-4 grayscale invert' />
                            </button>
                        </div>

                        {/* Modal Content */}
                        <div className='flex-1 overflow-y-auto p-8 scrollbar-hide'>
                            {selectedClient.bookings && selectedClient.bookings.length > 0 ? (
                                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                                    {selectedClient.bookings.map((booking, idx) => (
                                        <div key={idx} className='p-5 rounded-3xl bg-white/[0.02] border border-white/5 hover:border-primary/20 transition-all'>
                                            <div className='flex justify-between items-start mb-4'>
                                                <span className={`px-2 py-1 rounded text-[8px] font-black uppercase tracking-tighter ${
                                                    booking.status === 'confirmed' ? 'bg-green-500/20 text-green-400' : 
                                                    booking.status === 'pending' ? 'bg-orange-500/20 text-orange-400' : 'bg-red-500/20 text-red-400'
                                                }`}>
                                                    {booking.status}
                                                </span>
                                                <span className='text-xs font-black text-white'>{currency}{booking.price}</span>
                                            </div>
                                            <h4 className='text-sm font-bold text-white mb-1'>{booking.car?.brand} {booking.car?.model}</h4>
                                            <p className='text-[10px] text-gray-500 uppercase tracking-widest mb-3'>{booking.car?.category}</p>
                                            
                                            <div className='flex items-center justify-between pt-3 border-t border-white/5'>
                                                <div className='text-[9px] uppercase tracking-tighter'>
                                                    <span className='text-gray-600 block mb-1'>Pickup</span>
                                                    <span className='text-gray-300 font-bold'>{new Date(booking.pickupDate).toLocaleDateString()}</span>
                                                </div>
                                                <div className='text-[9px] uppercase tracking-tighter text-right'>
                                                    <span className='text-gray-600 block mb-1'>Return</span>
                                                    <span className='text-gray-300 font-bold'>{new Date(booking.returnDate).toLocaleDateString()}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className='text-center py-20 opacity-30'>
                                    <p className='text-sm font-bold uppercase tracking-[0.2em]'>No Bookings Found</p>
                                </div>
                            )}
                        </div>

                        {/* Modal Footer */}
                        <div className='p-6 border-t border-white/5 bg-white/[0.01] flex justify-center text-[10px] uppercase tracking-widest text-gray-600 font-black'>
                            Luxury Rental Management System v1.0
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Clients
