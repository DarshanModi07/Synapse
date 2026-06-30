import DepartmentCard from "./DepartmentCard";
import { theme } from "@/lib/theme";
import { Building2 } from "lucide-react";

const DepartmentGrid = ({
  departments,
  loading,
  onOpen,
  onEdit,
  onDelete,
}) => {
  if (loading) {
    return (
      <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="h-[310px] animate-pulse rounded-3xl"
            style={{
              background: "rgba(255,255,255,.04)",
              border: "1px solid rgba(255,255,255,.05)",
            }}
          />
        ))}
      </div>
    );
  }

  if (!departments.length) {
    return (
      <div
        className="mt-12 flex flex-col items-center justify-center rounded-3xl py-24"
        style={{
          background: "rgba(13,13,18,.55)",
          border: "1px solid rgba(167,139,250,.10)",
        }}
      >
        <div
          className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl"
          style={{
            background: "rgba(124,58,237,.12)",
          }}
        >
          <Building2
            size={36}
            color={theme.primary}
          />
        </div>

        <h2
          className="text-2xl font-semibold"
          style={{
            color: theme.text,
          }}
        >
          No Departments Yet
        </h2>

        <p
          className="mt-3 max-w-md text-center"
          style={{
            color: theme.secondary,
          }}
        >
          Create your first department or let AI generate
          a recommended organizational structure for your
          workspace.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-8 grid gap-6 md:grid-cols-2 2xl:grid-cols-3">
      {departments.map((department) => (
        <DepartmentCard
          key={department.id}
          department={department}
          onOpen={onOpen}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default DepartmentGrid;