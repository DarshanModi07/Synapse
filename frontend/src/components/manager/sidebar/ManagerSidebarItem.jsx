import { NavLink, useParams } from "react-router-dom";

import { theme } from "@/lib/theme";

const ManagerSidebarItem = ({

    title,

    icon: Icon,

    path

}) => {

    const { slug } = useParams();

    const href =
        path === ""
            ? `/workspace/${slug}/manager`
            : `/workspace/${slug}/manager/${path}`;

    return (

        <NavLink

            to={href}

            end={path === ""}

            className={({ isActive }) =>

                `group flex items-center gap-3 rounded-xl px-4 py-3 transition-all duration-200 ${

                    isActive

                        ? "bg-violet-600 text-white"

                        : "hover:bg-[#1A1826]"

                }`

            }

        >

            {({ isActive }) => (

                <>

                    <Icon

                        size={20}

                        strokeWidth={2}

                        style={{

                            color:

                                isActive

                                    ? "#FFFFFF"

                                    : theme.secondary

                        }}

                    />

                    <span

                        className="text-sm font-medium"

                        style={{

                            color:

                                isActive

                                    ? "#FFFFFF"

                                    : theme.secondary

                        }}

                    >

                        {title}

                    </span>

                </>

            )}

        </NavLink>

    );

};

export default ManagerSidebarItem;