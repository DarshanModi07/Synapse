import { theme } from "@/lib/theme";

const DepartmentHeader = () => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1
          className="text-4xl font-bold"
          style={{
            color: theme.text,
          }}
        >
          Departments
        </h1>

        <p
          className="mt-2 text-[15px]"
          style={{
            color: theme.secondary,
          }}
        >
          Manage departments, assign managers and organize your workspace structure.
        </p>
      </div>
    </div>
  );
};

export default DepartmentHeader;