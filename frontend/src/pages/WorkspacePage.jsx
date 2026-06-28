import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getWorkspace } from "@/services/workspace.service";
import EmployeeDashboard from "@/pages/EmployeeDashboard";
import ManagerDashboard from "@/pages/ManagerDashboard";
import OwnerDashboard from "@/pages/OwnerDashboard";
import TeamLeadDashboard from "@/pages/TeamLeadDashboard";

const WorkspacePage = () => {

    const { slug } = useParams();

    const [workspace, setWorkspace] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        const fetchWorkspace = async () => {

            try {

                const response = await getWorkspace(slug);

                setWorkspace(response.data);

            }
            catch (err) {

                console.log(err);

            }
            finally {

                setLoading(false);

            }

        };

        fetchWorkspace();

    }, [slug]);

    if (loading) {
        return <div>Loading...</div>;
    }

    const role = workspace?.memberRole?.sysRole;

    return (
        <>
            {role === "owner" && <OwnerDashboard />}

            {role === "manager" && <ManagerDashboard />}

            {role === "team_lead" && <TeamLeadDashboard />}

            {role === "employee" && <EmployeeDashboard />}
        </>
    );
};

export default WorkspacePage;