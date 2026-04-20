import React, { useState, useEffect } from 'react'
import { useAppContext } from '../context/AppContext'
import toast from 'react-hot-toast'
import { assets } from '../assets/assets'

const Profile = () => {
    const { userData, setUserData, axios, setToken, navigate } = useAppContext()
    const [isEditing, setIsEditing] = useState(false)
    const [loading, setLoading] = useState(false)
    
    // Form state
    const [name, setName] = useState('')
    const [mobile, setMobile] = useState('')
    const [drivingLicense, setDrivingLicense] = useState('')
    const [image, setImage] = useState(null)
    const [preview, setPreview] = useState(null)

    useEffect(() => {
        if (userData) {
            setName(userData.name || '')
            setMobile(userData.mobile || '')
            setDrivingLicense(userData.drivingLicense || '')
            setPreview(userData.image || null)
        }
    }, [userData])

    const handleImageChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            setImage(file)
            setPreview(URL.createObjectURL(file))
        }
    }

    const handleUpdate = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
            const formData = new FormData()
            formData.append('name', name)
            formData.append('mobile', mobile)
            formData.append('drivingLicense', drivingLicense)
            if (image) formData.append('image', image)

            const { data } = await axios.post('/api/user/update-profile', formData)
            if (data.success) {
                toast.success(data.message)
                setUserData({ ...userData, ...data.user })
                setIsEditing(false)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        } finally {
            setLoading(false)
        }
    }

    const handleDeleteAccount = async () => {
        if (window.confirm("ARE YOU ABSOLUTELY SURE? This will permanently delete your account and all associated data. This action cannot be undone.")) {
            try {
                const { data } = await axios.delete('/api/user/delete-account')
                if (data.success) {
                    toast.success(data.message)
                    setToken('')
                    localStorage.removeItem('token')
                    navigate('/')
                } else {
                    toast.error(data.message)
                }
            } catch (error) {
                toast.error(error.message)
            }
        }
    }

    if (!userData) return null

    return (
        <div className='min-h-screen pt-24 pb-20 px-6 bg-[#050505]'>
            <div className='max-w-4xl mx-auto'>
                
                {/* Header Section */}
                <div className='flex flex-col md:flex-row items-center gap-10 mb-12 bg-white/[0.02] border border-white/5 p-10 rounded-[3rem] backdrop-blur-xl'>
                    <div className='relative group'>
                        <div className='w-40 h-40 rounded-[2.5rem] overflow-hidden border-4 border-primary/20 bg-[#111] flex items-center justify-center'>
                            {preview ? (
                                <img src={preview} alt="Profile" className='w-full h-full object-cover' />
                            ) : (
                                <span className='text-6xl font-black text-primary'>{name.charAt(0)}</span>
                            )}
                        </div>
                        {isEditing && (
                            <label className='absolute bottom-2 right-2 w-10 h-10 bg-primary rounded-full flex items-center justify-center cursor-pointer hover:scale-110 transition-transform shadow-lg shadow-primary/20'>
                                <img src={assets.upload_icon} alt="" className='w-4 invert' />
                                <input type="file" hidden accept="image/*" onChange={handleImageChange} />
                            </label>
                        )}
                    </div>
                    
                    <div className='text-center md:text-left flex-1'>
                        <h1 className='text-4xl font-black text-white uppercase tracking-tighter mb-2'>{name}</h1>
                        <p className='text-gray-500 uppercase tracking-widest text-xs font-bold mb-6'>{userData.email}</p>
                        <div className='flex flex-wrap gap-3 justify-center md:justify-start'>
                            <span className='px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-[10px] text-primary font-black uppercase tracking-widest'>
                                {userData.role}
                            </span>
                            <span className='px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] text-gray-400 font-black uppercase tracking-widest'>
                                Member since {new Date(userData.createdAt).getFullYear()}
                            </span>
                        </div>
                    </div>
                    
                    {!isEditing && (
                        <button 
                            onClick={() => setIsEditing(true)}
                            className='px-8 py-3 rounded-2xl bg-white/5 border border-white/10 text-xs font-bold uppercase tracking-widest text-white hover:border-primary transition-all'
                        >
                            Edit Profile
                        </button>
                    )}
                </div>

                <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
                    
                    {/* Main Settings */}
                    <div className='md:col-span-2'>
                        <div className='bg-white/[0.02] border border-white/5 rounded-[2.5rem] p-10'>
                            <h2 className='text-xl font-black text-white uppercase tracking-widest mb-8 flex items-center gap-3'>
                                <span className='w-2 h-6 bg-primary rounded-full'></span>
                                Personal Information
                            </h2>

                            <form onSubmit={handleUpdate} className='space-y-6'>
                                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                                    <div>
                                        <label className='block text-[10px] uppercase tracking-[0.2em] text-gray-500 font-black mb-3'>Full Name</label>
                                        <input 
                                            type="text" 
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            disabled={!isEditing}
                                            className='w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-4 text-sm text-white focus:outline-none focus:border-primary/50 transition-all disabled:opacity-50'
                                        />
                                    </div>
                                    <div>
                                        <label className='block text-[10px] uppercase tracking-[0.2em] text-gray-500 font-black mb-3'>Mobile Number</label>
                                        <input 
                                            type="tel" 
                                            value={mobile}
                                            onChange={(e) => setMobile(e.target.value)}
                                            disabled={!isEditing}
                                            className='w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-4 text-sm text-white focus:outline-none focus:border-primary/50 transition-all disabled:opacity-50'
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className='block text-[10px] uppercase tracking-[0.2em] text-gray-500 font-black mb-3'>Driving License Number</label>
                                    <input 
                                        type="text" 
                                        value={drivingLicense}
                                        onChange={(e) => setDrivingLicense(e.target.value)}
                                        disabled={!isEditing}
                                        className='w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-4 text-sm text-white focus:outline-none focus:border-primary/50 transition-all disabled:opacity-50'
                                    />
                                </div>

                                {isEditing && (
                                    <div className='flex gap-4 pt-4'>
                                        <button 
                                            type="submit" 
                                            disabled={loading}
                                            className='flex-1 py-4 bg-primary text-black font-black uppercase tracking-widest rounded-2xl hover:bg-white transition-all shadow-xl shadow-primary/10'
                                        >
                                            {loading ? 'Saving...' : 'Save Changes'}
                                        </button>
                                        <button 
                                            type="button" 
                                            onClick={() => {
                                                setIsEditing(false);
                                                setName(userData.name);
                                                setMobile(userData.mobile);
                                                setDrivingLicense(userData.drivingLicense);
                                                setPreview(userData.image);
                                            }}
                                            className='px-8 py-4 bg-white/5 border border-white/10 text-white font-black uppercase tracking-widest rounded-2xl hover:bg-white/10 transition-all'
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                )}
                            </form>
                        </div>
                    </div>

                    {/* Side Actions Area */}
                    <div className='flex flex-col gap-8'>
                        
                        {/* Request Listing Portal */}
                        <div className='bg-primary/[0.02] border border-primary/10 rounded-[2.5rem] p-10'>
                            <h2 className='text-lg font-black text-primary uppercase tracking-widest mb-4'>Earn with RentLux</h2>
                            <p className='text-xs text-gray-500 leading-relaxed mb-8 text-neutral-400'>
                                Have a luxury car you'd like to list? Partner with us and start earning high-premium returns today.
                            </p>
                            <button 
                                onClick={() => { navigate('/owner/add-car'); window.scrollTo(0,0); }}
                                className='w-full py-4 bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-primary hover:text-black transition-all shadow-lg shadow-primary/5'
                            >
                                Request Car Listing
                            </button>
                        </div>

                        {/* Danger Zone */}
                        <div className='bg-red-500/[0.02] border border-red-500/10 rounded-[2.5rem] p-10'>
                            <h2 className='text-lg font-black text-red-500 uppercase tracking-widest mb-4'>Danger Zone</h2>
                            <p className='text-xs text-gray-500 leading-relaxed mb-8'>
                                Once you delete your account, there is no going back. Please be certain.
                            </p>
                            <button 
                                onClick={handleDeleteAccount}
                                className='w-full py-4 border border-red-500/20 text-red-500 text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-red-500 hover:text-white transition-all'
                            >
                                Delete Account
                            </button>
                        </div>
                    </div>

                </div>

            </div>
        </div>
    )
}

export default Profile
