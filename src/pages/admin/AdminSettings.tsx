import React, { useState } from "react";
import { Settings, Save, User, Lock } from "lucide-react";
import { useAuthStore } from "../../stores/authStore";
import { apiClient } from "../../lib/api";

const AdminSettings: React.FC = () => {
  const { user } = useAuthStore();
  const [passwordForm, setPasswordForm] = useState({
    current_password: "",
    new_password: "",
    confirm: "",
  });
  const [pwLoading, setPwLoading] = useState(false);
  const [pwError, setPwError] = useState("");
  const [pwSuccess, setPwSuccess] = useState(false);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwError("");
    if (passwordForm.new_password !== passwordForm.confirm) {
      setPwError("New passwords do not match.");
      return;
    }
    if (passwordForm.new_password.length < 8) {
      setPwError("Password must be at least 8 characters.");
      return;
    }
    setPwLoading(true);
    try {
      // Backend endpoint: POST /users/change-password
      await apiClient.post("/users/change-password", {
        current_password: passwordForm.current_password,
        new_password: passwordForm.new_password,
      });
      setPwSuccess(true);
      setPasswordForm({ current_password: "", new_password: "", confirm: "" });
      setTimeout(() => setPwSuccess(false), 3000);
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { detail?: string } } };
      setPwError(
        axiosErr.response?.data?.detail || "Failed to change password."
      );
    } finally {
      setPwLoading(false);
    }
  };

  const inputCls =
    "w-full px-3 py-2.5 bg-white border border-[#dde3f0] rounded-lg text-sm text-[#0a1628] focus:outline-none focus:border-[#2952a3] focus:ring-2 focus:ring-[#2952a3]/20 transition-all placeholder:text-[#6b7a9e]";

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-black text-[#0a1628] mb-1">Settings</h1>
        <p className="text-[#6b7a9e] text-sm">
          Manage your account and preferences
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Profile info */}
        <div className="bg-white rounded-2xl border border-[#dde3f0] p-6">
          <div className="flex items-center gap-3 mb-5 pb-4 border-b border-[#f0f3f9]">
            <div className="w-9 h-9 rounded-xl bg-[#f0f3f9] flex items-center justify-center">
              <User size={18} className="text-[#2952a3]" />
            </div>
            <h2 className="text-base font-bold text-[#0a1628]">
              Profile Information
            </h2>
          </div>
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 bg-[#f8fafc] rounded-xl">
              <div className="w-14 h-14 rounded-full bg-[#2952a3] flex items-center justify-center text-white text-xl font-black">
                {user?.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <div className="font-bold text-[#0a1628]">{user?.name}</div>
                <div className="text-sm text-[#6b7a9e]">{user?.email}</div>
                <div className="text-xs text-[#2952a3] font-semibold capitalize mt-0.5">
                  {user?.role}
                </div>
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-[#6b7a9e] uppercase tracking-wider mb-1.5 block">
                Full Name
              </label>
              <input
                type="text"
                defaultValue={user?.name}
                className={inputCls}
                readOnly
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-[#6b7a9e] uppercase tracking-wider mb-1.5 block">
                Email Address
              </label>
              <input
                type="email"
                defaultValue={user?.email}
                className={inputCls}
                readOnly
              />
            </div>
          </div>
        </div>

        {/* Change password */}
        <div className="bg-white rounded-2xl border border-[#dde3f0] p-6">
          <div className="flex items-center gap-3 mb-5 pb-4 border-b border-[#f0f3f9]">
            <div className="w-9 h-9 rounded-xl bg-[#f0f3f9] flex items-center justify-center">
              <Lock size={18} className="text-[#2952a3]" />
            </div>
            <h2 className="text-base font-bold text-[#0a1628]">
              Change Password
            </h2>
          </div>
          <form onSubmit={handlePasswordChange} className="space-y-4">
            {pwError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {pwError}
              </div>
            )}
            {pwSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-700 text-sm">
                Password changed successfully!
              </div>
            )}
            <div>
              <label className="text-xs font-semibold text-[#6b7a9e] uppercase tracking-wider mb-1.5 block">
                Current Password
              </label>
              <input
                type="password"
                value={passwordForm.current_password}
                onChange={(e) =>
                  setPasswordForm((p) => ({
                    ...p,
                    current_password: e.target.value,
                  }))
                }
                required
                className={inputCls}
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-[#6b7a9e] uppercase tracking-wider mb-1.5 block">
                New Password
              </label>
              <input
                type="password"
                value={passwordForm.new_password}
                onChange={(e) =>
                  setPasswordForm((p) => ({
                    ...p,
                    new_password: e.target.value,
                  }))
                }
                required
                className={inputCls}
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-[#6b7a9e] uppercase tracking-wider mb-1.5 block">
                Confirm New Password
              </label>
              <input
                type="password"
                value={passwordForm.confirm}
                onChange={(e) =>
                  setPasswordForm((p) => ({ ...p, confirm: e.target.value }))
                }
                required
                className={inputCls}
              />
            </div>
            <button
              type="submit"
              disabled={pwLoading}
              className="flex items-center gap-2 px-5 py-2.5 bg-[#152b55] text-white text-sm font-semibold rounded-lg hover:bg-[#0f2040] transition-colors disabled:opacity-60"
            >
              <Save size={15} />
              {pwLoading ? "Saving..." : "Update Password"}
            </button>
          </form>
        </div>

        {/* API Configuration */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-[#dde3f0] p-6">
          <div className="flex items-center gap-3 mb-5 pb-4 border-b border-[#f0f3f9]">
            <div className="w-9 h-9 rounded-xl bg-[#f0f3f9] flex items-center justify-center">
              <Settings size={18} className="text-[#2952a3]" />
            </div>
            <h2 className="text-base font-bold text-[#0a1628]">
              API Configuration
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-[#6b7a9e] uppercase tracking-wider mb-1.5 block">
                API Base URL
              </label>
              <input
                type="text"
                defaultValue={import.meta.env.VITE_API_URL || "http://localhost:8000"}
                readOnly
                className={inputCls + " bg-[#f8fafc]"}
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-[#6b7a9e] uppercase tracking-wider mb-1.5 block">
                Cloudinary Cloud Name
              </label>
              <input
                type="text"
                defaultValue={import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || "Not configured"}
                readOnly
                className={inputCls + " bg-[#f8fafc]"}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
