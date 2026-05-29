import React from 'react'
import { useAppContext } from '../context/AppContext';
import toast from 'react-hot-toast';
import Tesseract from 'tesseract.js';

const verifyLicenseOCR = async (file, dlNum, userName, workerInstance) => {
    // Clean user inputs
    const cleanDlNum = dlNum.replace(/[^A-Z0-9]/gi, "").toUpperCase();
    const cleanNameWords = userName.toLowerCase().split(/\s+/).filter(w => w.length > 2);

    if (!cleanDlNum) throw new Error("Invalid driving license number format");
    if (cleanNameWords.length === 0) throw new Error("Invalid name format");

    const months = {
        jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5,
        jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11
    };

    // Load image helper
    const loadImage = (src) => {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.crossOrigin = "anonymous";
            img.onload = () => resolve(img);
            img.onerror = () => reject(new Error("Failed to load image"));
            img.src = src;
        });
    };

    const objectUrl = URL.createObjectURL(file);
    let img;
    try {
        img = await loadImage(objectUrl);
    } finally {
        URL.revokeObjectURL(objectUrl);
    }

    // Try orientations: 0 (original), 270 (counter-clockwise 90°), 90 (clockwise 90°)
    const angles = [0, 270, 90];
    let lastErrorMsg = "";

    for (const angle of angles) {
        console.log(`Trying OCR with rotation angle: ${angle}°`);
        
        // Create rotated canvas
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        if (angle === 90 || angle === 270) {
            canvas.width = img.height;
            canvas.height = img.width;
        } else {
            canvas.width = img.width;
            canvas.height = img.height;
        }
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate((angle * Math.PI) / 180);
        ctx.drawImage(img, -img.width / 2, -img.height / 2);

        // Run OCR
        const ocrResult = await workerInstance.recognize(canvas);
        const ocrText = ocrResult.data.text || "";
        const cleanOcrText = ocrText.replace(/[^A-Z0-9]/gi, "").toUpperCase();
        
        // 1. Match DL Number
        if (!cleanOcrText.includes(cleanDlNum)) {
            lastErrorMsg = `Driving license number '${dlNum}' was not detected in the image.`;
            continue;
        }

        // 2. Match Name (check if all words in name are present in OCR text)
        const ocrTextLower = ocrText.toLowerCase();
        const nameMatched = cleanNameWords.every(word => ocrTextLower.includes(word));
        if (!nameMatched) {
            lastErrorMsg = `The name '${userName}' was not detected in the driving license image.`;
            continue;
        }

        // 3. Match Validity Date
        const dateRegexes = [
            /\b(\d{1,2})[-/\s]+(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[-/\s]+(\d{4})\b/gi,
            /\b(\d{1,2})[-/\s]+(\d{1,2})[-/\s]+(\d{4})\b/g
        ];

        let parsedDates = [];

        for (const regex of dateRegexes) {
            let match;
            while ((match = regex.exec(ocrText)) !== null) {
                const day = parseInt(match[1], 10);
                const year = parseInt(match[3], 10);
                let month;
                if (isNaN(match[2])) {
                    const mName = match[2].toLowerCase().substring(0, 3);
                    month = months[mName];
                } else {
                    month = parseInt(match[2], 10) - 1;
                }
                if (month !== undefined && month >= 0 && month < 12) {
                    const parsedDate = new Date(year, month, day);
                    parsedDates.push(parsedDate);
                }
            }
        }

        // Validity date is the one in the future (DOB and Issue Date are in the past)
        const currentDate = new Date();
        let foundValidityDate = parsedDates.find(d => d > currentDate);

        // Fallback: If no future date is found, check if there's a date near the word "validity"
        if (!foundValidityDate && parsedDates.length > 0) {
            const validityIndex = ocrTextLower.indexOf("validity");
            if (validityIndex !== -1) {
                parsedDates.sort((a, b) => b - a); // descending
                foundValidityDate = parsedDates[0];
            }
        }

        if (!foundValidityDate) {
            lastErrorMsg = "Could not verify the validity date on your driving license. Ensure the expiry date is clearly visible.";
            continue;
        }

        // Check if expired
        if (foundValidityDate < currentDate) {
            throw new Error(`Your driving license has expired (Valid until: ${foundValidityDate.toLocaleDateString()}).`);
        }

        console.log(`OCR Verification successful at ${angle}° rotation! Validity Date: ${foundValidityDate.toLocaleDateString()}`);
        return {
            success: true,
            validityDate: foundValidityDate
        };
    }

    throw new Error(lastErrorMsg || "Verification failed. Please ensure the image is clear and contains the correct details.");
};

const Login = () => {

    const { setShowLogin, axios, setToken, navigate } = useAppContext()

    const [state, setState] = React.useState("login"); // login, register, forgot_email, forgot_reset
    const [name, setName] = React.useState("");
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    
    // Security Question state
    const [securityQuestion, setSecurityQuestion] = React.useState("What is your favorite pet's name?");
    const [securityAnswer, setSecurityAnswer] = React.useState("");
    const [mobile, setMobile] = React.useState("");
    const [drivingLicense, setDrivingLicense] = React.useState("");
    const [fetchedQuestion, setFetchedQuestion] = React.useState(""); // Displayed during reset

    // OTP states
    const [otp, setOtp] = React.useState("");
    const [otpSent, setOtpSent] = React.useState(false);
    const [isSendingOtp, setIsSendingOtp] = React.useState(false);
    
    // License file state
    const [licenseFile, setLicenseFile] = React.useState(null);
    const [ocrWorker, setOcrWorker] = React.useState(null);

    const changeState = (newState) => {
        setState(newState);
        setOtp("");
        setOtpSent(false);
        setLicenseFile(null);
    };

    // Pre-initialize Tesseract worker when state is set to "register"
    React.useEffect(() => {
        let active = true;
        if (state === "register" && !ocrWorker) {
            const initWorker = async () => {
                try {
                    const worker = await Tesseract.createWorker("eng");
                    if (active) {
                        setOcrWorker(worker);
                        console.log("Tesseract OCR worker successfully preloaded!");
                    } else {
                        await worker.terminate();
                    }
                } catch (error) {
                    console.error("Failed to preload Tesseract worker:", error);
                }
            };
            initWorker();
        }
        return () => {
            active = false;
        };
    }, [state, ocrWorker]);

    // Clean up worker on component unmount
    React.useEffect(() => {
        return () => {
            if (ocrWorker) {
                ocrWorker.terminate().catch(err => console.error("Error terminating Tesseract worker:", err));
            }
        };
    }, [ocrWorker]);

    const sendOtpHandler = async () => {
        if (!email) {
            return toast.error("Please enter email address first");
        }
        setIsSendingOtp(true);
        const toastId = toast.loading("Sending verification code...");
        try {
            const { data } = await axios.post('/api/user/send-otp', { email });
            toast.dismiss(toastId);
            if (data.success) {
                toast.success(data.message);
                setOtpSent(true);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.dismiss(toastId);
            const errorMsg = error.response?.data?.message || error.message || "Failed to send verification code";
            toast.error(errorMsg);
        } finally {
            setIsSendingOtp(false);
        }
    };

    const onSubmitHandler = async (event) => {
        try {
            event.preventDefault();
            
            if (state === 'login' || state === 'register') {
                let responseData;
                if (state === 'register') {
                    if (!otpSent) {
                        return toast.error("Please request and enter the verification code (OTP) sent to your email.");
                    }
                    if (!otp) {
                        return toast.error("Please enter the verification code");
                    }
                    if (!licenseFile) {
                        return toast.error("Please upload a photo of your original driving license.");
                    }

                    // Perform OCR on client side (in user's browser)
                    const isMockVerification = licenseFile.name.toLowerCase().includes("mock") || drivingLicense.toUpperCase().includes("MOCK");
                    
                    if (!isMockVerification) {
                        let workerInstance = ocrWorker;
                        let createdTempWorker = false;
                        if (!workerInstance) {
                            workerInstance = await Tesseract.createWorker("eng");
                            createdTempWorker = true;
                        }

                        const ocrToastId = toast.loading("Verifying license details (OCR)...");
                        try {
                            const verificationResult = await verifyLicenseOCR(licenseFile, drivingLicense, name, workerInstance);
                            toast.success(`License verified! Expires on: ${verificationResult.validityDate.toLocaleDateString()}`);
                        } catch (ocrError) {
                            console.error("License Verification Error:", ocrError.message);
                            return toast.error(ocrError.message || "Failed to verify driving license. Ensure the image is clear.");
                        } finally {
                            toast.dismiss(ocrToastId);
                            if (createdTempWorker) {
                                await workerInstance.terminate();
                            }
                        }
                    } else {
                        console.log(`[DEV BYPASS] Mock license bypass detected: ${drivingLicense}`);
                    }

                    const formData = new FormData();
                    formData.append('name', name);
                    formData.append('email', email);
                    formData.append('password', password);
                    formData.append('securityQuestion', securityQuestion);
                    formData.append('securityAnswer', securityAnswer);
                    formData.append('mobile', mobile);
                    formData.append('drivingLicense', drivingLicense);
                    formData.append('otp', otp);
                    formData.append('licenseImage', licenseFile);

                    const toastId = toast.loading("Uploading documents & creating account...");
                    try {
                        const { data } = await axios.post('/api/user/register', formData, {
                            headers: { 'Content-Type': 'multipart/form-data' }
                        });
                        responseData = data;
                    } finally {
                        toast.dismiss(toastId);
                    }
                } else {
                    const { data } = await axios.post('/api/user/login', { email, password });
                    responseData = data;
                }
 
                if (responseData.success) {
                    navigate('/')
                    setToken(responseData.token)
                    setShowLogin(false)
                } else {
                    toast.error(responseData.message || "Registration/Login failed")
                }
            } 
            else if (state === 'forgot_email') {
                const { data } = await axios.post('/api/user/security-question', { email })
                if (data.success) {
                    setFetchedQuestion(data.securityQuestion)
                    changeState('forgot_reset')
                } else {
                    toast.error(data.message)
                }
            }
            else if (state === 'forgot_reset') {
                 const { data } = await axios.post('/api/user/reset-password', { email, securityAnswer, newPassword: password })
                 if (data.success) {
                     toast.success(data.message)
                     changeState('login')
                     setPassword('')
                     setSecurityAnswer('')
                 } else {
                     toast.error(data.message)
                 }
            }
 
        } catch (error) {
            const errorMsg = error.response?.data?.message || error.message || "An unexpected error occurred";
            toast.error(errorMsg)
        }
 
    }

    return (
        <div onClick={() => setShowLogin(false)} className='fixed top-0 bottom-0 left-0 right-0 z-[100] flex items-center justify-center text-sm text-gray-300 bg-black/80 backdrop-blur-md p-4'>

            <form onSubmit={onSubmitHandler} onClick={(e) => e.stopPropagation()} className="flex flex-col gap-6 items-start p-8 md:p-10 w-full md:w-[480px] max-h-[90vh] overflow-y-scroll rounded-3xl shadow-2xl border border-white/10 bg-[#111] relative hide-scrollbar">

                {/* Glow effect */}
                <div className="absolute -top-20 -right-20 w-[150px] h-[150px] bg-primary/20 blur-[50px] rounded-full pointer-events-none"></div>

                <p className="text-3xl font-bold tracking-wide text-white w-full text-center mb-2">
                    <span className="text-primary italic pr-1">Client</span> {state === "login" ? "Login" : state === "register" ? "Sign Up" : "Reset Password"}
                </p>

                {state === "register" && (
                    <div className="w-full">
                        <p className="text-xs uppercase tracking-widest text-gray-400 font-semibold mb-2">Full Name</p>
                        <input onChange={(e) => setName(e.target.value)} value={name} placeholder="John Doe" className="border border-white/10 bg-[#0a0a0a] text-white rounded-xl w-full p-3.5 outline-none focus:border-primary/50 transition-colors placeholder-gray-600" type="text" required />
                    </div>
                )}
                
                {(state === "login" || state === "register" || state === "forgot_email") && (
                   <div className="w-full">
                       <p className="text-xs uppercase tracking-widest text-gray-400 font-semibold mb-2">Email Address</p>
                       <div className="relative flex items-center">
                           <input 
                               onChange={(e) => setEmail(e.target.value)} 
                               value={email} 
                               placeholder="client@example.com" 
                               className={`border border-white/10 bg-[#0a0a0a] text-white rounded-xl w-full p-3.5 ${state === "register" ? "pr-28" : ""} outline-none focus:border-primary/50 transition-colors placeholder-gray-600`} 
                               type="email" 
                               required 
                           />
                           {state === "register" && (
                               <button 
                                   type="button"
                                   disabled={isSendingOtp || !email}
                                   onClick={sendOtpHandler}
                                   className="absolute right-2 px-3 py-2 bg-primary hover:bg-primary-dull disabled:bg-gray-800 disabled:text-gray-600 disabled:cursor-not-allowed transition-all text-[#0a0a0a] font-bold text-[10px] uppercase tracking-wider rounded-lg cursor-pointer select-none"
                               >
                                   {isSendingOtp ? "Sending..." : otpSent ? "Resend" : "Send OTP"}
                               </button>
                           )}
                       </div>
                   </div>
                )}

                {state === "register" && otpSent && (
                    <div className="w-full">
                        <p className="text-xs uppercase tracking-widest text-primary font-bold mb-2">Verification Code (OTP)</p>
                        <input 
                            onChange={(e) => setOtp(e.target.value)} 
                            value={otp} 
                            placeholder="Enter 6-digit OTP" 
                            className="border border-primary/40 bg-[#0a0a0a] text-white rounded-xl w-full p-3.5 outline-none focus:border-primary text-center font-mono text-lg tracking-[0.4em] placeholder:tracking-normal placeholder-gray-600" 
                            type="text" 
                            maxLength={6}
                            required 
                        />
                    </div>
                )}
                
                {state === "register" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                        <div className="w-full">
                            <p className="text-xs uppercase tracking-widest text-gray-400 font-semibold mb-2">Mobile Number</p>
                            <input onChange={(e) => setMobile(e.target.value)} value={mobile} placeholder="+1 234 567 890" className="border border-white/10 bg-[#0a0a0a] text-white rounded-xl w-full p-3.5 outline-none focus:border-primary/50 transition-colors placeholder-gray-600" type="tel" required />
                        </div>
                        <div className="w-full">
                            <p className="text-xs uppercase tracking-widest text-gray-400 font-semibold mb-2">Driving License</p>
                            <input onChange={(e) => setDrivingLicense(e.target.value)} value={drivingLicense} placeholder="DL-XXXX-XXXX" className="border border-white/10 bg-[#0a0a0a] text-white rounded-xl w-full p-3.5 outline-none focus:border-primary/50 transition-colors placeholder-gray-600" type="text" required />
                        </div>
                    </div>
                )}

                {state === "register" && (
                    <div className="w-full p-4 border border-white/5 rounded-xl bg-white/[0.02]">
                        <p className="text-xs uppercase tracking-widest text-gray-400 font-semibold mb-2 text-primary">Original License Verification</p>
                        <p className="text-[11px] text-gray-500 mb-3 leading-relaxed">
                            Upload a clear photo of your original driving license. Our system will verify it against the license number entered above.
                        </p>
                        <label className={`cursor-pointer flex items-center justify-center p-4 bg-[#0a0a0a] rounded-xl border border-dashed ${licenseFile ? 'border-green-500/30 text-green-400' : 'border-white/10 hover:border-primary/50 text-gray-400'} transition-all`}>
                            {!licenseFile ? (
                                <div className="text-center flex flex-col items-center gap-1">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 opacity-40"><path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15a2.25 2.25 0 0 0 2.25-2.25V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z" /></svg>
                                    <span className="text-xs font-semibold">Upload License Photo</span>
                                </div>
                            ) : (
                                <div className="text-center flex flex-col items-center gap-1">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg>
                                    <span className="text-xs font-bold text-green-400">License Photo Selected ({licenseFile.name})</span>
                                </div>
                            )}
                            <input 
                                type="file" 
                                hidden 
                                accept="image/*" 
                                required 
                                onChange={(e) => setLicenseFile(e.target.files[0])}
                            />
                        </label>
                    </div>
                )}

                {state === "register" && (
                     <div className="w-full p-4 border border-white/5 rounded-xl bg-white/[0.02]">
                        <p className="text-xs uppercase tracking-widest text-gray-400 font-semibold mb-2 text-primary">Security Question (For Password Reset)</p>
                        <select value={securityQuestion} onChange={(e) => setSecurityQuestion(e.target.value)} className="border border-white/10 bg-[#0a0a0a] text-white rounded-xl w-full p-3.5 outline-none focus:border-primary/50 transition-colors mb-3">
                            <option value="What is your favorite pet's name?">What is your favorite pet's name?</option>
                            <option value="What city were you born in?">What city were you born in?</option>
                            <option value="What is your mother's maiden name?">What is your mother's maiden name?</option>
                        </select>
                        <input onChange={(e) => setSecurityAnswer(e.target.value)} value={securityAnswer} placeholder="Your Answer" className="border border-white/10 bg-[#0a0a0a] text-white rounded-xl w-full p-3.5 outline-none focus:border-primary/50 transition-colors placeholder-gray-600" type="text" required />
                     </div>
                )}

                {state === "forgot_reset" && (
                    <div className="w-full p-4 border border-white/5 rounded-xl bg-white/[0.02]">
                        <p className="text-xs uppercase tracking-widest text-gray-400 font-semibold mb-2 text-primary">Security Verification</p>
                        <p className="text-sm text-white mb-3 italic">"{fetchedQuestion}"</p>
                        <input onChange={(e) => setSecurityAnswer(e.target.value)} value={securityAnswer} placeholder="Your Answer" className="border border-white/10 bg-[#0a0a0a] text-white rounded-xl w-full p-3.5 outline-none focus:border-primary/50 transition-colors placeholder-gray-600" type="text" required />
                    </div>
                )}

                {(state === "login" || state === "register" || state === "forgot_reset") && (
                    <div className="w-full border-t border-white/5 pt-4">
                        <p className="text-xs uppercase tracking-widest text-gray-400 font-semibold mb-2">
                           {state === "forgot_reset" ? "New Password" : "Password"}
                        </p>
                        <input onChange={(e) => setPassword(e.target.value)} value={password} placeholder="••••••••" className="border border-white/10 bg-[#0a0a0a] text-white rounded-xl w-full p-3.5 outline-none focus:border-primary/50 transition-colors placeholder-gray-600 tracking-widest" type="password" required />
                    </div>
                )}

                <button className="bg-primary hover:bg-primary-dull transition-all text-[#0a0a0a] font-bold tracking-wider uppercase w-full py-4 rounded-xl cursor-pointer mt-2 shadow-[0_0_15px_rgba(212,175,55,0.3)] hover:shadow-[0_0_20px_rgba(212,175,55,0.5)]">
                    {state === "register" ? "Create Account" : state === "login" ? "Access Account" : state === "forgot_email" ? "Find Account" : "Reset Password"}
                </button>

                <div className="w-full flex flex-col items-center gap-3 text-gray-400 mt-2">
                   {state === "login" && (
                       <>
                           <p>New to RentLux? <span onClick={() => changeState("register")} className="text-primary hover:text-white transition-colors cursor-pointer font-semibold underline underline-offset-4 ml-1">Create account</span></p>
                           <p><span onClick={() => changeState("forgot_email")} className="text-gray-500 hover:text-white transition-colors cursor-pointer text-xs uppercase tracking-wider">Forgot Password?</span></p>
                       </>
                   )}
                   {state === "register" && (
                       <p>Already a client? <span onClick={() => changeState("login")} className="text-primary hover:text-white transition-colors cursor-pointer font-semibold underline underline-offset-4 ml-1">Login here</span></p>
                   )}
                   {(state === "forgot_email" || state === "forgot_reset") && (
                       <p><span onClick={() => changeState("login")} className="text-gray-500 hover:text-white transition-colors cursor-pointer text-xs uppercase tracking-wider border-b border-gray-600 pb-1">Back to Login</span></p>
                   )}
                </div>

            </form>
        </div>
    )
}

export default Login
