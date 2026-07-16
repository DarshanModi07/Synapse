import React, { useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { Search, Users, Activity, CheckCircle2, Target } from 'lucide-react';
import { useTeamLeadMembers } from '../../hooks/useTeamLeadMembers';
import TeamLeadMembersTable from '../../components/teamLead/TeamLeadMembersTable';

const TeamLeadMembersPage = () => {
    const { slug } = useParams();
    const { members, analytics, groupedTeams, loading, error } = useTeamLeadMembers();

    const [searchQuery, setSearchQuery] = useState("");
    const [teamFilter, setTeamFilter] = useState("all");
    const [statusFilter, setStatusFilter] = useState("all");

    // Extract unique teams for filter dropdown
    const uniqueTeams = useMemo(() => {
        if (!members) return [];
        const tms = new Set();
        members.forEach(m => m.teams.forEach(t => tms.add(t)));
        return Array.from(tms).sort();
    }, [members]);

    const filteredMembers = useMemo(() => {
        if (!members) return [];
        return members.filter(member => {
            if (searchQuery) {
                const q = searchQuery.toLowerCase();
                const matchName = member.name.toLowerCase().includes(q);
                const matchEmail = member.email.toLowerCase().includes(q);
                if (!matchName && !matchEmail) return false;
            }

            if (teamFilter !== "all") {
                if (!member.teams.includes(teamFilter)) return false;
            }

            if (statusFilter !== "all") {
                const isActive = statusFilter === "active";
                if (member.isActive !== isActive) return false;
            }

            return true;
        });
    }, [members, searchQuery, teamFilter, statusFilter]);

    if (loading) {
        return (
            <div className="flex h-[70vh] items-center justify-center">
                <div className="flex flex-col items-center gap-4 text-gray-400">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-t-transparent border-purple-500/30 border-t-purple-500" />
                    <span>Loading members...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex h-[70vh] items-center justify-center text-red-400">
                {error}
            </div>
        );
    }

    return (
        <div className="space-y-8 pb-20 max-w-7xl mx-auto mt-4">
            
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-white tracking-tight">Team Members</h1>
                <p className="text-gray-400 mt-1 max-w-2xl">
                    Monitor productivity, assignments, and performance across all teams under your leadership.
                </p>
            </div>

            {/* Overview Cards */}
            {analytics && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-[#13111C] border border-[#2D2B45] rounded-2xl p-5 flex flex-col gap-2 relative overflow-hidden group">
                        <div className="text-gray-500 mb-1 group-hover:text-purple-400 transition-colors"><Users size={20} /></div>
                        <p className="text-sm font-medium text-gray-400">Total Members</p>
                        <p className="text-3xl font-bold text-white">{analytics.totalMembers}</p>
                    </div>

                    <div className="bg-[#13111C] border border-[#2D2B45] rounded-2xl p-5 flex flex-col gap-2 relative overflow-hidden group">
                        <div className="text-blue-500 mb-1 group-hover:text-blue-400 transition-colors"><Activity size={20} /></div>
                        <p className="text-sm font-medium text-gray-400">Active Members</p>
                        <p className="text-3xl font-bold text-blue-400">{analytics.activeMembers}</p>
                    </div>

                    <div className="bg-[#13111C] border border-[#2D2B45] rounded-2xl p-5 flex flex-col gap-2 relative overflow-hidden group">
                        <div className="text-emerald-500 mb-1 group-hover:text-emerald-400 transition-colors"><CheckCircle2 size={20} /></div>
                        <p className="text-sm font-medium text-gray-400">Completed Tasks</p>
                        <p className="text-3xl font-bold text-emerald-400">{analytics.completedTasks}</p>
                    </div>

                    <div className="bg-[#13111C] border border-[#2D2B45] rounded-2xl p-5 flex flex-col gap-2 relative overflow-hidden group">
                        <div className="text-purple-500 mb-1 group-hover:text-purple-400 transition-colors"><Target size={20} /></div>
                        <p className="text-sm font-medium text-gray-400">Average Team Progress</p>
                        <p className="text-3xl font-bold text-purple-400">{analytics.teamProgress}%</p>
                    </div>
                </div>
            )}

            {/* Search & Filter Section (Sticky) */}
            <div className="sticky top-0 z-20 bg-[#08070F]/90 backdrop-blur-xl border-y border-[#2D2B45] py-4 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8 flex flex-col md:flex-row gap-4 mt-6">
                <div className="relative flex-1 group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-purple-400 transition-colors" size={18} />
                    <input 
                        type="text"
                        placeholder="Search by name or email..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-[#13111C] border border-[#2D2B45] rounded-xl py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-purple-500/50 transition-all placeholder:text-gray-600"
                    />
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <select 
                        value={teamFilter}
                        onChange={(e) => setTeamFilter(e.target.value)}
                        className="bg-[#13111C] border border-[#2D2B45] rounded-xl px-3 py-2.5 text-sm text-gray-300 focus:outline-none focus:border-purple-500/50"
                    >
                        <option value="all">All Teams</option>
                        {uniqueTeams.map(t => (
                            <option key={t} value={t}>{t}</option>
                        ))}
                    </select>

                    <select 
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="bg-[#13111C] border border-[#2D2B45] rounded-xl px-3 py-2.5 text-sm text-gray-300 focus:outline-none focus:border-purple-500/50"
                    >
                        <option value="all">All Status</option>
                        <option value="active">Active Only</option>
                        <option value="inactive">Inactive</option>
                    </select>
                </div>
            </div>

            {/* Members Table */}
            <TeamLeadMembersTable members={filteredMembers} />

            {/* Team Grouping Section */}
            {groupedTeams && groupedTeams.length > 0 && (
                <div className="mt-12">
                    <h3 className="text-xl font-bold text-white mb-6">Teams Overview</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {groupedTeams.map(team => (
                            <div key={team.id} className="bg-[#13111C] border border-[#2D2B45] rounded-xl p-5">
                                <h4 className="text-white font-semibold text-sm mb-2">{team.name}</h4>
                                <div className="flex items-center gap-2 text-sm text-gray-400">
                                    <Users className="w-4 h-4 text-purple-400" />
                                    <span>{team.membersCount} Members</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default TeamLeadMembersPage;
