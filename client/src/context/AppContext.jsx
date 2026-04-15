import { createContext, useContext, useEffect, useState } from "react";
import { assets } from "../assets/assets";
import axios from 'axios'
import {toast} from 'react-hot-toast'
import { useNavigate } from "react-router-dom";

// Production-safe Base URL logic
// If VITE_BASE_URL is not set or points to localhost in production, use relative paths
const backendUrl = import.meta.env.VITE_BASE_URL
axios.defaults.baseURL = (import.meta.env.PROD && (!backendUrl || backendUrl.includes('localhost'))) ? '' : backendUrl

export const AppContext = createContext();

export const AppProvider = ({ children })=>{

    const navigate = useNavigate()
    const currency = import.meta.env.VITE_CURRENCY

    const [token, setToken] = useState(sessionStorage.getItem('token') || null)
    const [user, setUser] = useState(null)
    const [isAdmin, setIsAdmin] = useState(false)
    const [showLogin, setShowLogin] = useState(false)
    const [pickupDate, setPickupDate] = useState('')
    const [returnDate, setReturnDate] = useState('')

    const [cars, setCars] = useState([])
    const [isDbConnected, setIsDbConnected] = useState(true)
    const [dbMessage, setDbMessage] = useState('')

    // Function to check if user is logged in
    const fetchUser = async ()=>{
        try {
           setIsDbConnected(true)
           const {data} = await axios.get('/api/user/data')
           if (data.success) {
            setUser(data.user)
            setIsAdmin(data.user.role === 'admin')
           }else{
            navigate('/')
           }
        } catch (error) {
            const errorMsg = error.response?.data?.message || error.message || "User verification failed";
            if (error.response?.status === 503 || errorMsg.toLowerCase().includes('database')) {
                setIsDbConnected(false)
                setDbMessage(errorMsg)
            }
            toast.error(errorMsg)
        }
    }
    // Function to fetch all cars from the server

    const fetchCars = async () =>{
        try {
            setIsDbConnected(true)
            const {data} = await axios.get('/api/user/cars')
            if (data.success) {
                setCars(data.cars)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            const errorMsg = error.response?.data?.message || error.message || "Failed to load cars";
            if (error.response?.status === 503 || errorMsg.toLowerCase().includes('database')) {
                setIsDbConnected(false)
                setDbMessage(errorMsg)
            }
            toast.error(errorMsg)
        }
    }

    const logout = ()=>{
        setToken(null)
        setUser(null)
        setIsAdmin(false)
        axios.defaults.headers.common['Authorization'] = ''
        toast.success('You have been logged out')
    }


    // UseEffect to fetch cars on initial load and clear legacy storage
    useEffect(()=>{
        // SECURITY FIX: Explicitly clear any legacy storage from old versions of the site
        // to ensure "Logout on Refresh" and "Individual Tab Sessions" are enforced.
        localStorage.removeItem('token');
        localStorage.clear(); // Complete wipe of legacy session data
        
        fetchCars()
    },[])

    // Sync token to sessionStorage to allow page refreshing without logging out,
    // while strictly keeping the session isolated to the current tab.
    useEffect(()=>{
        if(token){
            sessionStorage.setItem('token', token)
            axios.defaults.headers.common['Authorization'] = `${token}`
            fetchUser()
        } else {
            sessionStorage.removeItem('token')
            axios.defaults.headers.common['Authorization'] = ''
        }
    },[token])

    const value = {
        navigate, currency, axios, user, setUser,
        token, setToken, isAdmin, setIsAdmin, fetchUser, showLogin, setShowLogin, logout, fetchCars, cars, setCars, 
        pickupDate, setPickupDate, returnDate, setReturnDate, assets,
        isDbConnected, dbMessage
    }

    return (
    <AppContext.Provider value={value}>
        { children }
    </AppContext.Provider>
    )
}

export const useAppContext = ()=>{
    return useContext(AppContext)
}