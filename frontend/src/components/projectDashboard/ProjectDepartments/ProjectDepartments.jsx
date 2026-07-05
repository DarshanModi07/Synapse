import { useState } from "react";

import DepartmentCard from "./DepartmentCard";
import AssignDepartmentModal from "./AssignDepartmentModal";
import RemoveDepartmentDialog from "./RemoveDepartmentDialog";

import { Plus } from "lucide-react";

import { theme } from "@/lib/theme";

const ProjectDepartments = ({

    departments,

    projectId,

    refresh

}) => {

    const [assignOpen, setAssignOpen] =
        useState(false);

    const [removeOpen, setRemoveOpen] =
        useState(false);

    const [selectedDepartment, setSelectedDepartment] =
        useState(null);

    return (

        <section className="space-y-6">

            <div className="flex items-center justify-between">

                <div>

                    <h2
                        className="text-2xl font-bold"
                        style={{
                            color: theme.text
                        }}
                    >
                        Departments
                    </h2>

                    <p
                        style={{
                            color: theme.secondary
                        }}
                    >
                        Departments assigned to this project.
                    </p>

                </div>

                <button

                    onClick={() =>
                        setAssignOpen(true)
                    }

                    className="flex items-center gap-2 rounded-xl px-5 py-3"

                    style={{
                        background:
                            theme.primary,
                        color: "#fff"
                    }}

                >

                    <Plus size={18}/>

                    Assign Department

                </button>

            </div>

            <div className="grid gap-6 lg:grid-cols-2">

                {

                    departments.map(

                        department => (

                            <DepartmentCard

                                key={department.id}

                                department={department}

                                onRemove={() => {

                                    setSelectedDepartment(
                                        department
                                    );

                                    setRemoveOpen(true);

                                }}

                            />

                        )

                    )

                }

            </div>

            <AssignDepartmentModal

                open={assignOpen}

                projectId={projectId}

                onClose={() =>
                    setAssignOpen(false)
                }

                onSuccess={() => {

                    refresh();

                    setAssignOpen(false);

                }}

            />

            <RemoveDepartmentDialog

                open={removeOpen}

                department={selectedDepartment}

                projectId={projectId}

                onClose={() => {

                    setRemoveOpen(false);

                    setSelectedDepartment(null);

                }}

                onSuccess={() => {

                    refresh();

                    setRemoveOpen(false);

                    setSelectedDepartment(null);

                }}

            />

        </section>

    );

};

export default ProjectDepartments;