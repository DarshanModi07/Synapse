import { useRef, useState } from "react";

import { Camera } from "lucide-react";

import { theme } from "@/lib/theme";
import { useAuth } from "@/context/AuthContext";

import { uploadAvatar } from "@/services/user.service";

import { ProfileAvatar } from "./ProfileAvatar";

export const AvatarUploader = () => {
  const { profile, setProfile } = useAuth();

  const inputRef = useRef(null);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const handleClick = () => {
    inputRef.current.click();
  };

  const handleChange = async (e) => {
    const file = e.target.files[0];

    if (!file) return;

    // Image validation

    if (!file.type.startsWith("image/")) {
      setError("Please select an image.");

      return;
    }

    // 5 MB

    if (file.size > 5 * 1024 * 1024) {
      setError(
        "Image size must be below 5 MB."
      );

      return;
    }

    const formData = new FormData();

    formData.append("avatar", file);

    try {
      setLoading(true);

      setError("");

      const response = await uploadAvatar(formData);

      if (response?.message === "Avatar Updated") {
        setProfile((prev) => ({
          ...prev,
          avatar: response.avatar,
        }));
      } else {
        throw new Error("Failed to upload avatar");
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Upload failed."
      );
    } finally {
      setLoading(false);

      e.target.value = "";
    }
  };

  return (
    <section>

      <h2 className="text-xl font-semibold">
        Profile Picture
      </h2>

      <p
        className="mt-1 text-sm"
        style={{
          color: theme.secondary,
        }}
      >
        Upload a profile photo for your account.
      </p>

      <div className="mt-8 flex items-center gap-8">

        <ProfileAvatar
          user={profile}
          size="h-28 w-28"
        />

        <div>

          <input
            ref={inputRef}
            hidden
            type="file"
            accept="image/*"
            onChange={handleChange}
          />

          <button
            onClick={handleClick}
            disabled={loading}
            className="flex items-center gap-3 rounded-xl px-5 py-3 transition"
            style={{
              backgroundColor: theme.primary,
              color: theme.text,
            }}
          >
            <Camera size={18} />

            {loading
              ? "Uploading..."
              : "Upload Avatar"}
          </button>

          <p
            className="mt-3 text-sm"
            style={{
              color: theme.secondary,
            }}
          >
            PNG, JPG or WEBP

            <br />

            Maximum size 5 MB.
          </p>

          {error && (
            <p className="mt-3 text-sm text-red-500">
              {error}
            </p>
          )}

        </div>

      </div>

    </section>
  );
};