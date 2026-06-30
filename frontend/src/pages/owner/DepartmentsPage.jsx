import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import DepartmentHeader from "@/components/department/DepartmentHeader";
import DepartmentToolbar from "@/components/department/DepartmentToolbar";
import DepartmentGrid from "@/components/department/DepartmentGrid";
import CreateDepartmentModal from "@/components/department/CreateDepartmentModal";
import EditDepartmentModal from "@/components/department/EditDepartmentModal";
import DeleteDepartmentDialog from "@/components/department/DeleteDepartmentDialog";
import AISuggestionModal from "@/components/department/AISuggestionModal";

import { useWorkspace } from "@/context/WorkspaceContext";
import { useDepartments } from "@/hooks/useDepartments";
import { suggestDepartments } from "@/services/department.service";

import { theme } from "@/lib/theme";

const DepartmentsPage = () => {
  const navigate = useNavigate();
  const { slug } = useParams();

  const { workspace } = useWorkspace();

  const {
    departments,
    loading,

    creating,
    updating,
    deleting,

    addDepartment,
    editDepartment,
    removeDepartment,
  } = useDepartments(workspace?.id);

  const [search, setSearch] = useState("");

  const [createOpen, setCreateOpen] = useState(false);

  const [editOpen, setEditOpen] = useState(false);

  const [deleteOpen, setDeleteOpen] = useState(false);

  const [aiOpen, setAiOpen] = useState(false);

  const [selectedDepartment, setSelectedDepartment] =
    useState(null);

  const [aiLoading, setAiLoading] =
    useState(false);

  const [suggestions, setSuggestions] =
    useState([]);

  const filteredDepartments = useMemo(() => {
    return departments.filter((department) =>
      department.name
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [departments, search]);

  const handleAISuggestion = async () => {
    try {
      setAiLoading(true);

      const response =
        await suggestDepartments(
          workspace.id
        );

      setSuggestions(
        response.data.departments || []
      );

      setAiOpen(true);
    } catch (err) {
      console.error(err);
    } finally {
      setAiLoading(false);
    }
  };

  const handleCreateAISuggestions =
    async (items) => {
      try {
        await Promise.all(
          items.map((item) =>
            addDepartment(item.name)
          )
        );

        setAiOpen(false);
      } catch (err) {
        console.error(err);
      }
    };

  return (
    <main
      className="min-h-[calc(100vh-130px)] rounded-3xl p-8"
      style={{
        background:
          "rgba(13,13,18,.55)",
        border:
          "1px solid rgba(167,139,250,.10)",
        backdropFilter: "blur(24px)",
      }}
    >
      <DepartmentHeader />

      <DepartmentToolbar
        search={search}
        setSearch={setSearch}
        onAISuggest={
          handleAISuggestion
        }
        onCreateDepartment={() =>
          setCreateOpen(true)
        }
      />

      <DepartmentGrid
        loading={loading}
        departments={
          filteredDepartments
        }
        onOpen={(department) =>
          navigate(
            `/workspace/${slug}/departments/${department.id}`
          )
        }
        onEdit={(department) => {
          setSelectedDepartment(
            department
          );
          setEditOpen(true);
        }}
        onDelete={(department) => {
          setSelectedDepartment(
            department
          );
          setDeleteOpen(true);
        }}
      />

      <CreateDepartmentModal
        open={createOpen}
        loading={creating}
        onClose={() =>
          setCreateOpen(false)
        }
        onCreate={async (name) => {
          await addDepartment(name);

          setCreateOpen(false);
        }}
      />

      <EditDepartmentModal
        open={editOpen}
        department={
          selectedDepartment
        }
        loading={updating}
        onClose={() =>
          setEditOpen(false)
        }
        onSave={async (
          departmentId,
          data
        ) => {
          await editDepartment(
            departmentId,
            data
          );

          setEditOpen(false);
        }}
      />

      <DeleteDepartmentDialog
        open={deleteOpen}
        department={
          selectedDepartment
        }
        loading={deleting}
        onClose={() =>
          setDeleteOpen(false)
        }
        onDelete={async (
          departmentId
        ) => {
          await removeDepartment(
            departmentId
          );

          setDeleteOpen(false);
        }}
      />

      <AISuggestionModal
        open={aiOpen}
        loading={aiLoading}
        suggestions={
          suggestions
        }
        onClose={() =>
          setAiOpen(false)
        }
        onGenerate={
          handleAISuggestion
        }
        onCreate={
          handleCreateAISuggestions
        }
      />
    </main>
  );
};

export default DepartmentsPage;