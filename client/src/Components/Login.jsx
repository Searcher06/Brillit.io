import { FcGoogle } from 'react-icons/fc'
import { useState } from 'react'
import { Mail, Lock, Eye, EyeOff } from 'lucide-react'
import { Link } from 'react-router-dom'
const Login = () => {
    const [show, setShow] = useState(false)
    return (
        <div className="w-full h-lvh flex justify-center items-center">
            <form className="w-90 h-120  shadow-xl rounded-lg flex flex-col items-center text-center border border-gray-200">
                <h2 className="text-3xl text-blue-700 font-semibold mt-4">Brillit.io</h2>
                <p className=" text-xl mt-2 font-semibold w-80">Welcome back to Brillit</p>
                <button className="cursor-pointer mt-4 h-11 w-65 border-gray-200 border-[1.9px] rounded-[8px] flex items-center justify-center">
                    <FcGoogle size={20} className='mr-3' />
                    <span className="font-semibold text-[15px]">Sign In with Google</span>
                </button>
                <div className='flex mt-3 gap-2 items-center'>
                    <hr className='h-[1px] bg-gray-500 border-0 w-28' />
                    <p className='text-[13px] text-gray-800'>OR</p>
                    <hr className='h-[1px] bg-gray-500 border-0 w-28' />
                </div>

                <div className='mt-3 h-11 w-65 border-gray-200 border-[1.9px] rounded-[8px] flex items-center'>
                    <Mail size={20} className='ml-4' />
                    <input className='outline-0 pl-2 text-sm w-full' placeholder='Email' />
                </div>
                <div className='mt-3 h-11 w-65 border-gray-200 border-[1.9px] rounded-[8px] flex items-center'>
                    <Lock size={20} className='ml-4' />
                    <input type={`${show ? 'text' : 'password'}`} className='outline-0 pl-2 text-sm' placeholder='Password' />
                    {show ? <Eye size={17} className='ml-5' onClick={() => {
                        setShow((prevState) => !prevState)
                    }} /> : <EyeOff size={17} className='ml-5' onClick={() => {
                        setShow((prevState) => !prevState)
                    }} />}
                </div>
                <button className='cursor-pointer h-11 w-65 bg-blue-700 rounded-[8px] mt-5 text-white text-[15px]'>
                    Create Account
                </button>
                <p className='text-[14px] mt-5'>{`Don't have an account`} ? <Link to={'/signup'} className='text-blue-700'>Sign Up</Link></p>
            </form>
        </div>
    )
}

export default Login