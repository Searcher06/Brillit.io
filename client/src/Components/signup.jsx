import { toast } from 'react-toastify'
import 'react-toastify/ReactToastify.css'
import { FcGoogle } from 'react-icons/fc'
import { useState } from 'react'
import { User, Mail, Lock, Eye, EyeOff } from 'lucide-react'
import { Link } from 'react-router-dom'
import axios from 'axios'

const SignUp = () => {
    const [show, setShow] = useState(false)
    const [fullName, setFullName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const disapledStyle = !fullName || !password || !email || password.length < 6 ? 'bg-pink-200' : null

    const handleSubmit = async (e) => {
        e.preventDefault()

        // checking all the fields
        if (!fullName || !email || !password) {
            toast.error("Please add all fields")
            return
        }

        // checking the password length
        if (password.length < 6) {
            toast.error("Password must be greater than 5 characters")
            return
        }

        // checking the fullname length
        if (fullName.length < 5) {
            toast.error("Name must be greater than 4 characters")
            return;
        }

        //  Simple email regex validator
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email)) {
            toast.error("Please enter a valid email address")
            return;
        }

        try {
            const response = await axios.post("http://localhost:8000/api/v1/users/sign-up", {
                username: fullName,
                password,
                email,
            })

            // saving the token and user info
            localStorage.setItem('BrillitUser', JSON.stringify(response.data))

            toast.success("Account created successfully")
            console.log(response)
            setEmail('')
            setPassword('')
            setFullName('')
        } catch (error) {
            if (error.response) {
                // server responded with a non-2xx status
                toast.error(error.response.data.message || 'Sign up failed')
            } else if (error.request) {
                toast.error("No response from server")
            }
            else {
                // something else happended
                toast.error("An error occured.")
            }
            console.error(error)
        }
    }
    return <>
        <div className="w-full h-lvh flex justify-center items-center">
            <form onSubmit={(e) => {
                e.preventDefault()
            }}
                className="w-90 h-120  shadow-xl rounded-lg flex flex-col items-center text-center border border-gray-200">
                <h2 className="text-3xl text-blue-700 font-semibold mt-4">Brillit.io</h2>
                <p className=" text-xl mt-2 font-semibold w-80">Join Brillit and level up your study game</p>
                <button className="mt-3 h-11 w-65 border-gray-200 border-[1.9px] rounded-[8px] flex items-center justify-center">
                    <FcGoogle size={20} className='mr-3' />
                    <span className="font-semibold text-[15px]">Sign Up with Google</span>
                </button>
                <div className='flex mt-1 gap-2 items-center'>
                    <hr className='h-[1px] bg-gray-500 border-0 w-28' />
                    <p className='text-[13px] text-gray-800'>OR</p>
                    <hr className='h-[1px] bg-gray-500 border-0 w-28' />
                </div>
                <div className='mt-3 h-11 w-65 border-gray-200 border-[1.9px] rounded-[8px] flex items-center'>
                    <User size={20} className='ml-4' />
                    <input className='outline-0 pl-2 text-sm' placeholder='Full Name' onChange={(event) => {
                        setFullName(event.target.value)
                    }}
                        value={fullName}
                    />
                </div>
                <div className='mt-3 h-11 w-65 border-gray-200 border-[1.9px] rounded-[8px] flex items-center'>
                    <Mail size={20} className='ml-4' />
                    <input className='outline-0 pl-2 text-sm w-full' placeholder='Email' onChange={(event) => {
                        setEmail(event.target.value)
                    }}
                        value={email}
                    />
                </div>
                <div className='mt-3 h-11 w-65 border-gray-200 border-[1.9px] rounded-[8px] flex items-center'>
                    <Lock size={20} className='ml-4' />
                    <input type={`${show ? 'text' : 'password'}`} className='outline-0 pl-2 text-sm' placeholder='Password' onChange={(event) => {
                        setPassword(event.target.value)
                    }}
                        value={password}
                    />
                    {show ? <Eye size={17} className='ml-5' onClick={() => {
                        setShow((prevState) => !prevState)
                    }} /> : <EyeOff size={17} className='ml-5' onClick={() => {
                        setShow((prevState) => !prevState)
                    }} />}
                </div>
                <button
                    className={`cursor-pointer h-11 w-65 bg-blue-700 rounded-[8px] mt-5 text-white text-[15px] ${disapledStyle}`}
                    disabled={!fullName || !password || !email || password.length < 6 ? true : false}
                    onClick={handleSubmit}
                >
                    Create Account
                </button>
                <p className='text-[14px] mt-2'>Already have an account ? <Link to={'/login'} className='text-blue-700'>Login</Link></p>
            </form>
        </div>
    </>
}

export default SignUp 