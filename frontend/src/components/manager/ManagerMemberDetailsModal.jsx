import { X, Calendar, User, Briefcase, Users, LayoutGrid, CheckCircle2, Circle, Clock } from "lucide-react";

const ManagerMemberDetailsModal = ({ open, member, onClose }) => {
    if (!open || !member) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="relative w-full max-w-lg rounded-3xl border border-zinc-800 bg-zinc-950 p-6 shadow-2xl overflow-hidden">
                {/* Background Accent */}
                <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-violet-900/20 to-transparent pointer-events-none" />

                <button
                    onClick={onClose}
                    className="absolute right-4 top-4 rounded-full p-2 text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors z-10"
                >
                    <X size={20} />
                </button>

                <div className="relative z-10">
                    {/* Header */}
                    <div className="flex flex-col items-center text-center gap-3 mb-6 mt-4">
                        <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-violet-500/10 text-violet-400 font-bold text-3xl shadow-lg ring-1 ring-violet-500/20">
                            {member.avatar ? (
                                <img src={member.avatar} alt={member.name} className="h-full w-full rounded-2xl object-cover" />
                            ) : (
                                member.name.charAt(0).toUpperCase()
                            )}
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white">{member.name}</h2>
                            <p className="text-sm text-zinc-400">{member.email}</p>
                        </div>
                        <div className={`rounded-full px-3 py-1 text-xs font-semibold ${member.isActive ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                            {member.isActive ? 'Active Member' : 'Inactive Member'}
                        </div>
                    </div>

                    <div className="h-px w-full bg-zinc-800/60 my-6" />

                    {/* Member Details */}
                    <div className="grid grid-cols-2 gap-y-6 gap-x-4">
                        <div className="flex items-start gap-3">
                            <div className="p-2 bg-zinc-900 rounded-lg shrink-0">
                                <User size={16} className="text-zinc-400" />
                            </div>
                            <div>
                                <p className="text-xs text-zinc-500 font-medium mb-0.5">System Role</p>
                                <p className="text-sm text-zinc-200">{member.isTeamLead ? "Team Lead" : (member.sys_role === 'employee' ? 'Employee' : member.sys_role)}</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <div className="p-2 bg-zinc-900 rounded-lg shrink-0">
                                <Briefcase size={16} className="text-zinc-400" />
                            </div>
                            <div>
                                <p className="text-xs text-zinc-500 font-medium mb-0.5">Work Role</p>
                                <p className="text-sm text-zinc-200">{member.work_role}</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <div className="p-2 bg-zinc-900 rounded-lg shrink-0">
                                <LayoutGrid size={16} className="text-zinc-400" />
                            </div>
                            <div>
                                <p className="text-xs text-zinc-500 font-medium mb-0.5">Departments</p>
                                <p className="text-sm text-zinc-200">{member.departments.length > 0 ? member.departments.join(', ') : 'None'}</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <div className="p-2 bg-zinc-900 rounded-lg shrink-0">
                                <Users size={16} className="text-zinc-400" />
                            </div>
                            <div>
                                <p className="text-xs text-zinc-500 font-medium mb-0.5">Teams</p>
                                <p className="text-sm text-zinc-200">{member.teams.length > 0 ? member.teams.join(', ') : 'None'}</p>
                            </div>
                        </div>
                    </div>

                    <div className="h-px w-full bg-zinc-800/60 my-6" />

                    {/* Workload Stats */}
                    <h3 className="text-sm font-semibold text-zinc-300 mb-4 px-1">Workload Statistics</h3>
                    
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        <div className="bg-zinc-900/50 border border-zinc-800/80 rounded-xl p-3 flex flex-col items-center justify-center text-center gap-1">
                            <span className="text-xl font-bold text-white">{member.stats.assignedProjects}</span>
                            <span className="text-[10px] uppercase tracking-wider font-semibold text-zinc-500">Projects</span>
                        </div>
                        
                        <div className="bg-blue-500/5 border border-blue-500/10 rounded-xl p-3 flex flex-col items-center justify-center text-center gap-1">
                            <span className="text-xl font-bold text-blue-400">{member.stats.assignedTasks}</span>
                            <span className="text-[10px] uppercase tracking-wider font-semibold text-blue-500/70">Tasks</span>
                        </div>

                        <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-xl p-3 flex flex-col items-center justify-center text-center gap-1">
                            <span className="text-xl font-bold text-emerald-400">{member.stats.completedTasks}</span>
                            <span className="text-[10px] uppercase tracking-wider font-semibold text-emerald-500/70">Completed</span>
                        </div>

                        <div className="bg-amber-500/5 border border-amber-500/10 rounded-xl p-3 flex flex-col items-center justify-center text-center gap-1">
                            <span className="text-xl font-bold text-amber-400">{member.stats.pendingTasks}</span>
                            <span className="text-[10px] uppercase tracking-wider font-semibold text-amber-500/70">Pending</span>
                        </div>
                    </div>

                    {/* Footer Date */}
                    <div className="mt-8 flex items-center justify-center gap-2 text-xs text-zinc-600 font-medium">
                        <Calendar size={14} />
                        <span>Joined {new Date(member.joinedDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ManagerMemberDetailsModal;
