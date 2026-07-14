import { useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import { useWorkspace } from "@/context/WorkspaceContext";
import { Search, Users, UserCircle, Briefcase, Activity, CheckCircle2 } from "lucide-react";
import { useManagerMembers } from "@/hooks/useManagerMembers";
import ManagerMemberCard from "@/components/manager/ManagerMemberCard";
import ManagerMemberDetailsModal from "@/components/manager/ManagerMemberDetailsModal";
import { theme } from "@/lib/theme";

const ManagerMembersPage = () => {
    const { workspaceSlug } = useParams();
    const { workspace } = useWorkspace();
    const { members, analytics, loading, error } = useManagerMembers(workspace?.id);

    const [searchQuery, setSearchQuery] = useState("");
    const [roleFilter, setRoleFilter] = useState("all");
    const [deptFilter, setDeptFilter] = useState("all");
    const [teamFilter, setTeamFilter] = useState("all");
    const [statusFilter, setStatusFilter] = useState("all");

    const [selectedMember, setSelectedMember] = useState(null);
    const [detailsOpen, setDetailsOpen] = useState(false);

    // Extract unique options for filters
    const uniqueDepartments = useMemo(() => {
        if (!members) return [];
        const depts = new Set();
        members.forEach(m => m.departments.forEach(d => depts.add(d)));
        return Array.from(depts).sort();
    }, [members]);

    const uniqueTeams = useMemo(() => {
        if (!members) return [];
        const tms = new Set();
        members.forEach(m => m.teams.forEach(t => tms.add(t)));
        return Array.from(tms).sort();
    }, [members]);

    // Filtering Logic
    const filteredMembers = useMemo(() => {
        if (!members) return [];
        return members.filter(member => {
            // Search
            if (searchQuery) {
                const q = searchQuery.toLowerCase();
                const matchName = member.name.toLowerCase().includes(q);
                const matchEmail = member.email.toLowerCase().includes(q);
                const matchRole = member.work_role.toLowerCase().includes(q);
                const matchTeam = member.teams.some(t => t.toLowerCase().includes(q));
                if (!matchName && !matchEmail && !matchRole && !matchTeam) return false;
            }

            // Role Filter
            if (roleFilter !== "all") {
                if (roleFilter === "team_lead" && !member.isTeamLead) return false;
                if (roleFilter === "employee" && member.isTeamLead) return false;
            }

            // Department Filter
            if (deptFilter !== "all") {
                if (!member.departments.includes(deptFilter)) return false;
            }

            // Team Filter
            if (teamFilter !== "all") {
                if (!member.teams.includes(teamFilter)) return false;
            }

            // Status Filter
            if (statusFilter !== "all") {
                const isActive = statusFilter === "active";
                if (member.isActive !== isActive) return false;
            }

            return true;
        });
    }, [members, searchQuery, roleFilter, deptFilter, teamFilter, statusFilter]);

    /*
    =====================================================
    LOADING & ERROR
    =====================================================
    */

    if (loading) {
        return (
            <div className="flex h-[80vh] items-center justify-center">
                <div className="flex flex-col items-center gap-4 text-zinc-400">
                    <div className="h-10 w-10 animate-spin rounded-full border-4 border-t-transparent" style={{ borderColor: 'rgba(139,92,246,0.2)', borderTopColor: '#8b5cf6' }} />
                    <span>Loading members...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex h-[80vh] items-center justify-center text-xl text-zinc-300">
                {error}
            </div>
        );
    }

    return (
        <main className="max-w-7xl mx-auto space-y-8 pb-12 mt-4 px-4 sm:px-6 lg:px-8">
            
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-white tracking-tight">Department Members</h1>
                <p className="text-zinc-400 mt-1">View and monitor members belonging to your departments.</p>
            </div>

            {/* Analytics Cards */}
            {analytics && (
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-5 flex flex-col gap-2 relative overflow-hidden">
                        <div className="text-zinc-500 mb-1"><Users size={20} /></div>
                        <p className="text-sm font-medium text-zinc-400">Total Members</p>
                        <p className="text-3xl font-bold text-white">{analytics.totalMembers}</p>
                    </div>

                    <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-5 flex flex-col gap-2 relative overflow-hidden">
                        <div className="text-violet-500 mb-1"><UserCircle size={20} /></div>
                        <p className="text-sm font-medium text-zinc-400">Team Leads</p>
                        <p className="text-3xl font-bold text-violet-400">{analytics.totalTeamLeads}</p>
                    </div>

                    <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-5 flex flex-col gap-2 relative overflow-hidden">
                        <div className="text-blue-500 mb-1"><Briefcase size={20} /></div>
                        <p className="text-sm font-medium text-zinc-400">Employees</p>
                        <p className="text-3xl font-bold text-blue-400">{analytics.totalEmployees}</p>
                    </div>

                    <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-5 flex flex-col gap-2 relative overflow-hidden">
                        <div className="text-amber-500 mb-1"><Activity size={20} /></div>
                        <p className="text-sm font-medium text-zinc-400">Total Teams</p>
                        <p className="text-3xl font-bold text-amber-400">{analytics.totalTeams}</p>
                    </div>

                    <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-5 flex flex-col gap-2 relative overflow-hidden">
                        <div className="text-emerald-500 mb-1"><CheckCircle2 size={20} /></div>
                        <p className="text-sm font-medium text-zinc-400">Active</p>
                        <p className="text-3xl font-bold text-emerald-400">{analytics.activeMembers}</p>
                    </div>
                </div>
            )}

            {/* Filters Bar (Sticky) */}
            <div className="sticky top-0 z-20 -mx-4 px-4 py-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8 bg-zinc-950/80 backdrop-blur-xl border-y border-zinc-800/60 flex flex-col md:flex-row gap-4">
                
                {/* Search */}
                <div className="relative flex-1 group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-violet-400 transition-colors" size={18} />
                    <input 
                        type="text"
                        placeholder="Search by name, email, role, or team..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-zinc-900/80 border border-zinc-800 rounded-xl py-2.5 pl-10 pr-4 text-sm text-zinc-200 focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/50 transition-all placeholder:text-zinc-600"
                    />
                </div>

                {/* Filters */}
                <div className="flex flex-wrap items-center gap-3">
                    <select 
                        value={roleFilter}
                        onChange={(e) => setRoleFilter(e.target.value)}
                        className="bg-zinc-900/80 border border-zinc-800 rounded-xl px-3 py-2.5 text-sm text-zinc-300 focus:outline-none focus:border-violet-500/50"
                    >
                        <option value="all">All Roles</option>
                        <option value="team_lead">Team Lead</option>
                        <option value="employee">Employee</option>
                    </select>

                    <select 
                        value={deptFilter}
                        onChange={(e) => setDeptFilter(e.target.value)}
                        className="bg-zinc-900/80 border border-zinc-800 rounded-xl px-3 py-2.5 text-sm text-zinc-300 focus:outline-none focus:border-violet-500/50 max-w-[160px] truncate"
                    >
                        <option value="all">All Departments</option>
                        {uniqueDepartments.map(d => (
                            <option key={d} value={d}>{d}</option>
                        ))}
                    </select>

                    <select 
                        value={teamFilter}
                        onChange={(e) => setTeamFilter(e.target.value)}
                        className="bg-zinc-900/80 border border-zinc-800 rounded-xl px-3 py-2.5 text-sm text-zinc-300 focus:outline-none focus:border-violet-500/50 max-w-[150px] truncate"
                    >
                        <option value="all">All Teams</option>
                        {uniqueTeams.map(t => (
                            <option key={t} value={t}>{t}</option>
                        ))}
                    </select>

                    <select 
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="bg-zinc-900/80 border border-zinc-800 rounded-xl px-3 py-2.5 text-sm text-zinc-300 focus:outline-none focus:border-violet-500/50"
                    >
                        <option value="all">All Status</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                    </select>
                </div>
            </div>

            {/* Grid */}
            {filteredMembers.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center border border-dashed border-zinc-800 rounded-3xl bg-zinc-900/20">
                    <div className="p-4 bg-zinc-900 rounded-full mb-4">
                        <Users size={32} className="text-zinc-600" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">No members found</h3>
                    <p className="text-zinc-500 max-w-md mx-auto">
                        {members.length === 0 
                            ? "No members found in your departments."
                            : "No members match your current search and filter criteria."}
                    </p>
                </div>
            ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {filteredMembers.map(member => (
                        <ManagerMemberCard
                            key={member.id}
                            member={member}
                            onClick={(m) => {
                                setSelectedMember(m);
                                setDetailsOpen(true);
                            }}
                        />
                    ))}
                </div>
            )}

            {/* Modal */}
            <ManagerMemberDetailsModal
                open={detailsOpen}
                member={selectedMember}
                onClose={() => {
                    setDetailsOpen(false);
                    setTimeout(() => setSelectedMember(null), 200);
                }}
            />

        </main>
    );
};

export default ManagerMembersPage;
