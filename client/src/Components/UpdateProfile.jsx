import profile from '../assets/user.png'
import { Lock, User } from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '../Context/authContext'
const UpdateProfile = () => {
    const [data, setData] = useState({
        firstName: '',
        lastName: '',
        oldPassword: '',
        newPassword: '',
        photo: '',
    })
    const [preview, setPreview] = useState(null)
    const { user } = useAuth()
    console.log(data)
    return (
        <div className="w-full h-lvh flex justify-center items-center">
            <form onSubmit={(e) => e.preventDefault()}
                className="w-90 h-130 rounded-2xl shadow-2xl flex flex-col items-center text-center"
            >
                <h2 className="text-3xl text-blue-700 font-semibold mt-3">Update Profile</h2>
                <div className="rounded-full w-19 h-19 flex justify-center items-center mt-4">
                    <img src={preview ? preview : profile} className="w-full" />
                </div>

                {/* <button className="mt-4 border-[1.6px] rounded-sm border-gray-300 pl-4 pr-4 pt-1 pb-1 font-semibold cursor-pointer active:bg-gray-100">
                    Upload new photo
                </button> */}

                <label>
                    <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        id="photo-upload"
                        onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                                const file = e.target.files[0]
                                setData((prevState) => ({
                                    ...prevState,
                                    photo: file
                                }))
                                const reader = new FileReader()
                                reader.onloadend = () => {
                                    setPreview(reader.result)
                                }
                                reader.readAsDataURL(file)
                            }
                        }}
                    />
                    <label
                        htmlFor="photo-upload"
                        className="mt-4 border-[1.6px] rounded-sm border-gray-300 pl-4 pr-4 pt-1 pb-1 font-semibold cursor-pointer active:bg-gray-100 inline-block"
                    >
                        Upload new photo
                    </label>
                </label>

                <div className='mt-3 h-11 w-65 border-gray-200 border-[1.9px] rounded-[8px] flex items-center'>
                    <User size={20} className='ml-4' />
                    <input className='outline-0 pl-2 text-sm w-full' placeholder={user ? user.firstName : 'Firstname'}
                        type='text'
                        value={data.firstName}
                        onChange={(event) => {
                            setData((prevState) => ({
                                ...prevState,
                                firstName: event.target.value
                            }))
                        }}
                    />
                </div>

                <div className='mt-3 h-11 w-65 border-gray-200 border-[1.9px] rounded-[8px] flex items-center'>
                    <User size={20} className='ml-4' />
                    <input className='outline-0 pl-2 text-sm w-full' placeholder={user ? user.lastName : 'Lastname'}
                        type='text'
                        value={data.lastName}
                        onChange={(event) => {
                            setData((prevState) => ({
                                ...prevState,
                                lastName: event.target.value
                            }))
                        }}
                    />
                </div>

                <div className='mt-3 h-11 w-65 border-gray-200 border-[1.9px] rounded-[8px] flex items-center'>
                    <Lock size={20} className='ml-4' />
                    <input className='outline-0 pl-2 text-sm w-full' placeholder='Old Password'
                        type='password'
                        value={data.oldPassword}
                        onChange={(event) => {
                            setData((prevState) => ({
                                ...prevState,
                                oldPassword: event.target.value
                            }))
                        }}
                    />
                </div>

                <div className='mt-3 h-11 w-65 border-gray-200 border-[1.9px] rounded-[8px] flex items-center'>
                    <Lock size={20} className='ml-4' />
                    <input className='outline-0 pl-2 text-sm w-full' placeholder='New Password'
                        type='password'
                        value={data.newPassword}
                        onChange={(event) => {
                            setData((prevState) => ({
                                ...prevState,
                                newPassword: event.target.value
                            }))
                        }}
                    />
                </div>

                <button className={`cursor-pointer h-11 w-65 bg-blue-700 rounded-[8px] mt-5 text-white text-[15px]`}>
                    Save changes
                </button>
                <p className="text-[13px] mt-1">Type in the field you intend to change else leave blank</p>
            </form>
        </div>
    )
}

export default UpdateProfile