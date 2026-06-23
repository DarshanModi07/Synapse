import { theme } from "../../lib/theme.js";


export const Navbar = () => {
  return (
    <nav className="sticky top-4 z-50 px-4 sm:px-6">
      <div
        className="mx-auto max-w-7xl rounded-3xl"
        style={{
          background: "rgba(13, 13, 18, 0.25)",
          border: "1px solid rgba(167, 139, 250, 0.15)",
          boxShadow: `
            0 10px 30px rgba(0,0,0,0.35),
            0 0 40px rgba(124,58,237,0.08)
          `,
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
        }}
      >
        <div className="flex h-16 items-center justify-between px-4 sm:px-6">

          {/* Logo */}
          <div className="flex items-center">
            <div
              className="relative flex items-center justify-center overflow-hidden rounded-full px-5 py-2"
              style={{
                background:
                  "linear-gradient(135deg, rgba(124,58,237,0.95), rgba(91,33,182,0.75))",
                boxShadow: `
                  0 8px 24px rgba(124,58,237,0.35),
                  inset 0 1px 1px rgba(255,255,255,0.15)
                `,
              }}
            >
              {/* Faded Brush Effect */}
              <div
                className="absolute inset-0"
                style={{
                  background: `
                    linear-gradient(
                      100deg,
                      rgba(255,255,255,0.18) 0%,
                      rgba(255,255,255,0.10) 20%,
                      transparent 40%,
                      rgba(255,255,255,0.08) 60%,
                      transparent 100%
                    )
                  `,
                  filter: "blur(6px)",
                }}
              />

              <span
                className="relative z-10 text-2xl tracking-wide"
                style={{
                  fontFamily: "ciguatera",
                  color: theme.text,
                  textShadow: "0 0 18px rgba(255,255,255,0.15)",
                }}
              >
                Synapse
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {["Features", "AI", "Pricing", "Contact"].map((item) => (
              <a
                key={item}
                href="#"
                className="transition-all duration-200 hover:scale-105 hover:text-white"
                style={{
                  color: theme.secondary,
                }}
              >
                {item}
              </a>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <button
              className="hidden sm:block transition-colors duration-200 hover:text-white"
              style={{
                color: theme.secondary,
              }}
            >
              Login
            </button>

            <button
              className="rounded-2xl px-4 py-2 font-medium transition-all duration-200 hover:scale-105"
              style={{
                backgroundColor: theme.primary,
                color: theme.text,
                boxShadow: "0 8px 20px rgba(124,58,237,0.30)",
              }}
            >
              Get Started
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};