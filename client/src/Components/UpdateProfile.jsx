import { Lock, User, Camera, Mail, Calendar, PlayCircle, Shield } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../Context/AuthContext";
import axios from "../utils/axiosConfig";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { Navbar } from "./Navbar";
import { Sidebar } from "./Sidebar";
import { useSidebar } from "../Context/SidebarContext";
import { DateTime } from "luxon";

// ── Pure helper ──────────────────────────────────────────────────────────────
export function getProfileErrorMessage(error) {
  if (error?.response?.status === 401) return "Session expired. Please log in again.";
  return error?.response?.data?.message ?? "Failed to update profile";
}

// ── Component ────────────────────────────────────────────────────────────────
const UpdateProfile = () => {
  const [data, setData] = useState({
    newFirstName: "", newLastName: "",
    oldPassword: "", newPassword: "", photo: "",
  });
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const { user, setUser, setloading } = useAuth();
  const { sidebarExpanded } = useSidebar();
  const navigate = useNavigate();

  const sidebarWidth = sidebarExpanded ? 200 : 64;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setloading(true);
    try {
      setLoading(true);
      const formData = new FormData();
      if (data.newFirstName) formData.append("newFirstName", data.newFirstName);
      if (data.newLastName)  formData.append("newLastName",  data.newLastName);
      if (data.oldPassword)  formData.append("oldPassword",  data.oldPassword);
      if (data.newPassword)  formData.append("newPassword",  data.newPassword);
      if (data.photo)        formData.append("image",        data.photo);

      await axios.put("/api/v1/users/updateProfile", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });

      toast.success("Profile updated successfully");
      const res = await axios.get("/api/v1/users/me", { withCredentials: true });
      setUser(res.data);
      navigate("/");
    } catch (error) {
      toast.error(getProfileErrorMessage(error));
      console.error(error);
    } finally {
      setLoading(false);
      setloading(false);
    }
  };

  const avatarSrc = preview || user?.profilePic || null;
  const initials = user
    ? `${user.firstName?.[0] ?? ""}${user.lastName?.[0] ?? ""}`.toUpperCase()
    : "?";

  const joinDate = user?.createdAt
    ? DateTime.fromISO(user.createdAt).toFormat("MMMM yyyy")
    : "—";

  const videosWatched = user?.videosWatched?.length ?? 0;

  return (
    <div className="min-h-screen w-full overflow-x-hidden" style={{ backgroundColor: "var(--bg-primary)" }}>
      <Navbar />
      <Sidebar />

      <main
        className="mt-16 mb-16 sm:mb-0 min-h-[calc(100vh-64px)]"
        style={{
          marginLeft: `${sidebarWidth}px`,
          transition: "margin-left 250ms cubic-bezier(0.4,0,0.2,1)",
        }}
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
          {/* Page header */}
          <div className="mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold" style={{ color: "var(--text-primary)" }}>
              Account Settings
            </h1>
            <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>
              Manage your profile and account preferences
            </p>
          </div>

          {/* Two-column grid */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">

            {/* ── Left: Profile card (2 cols) ── */}
            <div className="md:col-span-2 flex flex-col gap-4">

              {/* Avatar card */}
              <div
                className="rounded-2xl p-6 flex flex-col items-center text-center"
                style={{ backgroundColor: "var(--bg-secondary)", border: "1px solid var(--border-color)" }}
              >
                {/* Avatar */}
                <div className="relative mb-4">
                  <div
                    className="w-24 h-24 rounded-full overflow-hidden flex items-center justify-center ring-2"
                    style={{
                      ringColor: "rgba(139, 92, 246, 0.5)",
                      border: "2px solid rgba(139, 92, 246, 0.5)",
                      background: avatarSrc ? "transparent" : "linear-gradient(135deg, #7c3aed22, #4f46e522)",
                    }}
                  >
                    {avatarSrc ? (
                      <img src={avatarSrc} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-2xl font-bold" style={{ color: "var(--violet-light)" }}>
                        {initials}
                      </span>
                    )}
                  </div>
                  <label
                    htmlFor="photo-upload"
                    className="absolute bottom-0 right-0 w-8 h-8 rounded-full flex items-center justify-center cursor-pointer transition-all hover:scale-110 shadow-lg"
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

                {/* Name */}
                <h2 className="text-lg font-bold" style={{ color: "var(--text-primary)" }}>
                  {user?.firstName} {user?.lastName}
                </h2>
                <p className="text-sm mt-0.5" style={{ color: "var(--text-muted)" }}>
                  {user?.email}
                </p>

                {/* Divider */}
                <div className="w-full my-4" style={{ borderTop: "1px solid var(--border-subtle)" }} />

                {/* Stats */}
                <div className="w-full flex flex-col gap-3">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: "rgba(139, 92, 246, 0.12)" }}
                    >
                      <Mail size={14} style={{ color: "var(--violet-light)" }} />
                    </div>
                    <div className="text-left min-w-0">
                      <p className="text-xs" style={{ color: "var(--text-muted)" }}>Email</p>
                      <p className="text-sm font-medium truncate" style={{ color: "var(--text-primary)" }}>
                        {user?.email}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: "rgba(139, 92, 246, 0.12)" }}
                    >
                      <Calendar size={14} style={{ color: "var(--violet-light)" }} />
                    </div>
                    <div className="text-left">
                      <p className="text-xs" style={{ color: "var(--text-muted)" }}>Member since</p>
                      <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                        {joinDate}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: "rgba(139, 92, 246, 0.12)" }}
                    >
                      <PlayCircle size={14} style={{ color: "var(--violet-light)" }} />
                    </div>
                    <div className="text-left">
                      <p className="text-xs" style={{ color: "var(--text-muted)" }}>Videos watched</p>
                      <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                        {videosWatched}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: "rgba(139, 92, 246, 0.12)" }}
                    >
                      <Shield size={14} style={{ color: "var(--violet-light)" }} />
                    </div>
                    <div className="text-left">
                      <p className="text-xs" style={{ color: "var(--text-muted)" }}>Account status</p>
                      <p className="text-sm font-medium" style={{ color: "#34d399" }}>
                        Active
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ── Right: Edit form (3 cols) ── */}
            <div className="md:col-span-3 flex flex-col gap-4">

              {/* Name section */}
              <div
                className="rounded-2xl p-6"
                style={{ backgroundColor: "var(--bg-secondary)", border: "1px solid var(--border-color)" }}
              >
                <h3 className="text-base font-semibold mb-4" style={{ color: "var(--text-primary)" }}>
                  Personal Information
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--text-muted)" }}>
                      First name
                    </label>
                    <div className="relative">
                      <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--text-muted)" }} />
                      <input
                        className="input-dark w-full h-10 rounded-xl pl-9 pr-3 text-sm"
                        placeholder={user?.firstName || "First name"}
                        value={data.newFirstName}
                        onChange={(e) => setData((p) => ({ ...p, newFirstName: e.target.value }))}
                        disabled={loading}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--text-muted)" }}>
                      Last name
                    </label>
                    <div className="relative">
                      <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--text-muted)" }} />
                      <input
                        className="input-dark w-full h-10 rounded-xl pl-9 pr-3 text-sm"
                        placeholder={user?.lastName || "Last name"}
                        value={data.newLastName}
                        onChange={(e) => setData((p) => ({ ...p, newLastName: e.target.value }))}
                        disabled={loading}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Password section */}
              <div
                className="rounded-2xl p-6"
                style={{ backgroundColor: "var(--bg-secondary)", border: "1px solid var(--border-color)" }}
              >
                <h3 className="text-base font-semibold mb-1" style={{ color: "var(--text-primary)" }}>
                  Change Password
                </h3>
                <p className="text-xs mb-4" style={{ color: "var(--text-muted)" }}>
                  Leave blank to keep your current password
                </p>
                <div className="flex flex-col gap-3">
                  <div>
                    <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--text-muted)" }}>
                      Current password
                    </label>
                    <div className="relative">
                      <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--text-muted)" }} />
                      <input
                        className="input-dark w-full h-10 rounded-xl pl-9 pr-3 text-sm"
                        placeholder="Enter current password"
                        type="password"
                        value={data.oldPassword}
                        onChange={(e) => setData((p) => ({ ...p, oldPassword: e.target.value }))}
                        disabled={loading}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--text-muted)" }}>
                      New password
                    </label>
                    <div className="relative">
                      <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--text-muted)" }} />
                      <input
                        className="input-dark w-full h-10 rounded-xl pl-9 pr-3 text-sm"
                        placeholder="Enter new password (min. 6 characters)"
                        type="password"
                        value={data.newPassword}
                        onChange={(e) => setData((p) => ({ ...p, newPassword: e.target.value }))}
                        disabled={loading}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Save button */}
              <form onSubmit={handleSubmit}>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-gradient w-full h-11 rounded-xl text-sm font-semibold"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Updating your profile...
                    </span>
                  ) : "Save Changes"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default UpdateProfile;
