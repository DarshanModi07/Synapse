import { useAuth } from "@/context/AuthContext";
import { theme } from "@/lib/theme";

export const WelcomeSection = () => {
  const { profile } = useAuth();

  return (
    <section className="mx-auto mt-14 max-w-7xl px-6">
      <h1
        className="text-4xl font-bold"
        style={{
          color: theme.text,
        }}
      >
        Welcome back, {profile?.name} 👋
      </h1>

      <p
        className="mt-3 text-lg"
        style={{
          color: theme.secondary,
        }}
      >
        Select a workspace to continue.
      </p>
    </section>
  );
};