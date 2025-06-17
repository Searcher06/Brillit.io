import { User } from "lucide-react"
const UpdateProfile = () => {
    return (
        <div className="w-full h-lvh flex justify-center items-center">
            <form onSubmit={(e) => e.preventDefault()}
                className="w-90 h-120 rounded-2xl shadow-2xl flex flex-col items-center text-center"
            >
                <h2 className="text-3xl text-blue-700 font-semibold mt-4">Update Profile</h2>
                <div>
                    <User />
                </div>
            </form>
        </div>
    )
}

export default UpdateProfile