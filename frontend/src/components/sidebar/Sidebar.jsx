import { theme } from "@/lib/theme";
import { sidebarConfig } from "../owner/sidebar.config";
import { SidebarItem } from "../owner/SidebarItem";

export const Sidebar = ({
  role = "owner",
  active = "Dashboard",
  config,
  basePath,
  isOpen,
  onClose,
}) => {
  const sections = config || sidebarConfig[role] || [];

  return (
    <aside
      className={`
        fixed inset-y-0 left-0 z-50 h-screen w-[280px] transform transition-transform duration-300 ease-in-out
        md:sticky md:top-[100px] md:h-[calc(100vh-120px)] md:w-[320px] md:translate-x-0 md:rounded-3xl
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
      `}
      style={{
        background: "rgba(13,13,18,.95)",
        border: "1px solid rgba(167,139,250,.10)",
        backdropFilter: "blur(28px)",
        WebkitBackdropFilter: "blur(28px)",
        boxShadow:
          "0 18px 40px rgba(0,0,0,.35),0 0 40px rgba(124,58,237,.08)",
      }}
    >
      <div className="flex h-full flex-col">
        {/* Scrollable Navigation */}
        <div
          className="
            flex-1
            overflow-y-auto
            px-5
            py-6

            scrollbar-thin
            scrollbar-track-transparent
            scrollbar-thumb-transparent
            hover:scrollbar-thumb-[#2D2B45]
          "
        >
          {sections.map((section) => (
            <div
              key={section.title}
              className="mb-7"
            >
              <p
                className="mb-3 px-3 text-[11px] font-semibold uppercase tracking-[0.25em]"
                style={{
                  color: theme.muted,
                }}
              >
                {section.title}
              </p>

              <div className="space-y-2">
                {section.items.map((item) => (
                  <SidebarItem
                    key={item.label}
                    {...item}
                    active={active === item.label}
                    basePath={basePath}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div
          className="px-6 py-5"
          style={{
            borderTop: "1px solid rgba(255,255,255,.05)",
          }}
        >
          <p
            className="text-xs"
            style={{
              color: theme.secondary,
            }}
          >
            Synapse v1.0.0
          </p>
        </div>
      </div>
    </aside>
  );
};