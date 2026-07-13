import { theme } from "@/lib/theme";
import { useNavigate, useParams } from "react-router-dom";

export const SidebarItem = ({
  icon: Icon,
  label,
  path,
  active,
  basePath,
}) => {
  const navigate = useNavigate();
  const { slug } = useParams();

  const targetUrl = basePath
    ? (path ? `${basePath}/${path}` : basePath)
    : `/workspace/${slug}${path ? `/${path}` : ''}`;

  return (
    <button
      onClick={() => navigate(targetUrl)}
      className="group relative flex h-[58px] w-full items-center gap-4 rounded-2xl px-5 transition-all duration-300"
      style={{
        background: active
          ? "rgba(124,58,237,.12)"
          : "transparent",

        border: active
          ? "1px solid rgba(124,58,237,.20)"
          : "1px solid transparent",
      }}
    >
      {active && (
        <div
          className="absolute left-0 top-1/2 h-9 w-1 -translate-y-1/2 rounded-r-full"
          style={{
            background: theme.primary,
            boxShadow: "0 0 16px rgba(124,58,237,.9)",
          }}
        />
      )}

      <div
        className="absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background:
            "linear-gradient(90deg, rgba(124,58,237,.05), transparent)",
        }}
      />

      <Icon
        className="relative z-10"
        size={20}
        strokeWidth={2}
        color={
          active
            ? theme.primaryLight
            : theme.secondary
        }
      />

      <span
        className="relative z-10 text-[15px] font-medium"
        style={{
          color: active
            ? theme.text
            : theme.secondary,
        }}
      >
        {label}
      </span>
    </button>
  );
}