import profile from '../assets/user.png'
import { Lock, User } from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '../Context/authContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'

const UpdateProfile = () => {
    const [data, setData] = useState({
        newFirstName: '',
        newLastName: '',
        oldPassword: '',
        newPassword: '',
        photo: '',
    })

    const [preview, setPreview] = useState(null)
    const [enable, setEnable] = useState(true)
    const [loading, setLoading] = useState(false)
    const { user, setUser } = useAuth()
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
            setEnable(false)
            setLoading(true)
            const formData = new FormData()

            if (data.newFirstName) formData.append('newFirstName', data.newFirstName)
            if (data.newLastName) formData.append('newLastName', data.newLastName)
            if (data.oldPassword) formData.append('oldPassword', data.oldPassword)
            if (data.newPassword) formData.append('newPassword', data.newPassword)
            if (data.photo) formData.append('image', data.photo)

            await axios.put('/api/v1/users/updateProfile', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                withCredentials: true
            })
            toast.success("Profile updated successfully")
            const res = await axios.get('/api/v1/users/me', { withCredentials: true });
            setUser(res.data.user)
            navigate('/')
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update profile')
            console.error(error)
        } finally {
            setLoading(false)
            setEnable(true)
        }
    }

    return (
        <div className="w-full h-lvh flex justify-center items-center">
            <form
                onSubmit={handleSubmit}
                className="w-90 h-130 rounded-2xl shadow-2xl flex flex-col items-center text-center"
            >
                <h2 className="text-3xl text-blue-700 font-semibold mt-3">Update Profile</h2>

                <div className="rounded-full w-19 h-19 flex justify-center items-center mt-4">
                    <img src={preview ? preview : profile} className="w-full rounded-full h-[100%]" />
                </div>

                <label>
                    <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        id="photo-upload"
                        onChange={(e) => {
                            const file = e.target.files[0]
                            if (file) {
                                setData(prev => ({ ...prev, photo: file }))
                                const reader = new FileReader()
                                reader.onloadend = () => setPreview(reader.result)
                                reader.readAsDataURL(file)
                            }
                        }}
                        disabled={!enable && true}

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
                    <input
                        className='outline-0 pl-2 text-sm w-full'
                        placeholder={user ? user.firstName : 'Firstname'}
                        type='text'
                        value={data.newFirstName}
                        onChange={(e) => setData(prev => ({ ...prev, newFirstName: e.target.value }))}
                        disabled={!enable && true}

                    />
                </div>

                <div className='mt-3 h-11 w-65 border-gray-200 border-[1.9px] rounded-[8px] flex items-center'>
                    <User size={20} className='ml-4' />
                    <input
                        className='outline-0 pl-2 text-sm w-full'
                        placeholder={user ? user.lastName : 'Lastname'}
                        type='text'
                        value={data.newLastName}
                        onChange={(e) => setData(prev => ({ ...prev, newLastName: e.target.value }))}
                        disabled={!enable && true}

                    />
                </div>

                <div className='mt-3 h-11 w-65 border-gray-200 border-[1.9px] rounded-[8px] flex items-center'>
                    <Lock size={20} className='ml-4' />
                    <input
                        className='outline-0 pl-2 text-sm w-full'
                        placeholder='Old Password'
                        type='password'
                        value={data.oldPassword}
                        onChange={(e) => setData(prev => ({ ...prev, oldPassword: e.target.value }))}

                    />
                </div>

                <div className='mt-3 h-11 w-65 border-gray-200 border-[1.9px] rounded-[8px] flex items-center'>
                    <Lock size={20} className='ml-4' />
                    <input
                        className='outline-0 pl-2 text-sm w-full'
                        placeholder='New Password'
                        type='password'
                        value={data.newPassword}
                        onChange={(e) => setData(prev => ({ ...prev, newPassword: e.target.value }))}
                        disabled={!enable && true}
                    />
                </div>

                <button
                    type="submit"
                    className={`cursor-pointer h-11 w-65 bg-blue-700 rounded-[8px] mt-5 text-white text-[15px] ${!enable && 'bg-blue-200'}`}
                    disabled={!enable && true}
                >
                    {loading ? 'Saving...' : 'Save changes'}
                </button>

                <p className="text-[13px] mt-1">Type in the field you intend to change else leave blank</p>
            </form>
        </div>
    )
}

export default UpdateProfile
// This component allows users to update their profile information including first name, last name, password, and profile photo.
// It uses a form to collect the new data and sends it to the server using an Axios