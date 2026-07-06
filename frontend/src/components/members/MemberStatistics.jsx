import {
    Users,
    Shield,
    Briefcase,
    User
} from "lucide-react";

import { theme } from "@/lib/theme";

const StatCard = ({
    icon,
    title,
    value
}) => (

    <div
        className="rounded-3xl p-6"
        style={{
            background: "rgba(13,13,18,.55)",
            border: "1px solid rgba(167,139,250,.10)",
            backdropFilter: "blur(24px)"
        }}
    >

        <div className="flex items-center justify-between">

            <div>

                <p
                    className="text-sm"
                    style={{
                        color: theme.secondary
                    }}
                >

                    {title}

                </p>

                <h2
                    className="mt-3 text-4xl font-bold"
                    style={{
                        color: theme.text
                    }}
                >

                    {value}

                </h2>

            </div>

            <div
                className="flex h-14 w-14 items-center justify-center rounded-2xl"
                style={{
                    background: "rgba(124,58,237,.15)"
                }}
            >

                {icon}

            </div>

        </div>

    </div>

);

const MemberStatistics = ({
    members = []
}) => {

    const managers =
        members.filter(
            member =>
                member.sys_role === "manager"
        ).length;

    const teamLeads =
        members.filter(
            member =>
                member.sys_role === "team_lead"
        ).length;

    const employees =
        members.filter(
            member =>
                member.sys_role === "employee"
        ).length;

    return (

        <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

            <StatCard

                title="Total Members"

                value={members.length}

                icon={
                    <Users
                        color={theme.primaryLight}
                        size={28}
                    />
                }

            />

            <StatCard

                title="Managers"

                value={managers}

                icon={
                    <Shield
                        color={theme.primaryLight}
                        size={28}
                    />
                }

            />

            <StatCard

                title="Team Leads"

                value={teamLeads}

                icon={
                    <Briefcase
                        color={theme.primaryLight}
                        size={28}
                    />
                }

            />

            <StatCard

                title="Employees"

                value={employees}

                icon={
                    <User
                        color={theme.primaryLight}
                        size={28}
                    />
                }

            />

        </section>

    );

};

export default MemberStatistics;