import { FcGoogle } from 'react-icons/fc'
const SignUp = () => {
    return <div className="w-full h-lvh flex justify-center items-center">
        <form className="w-90 h-120  shadow-xl rounded-lg flex flex-col items-center text-center border border-gray-200">
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
        </form>
    </div>
}

export default SignUp 