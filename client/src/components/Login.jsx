import React from 'react'
import { useAppContext } from '../context/AppContext';
import toast from 'react-hot-toast';

const Login = () => {

    const { setShowLogin, axios, setToken, navigate } = useAppContext()

    const [state, setState] = React.useState("login"); // login, register, forgot_email, forgot_reset
    const [name, setName] = React.useState("");
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    
    // Security Question state
    const [securityQuestion, setSecurityQuestion] = React.useState("What is your favorite pet's name?");
    const [securityAnswer, setSecurityAnswer] = React.useState("");
    const [fetchedQuestion, setFetchedQuestion] = React.useState(""); // Displayed during reset

    const onSubmitHandler = async (event) => {
        try {
            event.preventDefault();
            
            if (state === 'login' || state === 'register') {
                const payload = { name, email, password };
                if (state === 'register') {
                    payload.securityQuestion = securityQuestion;
                    payload.securityAnswer = securityAnswer;
                }
                
                const { data } = await axios.post(`/api/user/${state}`, payload)

                if (data.success) {
                    navigate('/')
                    setToken(data.token)
                    setShowLogin(false)
                } else {
                    toast.error(data.message || "Login failed")
                }
            } 
            else if (state === 'forgot_email') {
                const { data } = await axios.post('/api/user/security-question', { email })
                if (data.success) {
                    setFetchedQuestion(data.securityQuestion)
                    setState('forgot_reset')
                } else {
                    toast.error(data.message)
                }
            }
            else if (state === 'forgot_reset') {
                 const { data } = await axios.post('/api/user/reset-password', { email, securityAnswer, newPassword: password })
                 if (data.success) {
                     toast.success(data.message)
                     setState('login')
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
                       <input onChange={(e) => setEmail(e.target.value)} value={email} placeholder="client@example.com" className="border border-white/10 bg-[#0a0a0a] text-white rounded-xl w-full p-3.5 outline-none focus:border-primary/50 transition-colors placeholder-gray-600" type="email" required />
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
                           <p>New to RentLux? <span onClick={() => setState("register")} className="text-primary hover:text-white transition-colors cursor-pointer font-semibold underline underline-offset-4 ml-1">Create account</span></p>
                           <p><span onClick={() => setState("forgot_email")} className="text-gray-500 hover:text-white transition-colors cursor-pointer text-xs uppercase tracking-wider">Forgot Password?</span></p>
                       </>
                   )}
                   {state === "register" && (
                       <p>Already a client? <span onClick={() => setState("login")} className="text-primary hover:text-white transition-colors cursor-pointer font-semibold underline underline-offset-4 ml-1">Login here</span></p>
                   )}
                   {(state === "forgot_email" || state === "forgot_reset") && (
                       <p><span onClick={() => setState("login")} className="text-gray-500 hover:text-white transition-colors cursor-pointer text-xs uppercase tracking-wider border-b border-gray-600 pb-1">Back to Login</span></p>
                   )}
                </div>

            </form>
        </div>
    )
}

export default Login
