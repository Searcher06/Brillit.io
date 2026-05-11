import { Lock, User, Camera, ArrowLeft } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../Context/AuthContext";
import axios from "../utils/axiosConfig";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const UpdateProfile = () => {
  const [data, setData] = useState({
    newFirstName: "", newLastName: "",
    oldPassword: "", newPassword: "", photo: "",
  });
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const { user, setUser, setloading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setloading(true);
    try {
      setLoading(true);
      const formData = new FormData();
      if (data.newFirstName) formData.append("newFirstName", data.newFirstName);
      if (data.newLastName) formData.append("newLastName", data.newLastName);
      if (data.oldPassword) formData.append("oldPassword", data.oldPassword);
      if (data.newPassword) formData.append("newPassword", data.newPassword);
      if (data.photo) formData.append("image", data.photo);

      await axios.put("/api/v1/users/updateProfile", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });

      toast.success("Profile updated successfully");
      const res = await axios.get("/api/v1/users/me", { withCredentials: true });
      setUser(res.data);
      navigate("/");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update profile");
      console.error(error);
    } finally {
      setLoading(false);
      setloading(false);
    }
  };

  const avatarSrc = preview || user?.profilePic || null;
  const initials = user
    ? `${user.firstName?.[0] || ""}${user.lastName?.[0] || ""}`.toUpperCase()
    : "?";

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-12"
      style={{ backgroundColor: "#0a0a0f" }}
    >
      {/* Background glow */}
      <div
        className="fixed top-0 right-0 w-96 h-96 opacity-10 pointer-events-none"
        style={{ background: "radial-gradient(circle, #7c3aed, transparent)" }}
      />

      <div className="relative z-10 w-full max-w-md">
        {/* Back button */}
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-300 transition-colors mb-6 text-sm"
        >
          <ArrowLeft size={16} />
          Back to home
        </button>

        <div className="glass rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-white mb-1">Edit Profile</h2>
          <p className="text-gray-500 text-sm mb-8">Update your personal information</p>

          {/* Avatar */}
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div
                className="w-24 h-24 rounded-full overflow-hidden flex items-center justify-center"
                style={{
                  border: "2px solid rgba(139, 92, 246, 0.4)",
                  background: avatarSrc ? "transparent" : "rgba(139, 92, 246, 0.15)",
                }}
              >
                {avatarSrc ? (
                  <img src={avatarSrc} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-violet-300 text-2xl font-bold">{initials}</span>
                )}
              </div>
              <label
                htmlFor="photo-upload"
                className="absolute bottom-0 right-0 w-8 h-8 rounded-full flex items-center justify-center cursor-pointer transition-all hover:scale-110"
                style={{ background: "linear-gradient(135deg, #7c3aed, #4f46e5)" }}
              >
                <Camera size={14} className="text-white" />
                <input
                  type="file"
                  id="photo-upload"
                  accept="image/*"
                  className="hidden"
                  disabled={loading}
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      setData((p) => ({ ...p, photo: file }));
                      const reader = new FileReader();
                      reader.onloadend = () => setPreview(reader.result);
                      reader.readAsDataURL(file);
                    }
                  }}
                />
              </label>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Name row */}
            <div className="grid grid-cols-2 gap-3">
              <div className="relative">
                <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  className="input-dark w-full h-11 rounded-xl pl-9 pr-3 text-sm"
                  placeholder={user?.firstName || "First name"}
                  value={data.newFirstName}
                  onChange={(e) => setData((p) => ({ ...p, newFirstName: e.target.value }))}
                  disabled={loading}
                />
              </div>
              <div className="relative">
                <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  className="input-dark w-full h-11 rounded-xl pl-9 pr-3 text-sm"
                  placeholder={user?.lastName || "Last name"}
                  value={data.newLastName}
                  onChange={(e) => setData((p) => ({ ...p, newLastName: e.target.value }))}
                  disabled={loading}
                />
              </div>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-3 my-1">
              <hr className="flex-1 border-gray-800" />
              <span className="text-gray-600 text-xs">Change password</span>
              <hr className="flex-1 border-gray-800" />
            </div>

            {/* Passwords */}
            <div className="relative">
              <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                className="input-dark w-full h-11 rounded-xl pl-9 pr-3 text-sm"
                placeholder="Current password"
                type="password"
                value={data.oldPassword}
                onChange={(e) => setData((p) => ({ ...p, oldPassword: e.target.value }))}
                disabled={loading}
              />
            </div>
            <div className="relative">
              <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                className="input-dark w-full h-11 rounded-xl pl-9 pr-3 text-sm"
                placeholder="New password"
                type="password"
                value={data.newPassword}
                onChange={(e) => setData((p) => ({ ...p, newPassword: e.target.value }))}
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-gradient w-full h-11 rounded-xl text-white text-sm font-semibold mt-2"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Saving...
                </span>
              ) : "Save Changes"}
            </button>
          </form>

          <p className="text-gray-600 text-xs text-center mt-4">
            Leave fields blank to keep current values
          </p>
        </div>
      </div>
    </div>
  );
};

export default UpdateProfile;
