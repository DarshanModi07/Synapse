import { Settings } from "lucide-react";

import { theme } from "@/lib/theme";

const SettingsHeader = () => {

    return (

        <div className="flex items-center justify-between">

            <div>

                <div className="flex items-center gap-3">

                    <div
                        className="rounded-xl p-3"
                        style={{
                            background: "rgba(124,58,237,.15)"
                        }}
                    >

                        <Settings
                            size={26}
                            color={theme.primary}
                        />

                    </div>

                    <div>

                        <h1
                            className="text-3xl font-bold"
                            style={{
                                color: theme.text
                            }}
                        >

                            Workspace Settings

                        </h1>

                        <p
                            className="mt-1"
                            style={{
                                color: theme.secondary
                            }}
                        >

                            Update your workspace information and branding.

                        </p>

                    </div>

                </div>

            </div>

        </div>

    );

};

export default SettingsHeader;