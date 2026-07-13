import { useEffect, useMemo, useState } from "react";
import { Search, Users, User, Check, Building2 } from "lucide-react";
import { getAvailableTeams } from "@/services/projectTeam.service";
import { theme } from "@/lib/theme";

const AssignTeamModal = ({
    open,
    departments,
    loading,
    onClose,
    onAssign
}) => {
    // We now keep track of the chosen department
    const [selectedProjectDepartmentId, setSelectedProjectDepartmentId] = useState("");
    
    const [teams, setTeams] = useState([]);
    const [selectedTeam, setSelectedTeam] = useState(null);
    const [search, setSearch] = useState("");
    const [fetching, setFetching] = useState(false);

    // Initialize the default selected department when modal opens
    useEffect(() => {
        if (open && departments && departments.length > 0 && !selectedProjectDepartmentId) {
            setSelectedProjectDepartmentId(departments[0].projectDepartmentId);
        }
    }, [open, departments, selectedProjectDepartmentId]);

    /*
    =====================================================
    LOAD AVAILABLE TEAMS
    =====================================================
    */
    useEffect(() => {
        if (!open) return;
        if (!selectedProjectDepartmentId) return;

        fetchTeams(selectedProjectDepartmentId);
    }, [open, selectedProjectDepartmentId]);

    const fetchTeams = async (deptId) => {
        try {
            setFetching(true);
            const response = await getAvailableTeams(deptId);
            setTeams(response.data || []);
            // Reset selected team when department changes
            setSelectedTeam(null);
        } catch (err) {
            console.error(err);
        } finally {
            setFetching(false);
        }
    };

    /*
    =====================================================
    FILTER
    =====================================================
    */
    const filteredTeams = useMemo(() => {
        return teams.filter(team =>
            team.name.toLowerCase().includes(search.toLowerCase())
        );
    }, [teams, search]);

    /*
    =====================================================
    ASSIGN
    =====================================================
    */
    const handleAssign = async () => {
        if (!selectedTeam) return;
        if (!selectedProjectDepartmentId) return;

        try {
            await onAssign(selectedProjectDepartmentId, selectedTeam);
        } catch (err) {
            console.error(err);
        }
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
            <div
                className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-3xl p-7 shadow-2xl"
                style={{
                    background: theme.card,
                    border: "1px solid rgba(167,139,250,.15)"
                }}
            >
                {/* Header */}
                <div>
                    <h2 className="text-2xl font-semibold" style={{ color: theme.text }}>
                        Assign Team
                    </h2>
                    <p className="mt-2 text-sm" style={{ color: theme.secondary }}>
                        Select a department and a team to assign to this project.
                    </p>
                </div>

                {/* Department Select */}
                <div className="mt-6">
                    <label className="mb-2 flex items-center gap-2 text-sm font-medium" style={{ color: theme.secondary }}>
                        <Building2 size={16} /> Choose Department
                    </label>
                    <select
                        value={selectedProjectDepartmentId}
                        onChange={(e) => setSelectedProjectDepartmentId(e.target.value)}
                        className="w-full rounded-xl p-4 outline-none"
                        style={{
                            background: "rgba(255,255,255,.05)",
                            color: theme.text,
                            border: "1px solid rgba(255,255,255,.08)"
                        }}
                    >
                        {departments?.map(d => (
                            <option key={d.projectDepartmentId} value={d.projectDepartmentId} style={{ background: theme.card }}>
                                {d.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Search */}
                <div
                    className="mt-4 flex items-center rounded-xl px-4"
                    style={{ background: "rgba(255,255,255,.05)", border: "1px solid rgba(255,255,255,.08)" }}
                >
                    <Search size={18} color={theme.secondary} />
                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full bg-transparent p-4 text-sm outline-none"
                        placeholder="Search Available Teams..."
                        style={{ color: theme.text }}
                    />
                </div>

                {/* List */}
                <div className="mt-4 flex-1 space-y-3 overflow-y-auto min-h-[250px] pr-2 custom-scrollbar">
                    {fetching ? (
                        <div className="py-10 text-center text-sm" style={{ color: theme.secondary }}>
                            Loading teams...
                        </div>
                    ) : filteredTeams.length === 0 ? (
                        <div className="py-10 text-center text-sm" style={{ color: theme.secondary }}>
                            No available teams in this department.
                        </div>
                    ) : (
                        filteredTeams.map(team => (
                            <button
                                key={team.id}
                                onClick={() => setSelectedTeam(team.id)}
                                className="flex w-full items-center justify-between rounded-2xl p-5 transition-all hover:bg-white/5"
                                style={{
                                    background: selectedTeam === team.id ? "rgba(124,58,237,.18)" : "rgba(255,255,255,.03)",
                                    border: selectedTeam === team.id ? "1px solid rgba(124,58,237,.5)" : "1px solid transparent"
                                }}
                            >
                                <div className="flex items-center gap-4">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ background: "rgba(124,58,237,.1)" }}>
                                        <Users size={18} color={theme.primaryLight} />
                                    </div>
                                    <div className="text-left">
                                        <h3 className="font-medium text-sm" style={{ color: theme.text }}>
                                            {team.name}
                                        </h3>
                                        <div className="mt-1 flex items-center gap-2 text-xs" style={{ color: theme.secondary }}>
                                            <User size={13} />
                                            {team.leader?.name || "No Leader"}
                                        </div>
                                    </div>
                                </div>
                                {selectedTeam === team.id && (
                                    <Check color="#a855f7" size={20} />
                                )}
                            </button>
                        ))
                    )}
                </div>

                {/* Footer */}
                <div className="mt-6 flex items-center justify-end gap-3 border-t border-white/5 pt-6">
                    <button
                        onClick={onClose}
                        className="rounded-xl px-5 py-2.5 text-sm font-medium transition hover:bg-white/5"
                        style={{ color: theme.secondary }}
                    >
                        Cancel
                    </button>
                    <button
                        disabled={!selectedTeam || loading}
                        onClick={handleAssign}
                        className="rounded-xl px-6 py-2.5 text-sm font-medium text-white transition disabled:opacity-50 hover:opacity-90"
                        style={{ background: theme.primary }}
                    >
                        {loading ? "Assigning..." : "Assign Team"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AssignTeamModal;