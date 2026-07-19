import { useParams } from "react-router-dom";

import { theme } from "@/lib/theme";

import { useWorkspace } from "@/hooks/useWorkspace";

import SettingsHeader from "@/components/owner/settings/SettingsHeader";
import WorkspaceInfoCard from "@/components/owner/settings/WorkspaceInfoCard";

const SettingsPage = () => {
    const { slug } = useParams();

    const {

        workspace,

        loading,

        error,

        refresh

    } = useWorkspace(slug);

    if (loading) {

        return (

            <div className="flex h-[80vh] items-center justify-center">

                <div

                    className="h-14 w-14 animate-spin rounded-full border-4 border-t-transparent"

                    style={{

                        borderColor: "rgba(167,139,250,.25)",

                        borderTopColor: theme.primary

                    }}

                />

            </div>

        );

    }

    if (error) {

        return (

            <div

                className="flex h-[80vh] items-center justify-center"

                style={{

                    color: theme.text

                }}

            >

                {error}

            </div>

        );

    }

    if (!workspace) {

        return (

            <div

                className="flex h-[80vh] items-center justify-center"

                style={{

                    color: theme.text

                }}

            >

                Workspace not found.

            </div>

        );

    }

    return (

        <main className="space-y-8">

            <SettingsHeader />

            <WorkspaceInfoCard

                workspace={workspace}

                refreshWorkspace={refresh}

            />

        </main>

    );
};

export default SettingsPage;