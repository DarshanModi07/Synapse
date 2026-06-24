import { theme } from "@/lib/theme";

export const Footer = () => {
  return (
    <footer className="px-6 pb-6 pt-20" id="contact">
      <div
        className="mx-auto max-w-7xl rounded-3xl border p-8 md:p-12"
        style={{
          backgroundColor: `${theme.card}`,
          borderColor: `${theme.border}30`,
        }}
      >
        <div className="grid gap-10 md:grid-cols-2">
          {/* Left */}
          <div>
            <h3
              className="mb-3 text-2xl font-semibold"
              style={{ color: theme.text }}
            >
              Synapse
            </h3>

            <p
              className="max-w-lg leading-relaxed"
              style={{ color: theme.secondary }}
            >
              A modern workspace platform built to help teams manage
              projects, collaborate efficiently, and stay aligned in
              one place.
            </p>
          </div>

          {/* Right */}
          <div>
            <h4
              className="mb-4 text-lg font-medium"
              style={{ color: theme.text }}
            >
              Contact the Creator
            </h4>

            <div
              className="flex flex-col gap-3"
              style={{ color: theme.secondary }}
            >
              <a
                href="mailto:darshanmodi016@gmail.com"
                className="transition-opacity hover:opacity-80"
              >
                darshanmodi016@gmail.com
              </a>

              <a
                href="tel:+918200416081"
                className="transition-opacity hover:opacity-80"
              >
                +91 8200416081
              </a>

              <a
                href="https://github.com/DarshanModi07"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-opacity hover:opacity-80"
              >
                GitHub
              </a>

              <a
                href="https://www.linkedin.com/in/darshan-modi-0b221b329/"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-opacity hover:opacity-80"
              >
                LinkedIn
              </a>

              <a
                href="https://x.com/Darshan_Modi07"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-opacity hover:opacity-80"
              >
                Twitter / X
              </a>
            </div>
          </div>
        </div>

        <div
          className="mt-10 border-t pt-6"
          style={{
            borderColor: `${theme.primary}20`,
          }}
        >
          <p
            className="text-center text-sm"
            style={{ color: theme.muted }}
          >
            © {new Date().getFullYear()} Synapse · Designed and developed by Darshan Modi
          </p>
        </div>
      </div>
    </footer>
  );
};