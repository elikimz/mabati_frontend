import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Lock, Mail, ArrowRight } from "lucide-react";
import { authApi } from "../lib/api";
import { useAuthStore } from "../stores/authStore";

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const tokens = await authApi.login(email, password);
      localStorage.setItem("access_token", tokens.access_token);
      localStorage.setItem("refresh_token", tokens.refresh_token);
      const user = await authApi.me();
      setAuth(user, tokens.access_token, tokens.refresh_token);
      if (user.role === "admin" || user.role === "staff") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { detail?: string } } };
      setError(
        axiosErr.response?.data?.detail ||
          "Invalid email or password. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#0a1628] relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1200&q=80&auto=format&fit=crop)",
          }}
        />
        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#2952a3] to-[#152b55] flex items-center justify-center">
              <span className="text-white font-black text-lg">M</span>
            </div>
            <div>
              <span className="text-white font-bold text-lg leading-none block">
                Mabati
              </span>
              <span className="text-[#6b7a9e] text-xs font-medium tracking-widest uppercase">
                Roofing
              </span>
            </div>
          </Link>

          <div>
            <h2 className="text-4xl font-black text-white mb-4">
              Welcome back to
              <br />
              <span className="text-gradient-gold">Mabati Roofing</span>
            </h2>
            <p className="text-[#6b7a9e] text-lg leading-relaxed">
              Kenya's premier roofing materials supplier. Sign in to manage your
              orders and access our full catalogue.
            </p>
          </div>

          <div className="flex gap-6">
            {[
              { value: "500+", label: "Products" },
              { value: "10K+", label: "Customers" },
              { value: "47", label: "Counties" },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="text-2xl font-black text-white">{stat.value}</div>
                <div className="text-[#6b7a9e] text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <Link to="/" className="flex items-center gap-3 mb-8 lg:hidden">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#2952a3] to-[#152b55] flex items-center justify-center">
              <span className="text-white font-black">M</span>
            </div>
            <span className="font-bold text-[#0a1628] text-lg">
              Mabati Roofing
            </span>
          </Link>

          <div className="mb-8">
            <h1 className="text-3xl font-black text-[#0a1628] mb-2">
              Sign In
            </h1>
            <p className="text-[#6b7a9e]">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="text-[#2952a3] font-semibold hover:text-[#152b55]"
              >
                Create one
              </Link>
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-sm font-medium text-[#0a1628] mb-1.5 block">
                Email Address
              </label>
              <div className="relative">
                <Mail
                  size={17}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6b7a9e]"
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="w-full pl-11 pr-4 py-3 bg-white border border-[#dde3f0] rounded-xl text-sm text-[#0a1628] placeholder:text-[#6b7a9e] focus:outline-none focus:border-[#2952a3] focus:ring-2 focus:ring-[#2952a3]/20 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-[#0a1628] mb-1.5 block">
                Password
              </label>
              <div className="relative">
                <Lock
                  size={17}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6b7a9e]"
                />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Your password"
                  required
                  className="w-full pl-11 pr-12 py-3 bg-white border border-[#dde3f0] rounded-xl text-sm text-[#0a1628] placeholder:text-[#6b7a9e] focus:outline-none focus:border-[#2952a3] focus:ring-2 focus:ring-[#2952a3]/20 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#6b7a9e] hover:text-[#0a1628]"
                >
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3.5 bg-[#152b55] text-white font-bold rounded-xl hover:bg-[#0f2040] transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <svg
                  className="animate-spin h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
              ) : (
                <>
                  Sign In
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-xs text-[#6b7a9e]">
            By signing in, you agree to our{" "}
            <span className="text-[#2952a3]">Terms of Service</span> and{" "}
            <span className="text-[#2952a3]">Privacy Policy</span>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
