import {
    Mail,
    Shield,
    Briefcase
} from "lucide-react";

import { theme } from "@/lib/theme";

const badgeColor = {

    owner:
        "bg-violet-500/20 text-violet-300",

    manager:
        "bg-blue-500/20 text-blue-300",

    team_lead:
        "bg-amber-500/20 text-amber-300",

    employee:
        "bg-green-500/20 text-green-300"

};

const MemberCard = ({

    member,

    children

}) => {

    return (

        <div

            className="rounded-3xl p-6"

            style={{

                background:
                    "rgba(13,13,18,.55)",

                border:
                    "1px solid rgba(167,139,250,.10)",

                backdropFilter:
                    "blur(24px)"

            }}

        >

            <div className="flex items-center gap-4">

                <img

                    src={

                        member.avatar ||

                        `https://ui-avatars.com/api/?name=${member.name}`

                    }

                    alt={member.name}

                    className="h-14 w-14 rounded-full"

                />

                <div>

                    <h3

                        className="text-lg font-semibold"

                        style={{

                            color: theme.text

                        }}

                    >

                        {member.name}

                    </h3>

                    <div

                        className="mt-1 flex items-center gap-2"

                        style={{

                            color: theme.secondary

                        }}

                    >

                        <Mail size={15} />

                        {member.email}

                    </div>

                </div>

            </div>

            <div className="mt-6 space-y-4">

                <div className="flex items-center justify-between">

                    <div className="flex items-center gap-2">

                        <Shield size={16} />

                        <span
                            style={{
                                color: theme.secondary
                            }}
                        >

                            System Role

                        </span>

                    </div>

                    <span

                        className={`rounded-full px-3 py-1 text-xs font-medium ${badgeColor[member.sys_role]}`}

                    >

                        {member.sys_role}

                    </span>

                </div>

                <div className="flex items-center justify-between">

                    <div className="flex items-center gap-2">

                        <Briefcase size={16} />

                        <span
                            style={{
                                color: theme.secondary
                            }}
                        >

                            Work Role

                        </span>

                    </div>

                    <span
                        style={{
                            color: theme.text
                        }}
                    >

                        {

                            member.work_role ||

                            "-"

                        }

                    </span>

                </div>

            </div>

            {

                children && (

                    <div className="mt-8">

                        {children}

                    </div>

                )

            }

        </div>

    );

};

export default MemberCard;