import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import TeamHeader from "@/components/team/TeamHeader";
import TeamToolbar from "@/components/team/TeamToolbar";
import TeamGrid from "@/components/team/TeamGrid";

import CreateTeamModal from "@/components/team/CreateTeamModal";
import EditTeamModal from "@/components/team/EditTeamModal";
import DeleteTeamDialog from "@/components/team/DeleteTeamDialog";
import ManagerAITeamSuggestionModal from "@/components/manager/team/ManagerAITeamSuggestionModal";

import { useWorkspace } from "@/context/WorkspaceContext";
import { useManagerDepartmentTeams } from "@/hooks/useManagerDepartmentTeams";
import { useManagerWorkspaceTeams } from "@/hooks/useManagerWorkspaceTeams";

import { theme } from "@/lib/theme";

const ManagerTeamsPage = () => {
  const navigate = useNavigate();
  const { slug, departmentId } = useParams();
  const { workspace } = useWorkspace();

  const deptTeams = useManagerDepartmentTeams(departmentId);
  const workspaceTeams = useManagerWorkspaceTeams(workspace?.id);

  const {
    teams,
    loading,
    creating,
    updating,
    deleting,
    addTeam,
    editTeam,
    removeTeam,
  } = departmentId ? deptTeams : workspaceTeams;

  const [search, setSearch] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [aiOpen, setAiOpen] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState(null);

  const filteredTeams = useMemo(() => {
    return teams.filter(team =>
      team.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [teams, search]);

  const handleCreate = async (data) => {
    try {
      await addTeam(data);
      setCreateOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdate = async (teamId, data) => {
    try {
      await editTeam(teamId, data);
      setEditOpen(false);
      setSelectedTeam(null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (teamId) => {
    try {
      await removeTeam(teamId);
      setDeleteOpen(false);
      setSelectedTeam(null);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <main
      className="min-h-[calc(100vh-130px)] rounded-3xl p-8"
      style={{
        background: "rgba(13,13,18,.55)",
        border: "1px solid rgba(167,139,250,.10)",
        backdropFilter: "blur(24px)",
      }}
    >
      <TeamHeader />

      <TeamToolbar
        search={search}
        setSearch={setSearch}
        onCreateTeam={() => setCreateOpen(true)}
        onAISuggest={() => setAiOpen(true)}
      />

      <TeamGrid
        loading={loading}
        teams={filteredTeams}
        onOpen={(team) =>
          navigate(`/workspace/${slug}/manager/teams/${team.id}`)
        }
        onEdit={(team) => {
          setSelectedTeam(team);
          setEditOpen(true);
        }}
        onDelete={(team) => {
          setSelectedTeam(team);
          setDeleteOpen(true);
        }}
      />

      <CreateTeamModal
        open={createOpen}
        loading={creating}
        workspaceId={workspace?.id}
        managerMode={true}
        onClose={() => setCreateOpen(false)}
        onCreate={handleCreate}
      />

      <EditTeamModal
        open={editOpen}
        team={selectedTeam}
        loading={updating}
        managerMode={true}
        onClose={() => {
          setEditOpen(false);
          setSelectedTeam(null);
        }}
        onSave={handleUpdate}
      />

      <DeleteTeamDialog
        open={deleteOpen}
        team={selectedTeam}
        loading={deleting}
        onClose={() => {
          setDeleteOpen(false);
          setSelectedTeam(null);
        }}
        onDelete={handleDelete}
      />

      <ManagerAITeamSuggestionModal
        open={aiOpen}
        departmentId={departmentId}
        workspaceId={workspace?.id}
        onClose={() => setAiOpen(false)}
        onCreate={handleCreate}
      />

    </main>

  );

};

export default ManagerTeamsPage;
