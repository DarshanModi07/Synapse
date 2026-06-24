import { useState } from "react";
import api from "@/api/axios";
import { useNavigate, Link } from "react-router-dom";

export const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const validateForm = () => {
    if (!formData.email.trim()) {
      return "Email is required";
    }

    if (!formData.password) {
      return "Password is required";
    }

    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await api.post(
        "/auth/login",
        formData
      );

      localStorage.setItem(
        "accessToken",
        response.data.accessToken
      );

      navigate("/dashboard");
    } catch (error) {
      setError(
        error.response?.data?.message ||
        "Login Failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#08070F] text-white">
      <div className="mx-auto flex min-h-screen max-w-7xl items-center px-6">

        {/* LEFT SECTION */}
        <div className="hidden flex-1 lg:flex">
          <div className="max-w-lg">
            <p className="mb-3 text-sm font-medium text-violet-400">
              Welcome Back
            </p>

            <h1 className="mb-6 text-6xl font-bold">
              Synapse
            </h1>

            <p className="text-lg leading-relaxed text-zinc-400">
              Continue managing your teams, projects,
              departments and workflows from a single
              workspace.
            </p>
          </div>
        </div>

        {/* RIGHT SECTION */}
        <div className="flex flex-1 justify-center">
          <div className="w-full max-w-md">
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-8">

              <h2 className="mb-2 text-3xl font-bold">
                Sign In
              </h2>

              <p className="mb-8 text-zinc-400">
                Access your Synapse workspace.
              </p>

              <form
                onSubmit={handleSubmit}
                className="space-y-5"
              >
                <div>
                  <label className="mb-2 block text-sm text-zinc-400">
                    Email
                  </label>

                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="dev@example.com"
                    className="
                      w-full
                      rounded-xl
                      border
                      border-zinc-700
                      bg-zinc-950
                      px-4
                      py-3
                      text-white
                      outline-none
                      transition
                      focus:border-violet-500
                    "
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm text-zinc-400">
                    Password
                  </label>

                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="
                      w-full
                      rounded-xl
                      border
                      border-zinc-700
                      bg-zinc-950
                      px-4
                      py-3
                      text-white
                      outline-none
                      transition
                      focus:border-violet-500
                    "
                  />
                </div>

                {error && (
                  <p className="text-sm text-red-500">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="
                    w-full
                    rounded-xl
                    bg-violet-600
                    py-3
                    font-medium
                    text-white
                    transition
                    hover:bg-violet-500
                    disabled:opacity-60
                  "
                >
                  {loading
                    ? "Signing In..."
                    : "Sign In"}
                </button>
              </form>

              <p className="mt-6 text-center text-sm text-zinc-400">
                Don't have an account?{" "}
                <Link
                  to="/register"
                  className="text-violet-400 hover:text-violet-300"
                >
                  Create Account
                </Link>
              </p>

            </div>
          </div>
        </div>

      </div>
    </div>
  );
};