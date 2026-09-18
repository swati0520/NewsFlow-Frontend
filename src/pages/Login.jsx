import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { GoogleLogin } from "@react-oauth/google";

import Button from "../components/Button";
import { loginUser } from "../services/api";

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const data = await loginUser({
        email,
        password,
      });

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      navigate("/news");
    } catch (error) {
      const message =
        error.response?.data?.message || "Login failed";

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      setError("");
      setLoading(true);

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/auth/google`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            token: credentialResponse.credential,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Google login failed"
        );
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem(
        "user",
        JSON.stringify(data.user)
      );

      navigate("/news");
    } catch (error) {
      setError(error.message || "Google login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#07080d] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(168,85,247,0.18),_transparent_32%),radial-gradient(circle_at_bottom_right,_rgba(139,92,246,0.15),_transparent_28%)]" />

      <div className="relative mx-auto flex min-h-screen max-w-6xl items-center justify-center px-5 py-10 sm:px-8 lg:px-12">
        <div className="w-full max-w-[30rem]">

          {/* Logo */}
          <div className="mb-8 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-violet-400/40 bg-violet-500/10 text-sm font-semibold tracking-[0.16em] text-violet-200">
              N
            </div>

            <span className="text-[0.7rem] font-medium tracking-[0.28em] text-violet-200/90 uppercase">
             
            </span>
          </div>

          {/* Heading */}
          <div className="space-y-4">
            <h1 className="text-4xl font-medium tracking-[-0.07em] text-zinc-50 sm:text-5xl md:text-[4.15rem] md:leading-[0.88]">
              <span className="block">Good morning.</span>

              <span className="mt-1 block bg-gradient-to-r from-violet-100 via-violet-200 to-fuchsia-200 bg-clip-text font-serif italic text-transparent">
                News on go.
              </span>
            </h1>

            <p className="max-w-md text-base leading-7 text-zinc-300 sm:text-lg">
              Personalised audio news for Indian professionals — curated every morning.
            </p>
          </div>

          {/* Login Form */}
          <form
            onSubmit={handleLogin}
            className="mt-9 max-w-[22rem] space-y-4"
          >
            {/* Email */}
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-zinc-500 focus:border-violet-400"
              required
            />

            {/* Password */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 pr-11 text-sm text-white outline-none placeholder:text-zinc-500 focus:border-violet-400"
                required
              />

              <button
                type="button"
                onClick={() =>
                  setShowPassword((prev) => !prev)
                }
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 transition hover:text-white"
                aria-label={
                  showPassword
                    ? "Hide password"
                    : "Show password"
                }
              >
                {showPassword ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}
              </button>
            </div>

            {/* Error */}
            {error && (
              <p className="text-sm text-red-400">
                {error}
              </p>
            )}

            {/* Login Button */}
            <Button type="submit" disabled={loading}>
              {loading ? "Signing in..." : "Sign in"}
            </Button>

            {/* Divider */}
            <div className="flex items-center gap-3 py-2">
              <div className="h-px flex-1 bg-white/10" />

              <span className="text-xs text-zinc-500">
                OR
              </span>

              <div className="h-px flex-1 bg-white/10" />
            </div>

            {/* Google Login */}
            <div className="flex justify-center">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => {
                  setError("Google login failed");
                }}
              />
            </div>

            {/* Terms */}
            <p className="mt-5 text-center text-xs leading-6 text-zinc-400 sm:text-sm">
              By continuing, you agree to our{" "}
              <Link
                to="/signup"
                className="text-violet-200 transition hover:text-violet-100"
              >
                Terms
              </Link>{" "}
              &{" "}
              <Link
                to="/signup"
                className="text-violet-200 transition hover:text-violet-100"
              >
                Privacy
              </Link>
              .
            </p>

            {/* Signup */}
            <p className="mt-8 text-center text-sm text-zinc-300">
              New here?{" "}
              <Link
                to="/signup"
                className="font-medium text-violet-200 underline-offset-4 transition hover:text-violet-100 hover:underline"
              >
                Create account
              </Link>
            </p>
          </form>
        </div>
      </div>
    </main>
  );
};

export default Login;