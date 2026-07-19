import { useRef, useState } from "react";
import { createWorkspace } from "@/services/workspace.service";

export const CreateWorkspaceButton = ({ refetch }) => {
  const fileInputRef = useRef(null);

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    workRole: "",
    logo: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "logo") {
      setFormData((prev) => ({
        ...prev,
        logo: files[0],
      }));
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    console.log("Submitting workspace...");

    if (!formData.name.trim()) {
      return setError("Workspace name is required");
    }

    if (!formData.description.trim()) {
      return setError("Workspace description is required");
    }

    if (!formData.workRole.trim()) {
      return setError("Work role is required");
    }

    try {
      setLoading(true);
      setError("");

      const data = new FormData();

      data.append("name", formData.name);
      data.append("description", formData.description);
      data.append("workRole", formData.workRole);

      if (formData.logo) {
        data.append("logo", formData.logo);
      }

      const response = await createWorkspace(data);

      if (response?.message === "Workspace created successfully") {
        await refetch();
        setOpen(false);
        setFormData({
          name: "",
          description: "",
          workRole: "",
          logo: null,
        });
      } else {
        throw new Error("Failed to create workspace");
      }


    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to create workspace"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="mt-10 flex justify-center">
        <button
          onClick={() => setOpen(true)}
          className="rounded-xl bg-violet-600 px-6 py-3 text-white transition hover:bg-violet-500"
        >
          + Create Workspace
        </button>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="w-full max-w-lg rounded-2xl bg-zinc-900 p-8">

            <h2 className="mb-2 text-2xl font-semibold">
              Create Workspace
            </h2>

            <p className="mb-6 text-sm text-zinc-400">
              Set up a new workspace for your organization.
            </p>

            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >
              {/* Workspace Name */}
              <div>
                <label className="mb-2 block text-sm text-zinc-400">
                  Workspace Name
                </label>

                <input
                  name="name"
                  value={formData.name}
                  placeholder="Ex. Infocusp"
                  onChange={handleChange}
                  className="w-full rounded-xl border border-zinc-700 bg-zinc-950 p-3 outline-none transition focus:border-violet-500"
                />
              </div>

              {/* Description */}
              <div>
                <label className="mb-2 block text-sm text-zinc-400">
                  Description
                </label>

                <textarea
                  name="description"
                  rows={5}
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Provide a detailed description for better AI responses."
                  className="w-full resize-none rounded-xl border border-zinc-700 bg-zinc-950 p-3 outline-none transition focus:border-violet-500"
                />
              </div>

              {/* Work Role */}
              <div>
                <label className="mb-2 block text-sm text-zinc-400">
                  Your Work Role
                </label>

                <input
                  name="workRole"
                  value={formData.workRole}
                  placeholder="Ex. CEO, Founder, Engineering Manager"
                  onChange={handleChange}
                  className="w-full rounded-xl border border-zinc-700 bg-zinc-950 p-3 outline-none transition focus:border-violet-500"
                />
              </div>

              {/* Logo */}
              <div>
                <label className="mb-2 block text-sm text-zinc-400">
                  Workspace Logo (Optional)
                </label>

                <input
                  ref={fileInputRef}
                  type="file"
                  name="logo"
                  accept="image/*"
                  hidden
                  onChange={handleChange}
                />

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="rounded-xl border border-zinc-700 px-4 py-2 text-sm text-white transition hover:border-violet-500 hover:bg-zinc-800"
                >
                  Choose Logo
                </button>

                {formData.logo && (
                  <p className="mt-2 text-sm text-zinc-400">
                    Selected: {formData.logo.name}
                  </p>
                )}
              </div>

              {error && (
                <p className="text-sm text-red-500">
                  {error}
                </p>
              )}

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="rounded-xl border border-zinc-700 px-5 py-2 transition hover:bg-zinc-800"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="rounded-xl bg-violet-600 px-5 py-2 text-white transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading
                    ? "Creating..."
                    : "Create Workspace"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};