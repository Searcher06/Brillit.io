const SignUp = () => {
    return <div className="w-full h-lvh flex justify-center items-center">
        <form className="w-90 h-120  shadow-xl rounded-lg flex flex-col items-center text-center border border-gray-200">
            <h2 className="text-3xl text-blue-700 font-semibold mt-4">Brillit.io</h2>
            <p className=" text-xl mt-2 font-semibold w-80">Join Brillit and level up your study game</p>
            <button className="mt-3 h-11 w-70 border-gray-200 border-2 rounded-[8px]">
                <span className="font-semibold text-[16px]">Sign Up with Google</span>
            </button>
        </form>
    </div>
}

export default SignUp 