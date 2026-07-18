import React from 'react';
import { User, Mail, Calendar, Building2, CheckCircle2, Activity, Target } from 'lucide-react';

const TeamLeadMemberProfile = ({ profile, stats }) => {
    if (!profile) return null;

    return (
        <div className="bg-[#13111C] border border-[#2D2B45] rounded-[14px] overflow-hidden shadow-sm">
            {/* Header Banner */}
            <div className="h-32 bg-gradient-to-r from-purple-900/40 to-[#08070F] border-b border-[#2D2B45] relative">
                <div className="absolute -bottom-10 left-8">
                    <div className="w-24 h-24 rounded-[14px] bg-[#13111C] border-4 border-[#13111C] flex items-center justify-center overflow-hidden shadow-xl">
                        {profile.avatar ? (
                            <img src={profile.avatar} alt={profile.name} className="w-full h-full object-cover" />
                        ) : (
                            <User className="w-10 h-10 text-[#6B7280]" />
                        )}
                    </div>
                </div>
            </div>

            {/* Profile Info */}
            <div className="pt-14 pb-8 px-8 flex flex-col md:flex-row justify-between items-start gap-8">
                <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                        <h2 className="text-[24px] font-bold text-[#F9FAFB]">{profile.name}</h2>
                        <span className="px-2.5 py-1 rounded-[6px] text-[11px] font-bold uppercase tracking-wider bg-purple-500/10 text-purple-400 border border-purple-500/20">
                            {profile.role === 'team_lead' ? 'Team Lead' : 'Employee'}
                        </span>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-6 mt-4">
                        <div className="flex items-center gap-2 text-[13px] font-medium text-[#6B7280]">
                            <Mail className="w-4 h-4 text-[#6B7280]" />
                            {profile.email}
                        </div>
                        <div className="flex items-center gap-2 text-[13px] font-medium text-[#6B7280]">
                            <Building2 className="w-4 h-4 text-[#6B7280]" />
                            {profile.departments}
                        </div>
                        <div className="flex items-center gap-2 text-[13px] font-medium text-[#6B7280]">
                            <Target className="w-4 h-4 text-[#6B7280]" />
                            {profile.teamName}
                        </div>
                        <div className="flex items-center gap-2 text-[13px] font-medium text-[#6B7280]">
                            <Calendar className="w-4 h-4 text-[#6B7280]" />
                            Joined {new Date(profile.joinedDate).toLocaleDateString()}
                        </div>
                    </div>
                </div>

                {/* Stats Widgets */}
                <div className="flex gap-4">
                    <div className="bg-[#08070F] border border-[#2D2B45] rounded-[10px] p-4 min-w-[120px] text-center hover:border-purple-500/30 transition-colors">
                        <div className="flex items-center justify-center gap-1.5 text-[12px] text-[#6B7280] mb-1 font-bold">
                            <Activity className="w-3.5 h-3.5 text-purple-400" /> Productivity
                        </div>
                        <div className="text-[24px] font-bold text-[#F9FAFB]">{stats?.productivity || 0}%</div>
                    </div>
                    
                    <div className="bg-[#08070F] border border-[#2D2B45] rounded-[10px] p-4 min-w-[120px] text-center hover:border-blue-500/30 transition-colors">
                        <div className="flex items-center justify-center gap-1.5 text-[12px] text-[#6B7280] mb-1 font-bold">
                            <Target className="w-3.5 h-3.5 text-blue-400" /> Active Tasks
                        </div>
                        <div className="text-[24px] font-bold text-[#F9FAFB]">{stats?.activeSubtasks || 0}</div>
                    </div>

                    <div className="bg-[#08070F] border border-[#2D2B45] rounded-[10px] p-4 min-w-[120px] text-center hover:border-emerald-500/30 transition-colors">
                        <div className="flex items-center justify-center gap-1.5 text-[12px] text-[#6B7280] mb-1 font-bold">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Completed
                        </div>
                        <div className="text-[24px] font-bold text-[#F9FAFB]">{stats?.completedSubtasks || 0}</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TeamLeadMemberProfile;
