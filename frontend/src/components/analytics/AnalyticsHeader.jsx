import { RefreshCcw } from "lucide-react";

import { theme } from "@/lib/theme";

const AnalyticsHeader = ({

    refresh

}) => {

    return (

        <section className="flex items-center justify-between">

            <div>

                <h1

                    className="text-3xl font-bold"

                    style={{

                        color: theme.text

                    }}

                >

                    AI Analytics

                </h1>

                <p

                    className="mt-2"

                    style={{

                        color: theme.secondary

                    }}

                >

                    AI powered insights, health monitoring and predictive analytics for your project.

                </p>

            </div>

            <button

                onClick={refresh}

                className="flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-3 text-white transition hover:bg-violet-500"

            >

                <RefreshCcw size={18} />

                Refresh

            </button>

        </section>

    );

};

export default AnalyticsHeader;