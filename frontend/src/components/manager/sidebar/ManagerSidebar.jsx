import managerNavigation from "@/constants/managerNavigation";

import { theme } from "@/lib/theme";

import ManagerSidebarItem from "./ManagerSidebarItem";

const ManagerSidebar = () => {

    return (

        <aside

            className="flex h-full w-72 flex-col border-r px-5 py-6"

            style={{

                background: theme.surface,

                borderColor: theme.border

            }}

        >

            {/* Header */}

            <div className="mb-8">

                <h2

                    className="text-2xl font-bold"

                    style={{

                        color: theme.text

                    }}

                >

                    Manager Panel

                </h2>

                <p

                    className="mt-1 text-sm"

                    style={{

                        color: theme.muted

                    }}

                >

                    Department Management

                </p>

            </div>

            {/* Navigation */}

            <nav className="flex flex-col gap-2">

                {

                    managerNavigation.map(

                        (item) => (

                            <ManagerSidebarItem

                                key={item.title}

                                title={item.title}

                                icon={item.icon}

                                path={item.path}

                            />

                        )

                    )

                }

            </nav>

        </aside>

    );

};

export default ManagerSidebar;