import { Calendar, User, Briefcase, Users, LayoutGrid } from "lucide-react";
import { theme } from "@/lib/theme";

const ManagerMemberCard = ({ member, onClick }) => {
    // Determine Role string (fallback to work_role or sys_role)
    const roleString = member.isTeamLead ? "Team Lead" : (member.sys_role === 'employee' ? 'Employee' : member.sys_role);

    return (
        <div 
            onClick={() => onClick(member)}
            className="group relative flex flex-col gap-4 rounded-2xl border border-zinc-800/60 bg-zinc-900/40 p-5 transition-all hover:border-violet-500/30 hover:bg-zinc-800/60 cursor-pointer"
        >
            <div className="flex items-start gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400 font-bold text-lg">
                    {member.avatar ? (
                        <img src={member.avatar} alt={member.name} className="h-full w-full rounded-xl object-cover" />
                    ) : (
                        member.name.charAt(0).toUpperCase()
                    )}
                </div>
                
                <div className="flex-1 min-w-0">
                    <h3 className="truncate text-base font-semibold text-zinc-100 group-hover:text-violet-300 transition-colors">
                        {member.name}
                    </h3>
                    <p className="truncate text-sm text-zinc-400">{member.email}</p>
                </div>
                
                <div className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${member.isActive ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                    {member.isActive ? 'Active' : 'Inactive'}
                </div>
            </div>

            <div className="h-px w-full bg-zinc-800/50" />

            <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center gap-2">
                    <User size={14} className="text-zinc-500" />
                    <span className="truncate text-xs font-medium text-zinc-300">
                        {roleString}
                    </span>
                </div>
                
                <div className="flex items-center gap-2">
                    <Briefcase size={14} className="text-zinc-500" />
                    <span className="truncate text-xs font-medium text-zinc-300">
                        {member.work_role}
                    </span>
                </div>

                <div className="flex items-center gap-2">
                    <LayoutGrid size={14} className="text-zinc-500" />
                    <span className="truncate text-xs text-zinc-400" title={member.departments.join(', ')}>
                        {member.departments.length > 0 ? member.departments.join(', ') : 'No Dept'}
                    </span>
                </div>

                <div className="flex items-center gap-2">
                    <Users size={14} className="text-zinc-500" />
                    <span className="truncate text-xs text-zinc-400" title={member.teams.join(', ')}>
                        {member.teams.length > 0 ? member.teams.join(', ') : 'No Team'}
                    </span>
                </div>
            </div>

            <div className="mt-1 flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs text-zinc-500">
                    <Calendar size={12} />
                    <span>Joined {new Date(member.joinedDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</span>
                </div>
            </div>
        </div>
    );
};

export default ManagerMemberCard;
