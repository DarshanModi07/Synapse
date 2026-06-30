import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import DepartmentHeader from "@/components/department/DepartmentHeader";
import DepartmentToolbar from "@/components/department/DepartmentToolbar";
import DepartmentGrid from "@/components/department/DepartmentGrid";
import CreateDepartmentModal from "@/components/department/CreateDepartmentModal";
import AISuggestionModal from "@/components/department/AISuggestionModal";

import { theme } from "@/lib/theme";

const DepartmentsPage = () => {

  const navigate = useNavigate();
  const { slug } = useParams();

  // Replace with your hook later
  const [departments, setDepartments] = useState([]);

  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");

  const [createOpen, setCreateOpen] =
    useState(false);

  const [aiOpen, setAiOpen] =
    useState(false);

  const [aiLoading, setAiLoading] =
    useState(false);

  const [suggestions, setSuggestions] =
    useState([]);

  const filteredDepartments =
    useMemo(() => {

      return departments.filter((department) =>
        department.name
          .toLowerCase()
          .includes(search.toLowerCase())
      );

    }, [departments, search]);

  const handleCreateDepartment = async (name) => {

    try {

      console.log(name);

      /*
      await createDepartment({
          workspaceId,
          name,
      });

      refetch();
      */

      setCreateOpen(false);

    }
    catch (err) {

      console.error(err);

    }

  };

  const handleAISuggestion = async () => {

    try {

      setAiLoading(true);

      /*
      const response =
      await suggestDepartments(workspaceId);

      setSuggestions(response.data);
      */

      // Dummy

      setSuggestions([
        {
          name: "Engineering",
          description:
            "Responsible for software development."
        },
        {
          name: "Marketing",
          description:
            "Handles branding and campaigns."
        },
        {
          name: "Finance",
          description:
            "Budgeting and financial planning."
        },
      ]);

      setAiOpen(true);

    }
    catch (err) {

      console.error(err);

    }
    finally {

      setAiLoading(false);

    }

  };

  const handleCreateAISuggestions =
    async (items) => {

      try {

        console.log(items);

        /*
        await Promise.all(

            items.map(item =>
                createDepartment({
                    workspaceId,
                    name:item.name
                })
            )

        );

        refetch();
        */

        setAiOpen(false);

      }
      catch (err) {

        console.error(err);

      }

    };

  return (

    <main
      className="min-h-[calc(100vh-130px)] rounded-3xl p-8"
      style={{
        background: "rgba(13,13,18,.55)",
        border:
          "1px solid rgba(167,139,250,.10)",
        backdropFilter: "blur(24px)",
      }}
    >

      <DepartmentHeader />

      <DepartmentToolbar
        search={search}
        setSearch={setSearch}
        onAISuggest={handleAISuggestion}
        onCreateDepartment={() =>
          setCreateOpen(true)
        }
      />

      <DepartmentGrid
        loading={loading}
        departments={filteredDepartments}
        onOpen={(department) =>
          navigate(
            `/workspace/${slug}/departments/${department.id}`
          )
        }
        onEdit={(department) =>
          console.log(department)
        }
        onDelete={(department) =>
          console.log(department)
        }
      />

      <CreateDepartmentModal
        open={createOpen}
        loading={loading}
        onClose={() =>
          setCreateOpen(false)
        }
        onCreate={handleCreateDepartment}
      />

      <AISuggestionModal
        open={aiOpen}
        loading={aiLoading}
        suggestions={suggestions}
        onClose={() =>
          setAiOpen(false)
        }
        onGenerate={handleAISuggestion}
        onCreate={handleCreateAISuggestions}
      />

    </main>

  );

};

export default DepartmentsPage;