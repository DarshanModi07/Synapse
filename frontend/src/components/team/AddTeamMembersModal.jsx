import { useState, useMemo } from "react";
import { X, Search, User, Shield, Briefcase, Check } from "lucide-react";
import { theme } from "@/lib/theme";

const AddTeamMembersModal = ({
    open,
    workspaceMembers = [],
    teamMembers = [],
    loading,
    onClose,
    onAdd
}) => {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedIds, setSelectedIds] = useState([]);

    // Handle existing members to disable them
    const existingMemberIds = useMemo(() => {
        return new Set((teamMembers || []).map(m => m?.user?.id || m?.userId || m?.id));
    }, [teamMembers]);

    const filteredMembers = useMemo(() => {
        return (workspaceMembers || []).filter(member => {
            const memberRole = member?.sys_role?.toLowerCase() || member?.role?.toLowerCase() || "";
            if (memberRole !== "employee") return false;

            const memberUserId = member?.user?.id || member?.userId || member?.id;
            if (existingMemberIds.has(memberUserId)) return false;

            const memberName = member?.user?.name || member?.name || "";
            const memberEmail = member?.user?.email || member?.email || "";
            const nameMatch = memberName.toLowerCase().includes(searchQuery?.toLowerCase() || "");
            const emailMatch = memberEmail.toLowerCase().includes(searchQuery?.toLowerCase() || "");
            return nameMatch || emailMatch;
        });
    }, [workspaceMembers, searchQuery, existingMemberIds]);

    if (!open) return null;

    if (!teamMembers || !workspaceMembers) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
                <div className="bg-red-500/10 border border-red-500 text-red-500 p-4 rounded-lg">
                    Invalid Team Configuration
                </div>
            </div>
        );
    }

    const toggleSelection = (userId) => {
        if (existingMemberIds.has(userId)) return;

        setSelectedIds(prev => {
            if (prev?.includes(userId)) {
                return prev.filter(id => id !== userId);
            }
            if (prev?.length >= 25) {
                return prev;
            }
            return [...(prev || []), userId];
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (selectedIds.length === 0) return;
        await onAdd(selectedIds);
        setSelectedIds([]);
        setSearchQuery("");
    };

    const handleClose = () => {
        setSelectedIds([]);
        setSearchQuery("");
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
            <div
                className="w-full max-w-2xl rounded-3xl p-8 flex flex-col max-h-[85vh]"
                style={{
                    background: theme.card,
                    border: "1px solid rgba(167,139,250,.12)"
                }}
            >
                {/* Header */}
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold" style={{ color: theme.text }}>
                            Add Team Members
                        </h2>
                        <p className="mt-1" style={{ color: theme.secondary }}>
                            Select up to 25 members from this workspace to add to the team.
                        </p>
                    </div>
                    <button
                        onClick={handleClose}
                        className="rounded-full p-2 transition-colors hover:bg-white/10"
                        style={{ color: theme.secondary }}
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Search */}
                <div className="relative mb-4">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search members by name or email..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full rounded-xl bg-black/40 py-3 pl-12 pr-4 outline-none transition-all focus:ring-2 focus:ring-purple-500/50"
                        style={{
                            color: theme.text,
                            border: "1px solid rgba(255,255,255,0.1)"
                        }}
                    />
                </div>

                <div className="mb-4 flex items-center justify-between">
                    <span style={{ color: theme.secondary }} className="text-sm">
                        {selectedIds.length} / 25 selected
                    </span>
                    {selectedIds.length >= 25 && (
                        <span className="text-xs text-red-400">Maximum limit reached</span>
                    )}
                </div>

                {/* Member List */}
                <div className="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                    {filteredMembers.length === 0 ? (
                        <div className="py-8 text-center" style={{ color: theme.secondary }}>
                            No workspace members found.
                        </div>
                    ) : (
                        filteredMembers.map(member => {
                            const memberUserId = member?.user?.id || member?.userId || member?.id;
                            const isExisting = existingMemberIds.has(memberUserId);
                            const isSelected = selectedIds.includes(memberUserId);

                            const memberName = member?.user?.name || member?.name || "Unknown";
                            const memberEmail = member?.user?.email || member?.email || "No email";
                            const memberAvatar = member?.user?.avatar || member?.avatar;
                            const memberRole = member?.sys_role || member?.role || "employee";

                            return (
                                <div
                                    key={member.id}
                                    onClick={() => toggleSelection(memberUserId)}
                                    className={`flex cursor-pointer items-center justify-between rounded-2xl p-4 transition-all duration-300 ${isExisting ? 'opacity-50 cursor-not-allowed bg-black/20' : 'hover:bg-white/5'} ${isSelected ? 'bg-purple-500/10' : ''}`}
                                    style={{
                                        border: isSelected 
                                            ? `1px solid ${theme.primary}` 
                                            : "1px solid rgba(255,255,255,.05)",
                                    }}
                                >
                                    <div className="flex items-center gap-4">
                                        {/* Checkbox / Selection Indicator */}
                                        <div className={`flex h-6 w-6 items-center justify-center rounded-md border ${isSelected ? 'bg-purple-500 border-purple-500' : 'border-gray-600'}`}>
                                            {isSelected && <Check size={14} color="#fff" />}
                                        </div>

                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full" style={{ background: "rgba(124,58,237,.18)" }}>
                                            {memberAvatar ? (
                                                <img src={memberAvatar} alt={memberName} className="h-full w-full object-cover" />
                                            ) : (
                                                <User size={20} color="#fff" />
                                            )}
                                        </div>

                                        <div>
                                            <h3 className="text-base font-semibold" style={{ color: theme.text }}>
                                                {memberName}
                                                {isExisting && <span className="ml-2 text-xs italic text-gray-400">(Already in team)</span>}
                                            </h3>
                                            <p className="text-sm" style={{ color: theme.secondary }}>
                                                {memberEmail}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="text-right flex flex-col items-end gap-1">
                                        <div className="flex items-center gap-2 text-xs" style={{ color: theme.secondary }}>
                                            <Shield size={12} />
                                            <span className="capitalize">{memberRole.replace('_', ' ')}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-xs" style={{ color: theme.primaryLight }}>
                                            <Briefcase size={12} />
                                            <span>{member.work_role || "Employee"}</span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>

                {/* Footer */}
                <div className="mt-6 flex justify-end gap-4 border-t border-white/10 pt-6">
                    <button
                        type="button"
                        onClick={handleClose}
                        className="rounded-xl px-6 py-3 font-semibold transition-all hover:bg-white/5"
                        style={{ color: theme.text }}
                        disabled={loading}
                    >
                        Cancel
                    </button>

                    <button
                        onClick={handleSubmit}
                        disabled={loading || selectedIds.length === 0}
                        className="flex items-center gap-2 rounded-xl px-6 py-3 font-bold text-white transition-all hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                        style={{ background: theme.primary }}
                    >
                        {loading ? (
                            <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/20 border-t-white" />
                        ) : (
                            "Add Selected Members"
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddTeamMembersModal;
