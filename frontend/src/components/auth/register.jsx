import { useState } from "react";
import api from "@/api/axios";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext.jsx";
import { ArrowLeft } from "lucide-react";

export const Register = () => {
  const navigate = useNavigate();
  const { checkAuth } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
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
    if (!formData.name.trim()) {
      return "Name is required";
    }

    if (!formData.email.trim()) {
      return "Email is required";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(formData.email)) {
      return "Invalid email address";
    }

    if (!formData.password) {
      return "Password is required";
    }

    if (formData.password.length < 8) {
      return "Password must be at least 8 characters";
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
        "/auth/register",
        formData
      );

    localStorage.setItem(
      "accessToken",
      response.data.accessToken
    );

    await checkAuth();

    navigate("/workspace");
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Registration Failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#08070F] text-white">
      <div className="mx-auto flex min-h-screen max-w-7xl items-center px-6">
        
    <button
  onClick={() => navigate("/")}
  className="
    absolute
    left-8
    top-8
    flex
    items-center
    gap-2
    rounded-xl
    border
    border-zinc-800
    bg-zinc-900/50
    px-4
    py-2
    text-sm
    text-zinc-300
    transition
    hover:border-violet-500
    hover:text-white
  "
>
  <ArrowLeft size={18} />
  Back to Home
</button>

        {/* LEFT SECTION */}
        <div className="hidden flex-1 lg:flex">
          <div className="max-w-lg">
            <p className="mb-3 text-sm font-medium text-violet-400">
              Welcome to
            </p>

            <h1 className="mb-6 text-6xl font-bold">
              Synapse
            </h1>

            <p className="mb-12 text-lg leading-relaxed text-zinc-400">
              Manage departments, teams, projects and
              workflows from a single workspace designed
              to keep organizations aligned.
            </p>

            <div className="space-y-5">
              {[
                "Workspace Management",
                "Department & Team Structure",
                "Project Tracking",
                "AI Insights",
                "Role Based Access Control",
                "Team Collaboration",
              ].map((feature) => (
                <div
                  key={feature}
                  className="flex items-center gap-3"
                >
                  <div className="h-2 w-2 rounded-full bg-violet-500" />

                  <span className="text-zinc-300">
                    {feature}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT SECTION */}
        <div className="flex flex-1 justify-center">
          <div className="w-full max-w-md">
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-8">
              
              <h2 className="mb-2 text-3xl font-bold">
                Create Account
              </h2>

              <p className="mb-8 text-zinc-400">
                Start building with Synapse.
              </p>

              <form
                onSubmit={handleSubmit}
                className="space-y-5"
              >
                <div>
                  <label className="mb-2 block text-sm text-zinc-400">
                    Full Name
                  </label>

                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Dev Mehta"
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
                    ? "Creating Account..."
                    : "Create Account"}
                </button>
              </form>

              <p className="mt-6 text-center text-sm text-zinc-400">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-violet-400 hover:text-violet-300"
                >
                  Login
                </Link>
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};