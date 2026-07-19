import { useEffect, useState } from "react";

import { theme } from "@/lib/theme";
import { useAuth } from "@/context/AuthContext";

import { editProfile } from "@/services/user.service";

export const EditProfileForm = () => {
  const { profile, setProfile } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
  });

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name,
      });
    }
  }, [profile]);

  const handleChange = (e) => {
    setFormData({
      name: e.target.value,
    });

    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      setError("Name is required.");
      return;
    }

    if (formData.name.trim().length < 3) {
      setError("Name must be at least 3 characters.");
      return;
    }

    try {
      setLoading(true);

      const response = await editProfile({
        name: formData.name.trim(),
      });

      if (response?.message === "User Profile Fetched Successful" || response?.message === "Profile updated successfully") {
        setProfile(response.data);
        setSuccess("Profile updated successfully.");
      } else {
        throw new Error("Failed to update profile");
      }

    } catch (err) {
      setError(
        err.response?.data?.message ??
          "Unable to update profile."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section>

      <h2 className="text-xl font-semibold">
        Personal Information
      </h2>

      <p
        className="mt-1 text-sm"
        style={{
          color: theme.secondary,
        }}
      >
        Update your account information.
      </p>

      <form
        onSubmit={handleSubmit}
        className="mt-8 space-y-6"
      >
        {/* Name */}

        <div>
          <label className="mb-2 block text-sm font-medium">
            Full Name
          </label>

          <input
            type="text"
            value={formData.name}
            onChange={handleChange}
            className="w-full rounded-xl border bg-transparent px-4 py-3 outline-none transition"
            style={{
              borderColor: theme.border,
            }}
          />
        </div>

        {/* Email */}

        <div>
          <label className="mb-2 block text-sm font-medium">
            Email Address
          </label>

          <input
            type="email"
            disabled
            value={profile?.email || ""}
            className="w-full cursor-not-allowed rounded-xl border bg-zinc-900 px-4 py-3 opacity-70"
            style={{
              borderColor: theme.border,
            }}
          />
        </div>

        {error && (
          <p className="text-sm text-red-500">
            {error}
          </p>
        )}

        {success && (
          <p className="text-sm text-green-500">
            {success}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="rounded-xl px-6 py-3 font-medium transition"
          style={{
            backgroundColor: theme.primary,
            color: theme.text,
          }}
        >
          {loading
            ? "Saving..."
            : "Save Changes"}
        </button>
      </form>

    </section>
  );
};