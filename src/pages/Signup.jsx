import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";

import Button from "../components/Button";
import Input from "../components/Input";
import { registerUser } from "../services/api";

const Signup = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { fullName, email, password, confirmPassword } = formData;

    if (!fullName || !email || !password || !confirmPassword) {
      toast.error("Please fill all fields");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      await registerUser({
        name: fullName,
        email,
        password,
      });

      toast.success("Account created successfully. Please login.");

      navigate("/");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Registration failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#07080d] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(168,85,247,0.18),_transparent_32%),radial-gradient(circle_at_bottom_right,_rgba(139,92,246,0.15),_transparent_28%)]" />

      <div className="absolute left-1/2 top-[-12rem] h-[26rem] w-[26rem] -translate-x-1/2 rounded-full bg-violet-500/12 blur-3xl" />

      <div className="relative mx-auto flex min-h-screen max-w-6xl items-center justify-center px-5 py-10 sm:px-8 lg:px-12">
        <div className="w-full max-w-[30rem]">

          {/* Logo */}
          <div className="mb-8 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-violet-400/40 bg-violet-500/10 text-sm font-semibold tracking-[0.16em] text-violet-200 shadow-[0_0_25px_rgba(168,85,247,0.25)]">
              N
            </div>

            <span className="text-[0.7rem] font-medium tracking-[0.28em] text-violet-200/90 uppercase">
            
            </span>
          </div>

          {/* Heading */}
          <div className="space-y-4">
            <h1 className="text-4xl font-medium tracking-[-0.07em] text-zinc-50 sm:text-5xl md:text-[3.8rem] md:leading-[0.92]">
              Create your account.
            </h1>

            <p className="max-w-md text-base leading-7 text-zinc-300 sm:text-lg">
              Tailored briefings for busy professionals, delivered before your day begins.
            </p>
          </div>

          {/* Signup Form */}
          <form
            onSubmit={handleSubmit}
            className="mt-9 max-w-[24rem] space-y-4"
          >
            <Input
              label="Full Name"
              name="fullName"
              type="text"
              placeholder="Your name"
              value={formData.fullName}
              onChange={handleChange}
            />

            <Input
              label="Email"
              name="email"
              type="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
            />

            {/* Password */}
            <div className="relative">
              <Input
                label="Password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
              />

              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-[2.15rem] text-zinc-400 transition hover:text-white"
              >
                {showPassword ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}
              </button>
            </div>

            {/* Confirm Password */}
            <div className="relative">
              <Input
                label="Confirm Password"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleChange}
              />

              <button
                type="button"
                onClick={() =>
                  setShowConfirmPassword((prev) => !prev)
                }
                className="absolute right-3 top-[2.15rem] text-zinc-400 transition hover:text-white"
              >
                {showConfirmPassword ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}
              </button>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="mt-2 bg-gradient-to-r from-violet-500/80 to-fuchsia-500/80"
            >
              {loading ? "Creating account..." : "Create account"}
            </Button>
          </form>

          {/* Login Link */}
          <p className="mt-6 text-center text-sm text-zinc-300">
            Already have an account?{" "}
            <Link
              to="/"
              className="font-medium text-violet-200 underline-offset-4 transition hover:text-violet-100 hover:underline"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
};

export default Signup;