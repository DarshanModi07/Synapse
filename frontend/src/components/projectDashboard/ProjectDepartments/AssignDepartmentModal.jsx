import {

    useEffect,

    useMemo,

    useState

} from "react";

import {

    Search,

    Building2,

    Check

} from "lucide-react";

import {

    getAvailableDepartments,

    assignDepartment

} from "@/services/projectDashboard.service";

import { theme } from "@/lib/theme";

const AssignDepartmentModal = ({

    open,

    projectId,

    onClose,

    onSuccess

}) => {

    const [departments, setDepartments] =
        useState([]);

    const [selected, setSelected] =
        useState(null);

    const [loading, setLoading] =
        useState(false);

    const [assigning, setAssigning] =
        useState(false);

    const [search, setSearch] =
        useState("");

    useEffect(() => {

        if (!open) return;

        fetchDepartments();

    }, [open]);

    const fetchDepartments = async () => {

        try {

            setLoading(true);

            const response =
                await getAvailableDepartments(
                    projectId
                );

            setDepartments(response.data);

        }

        catch (err) {

            console.error(err);

        }

        finally {

            setLoading(false);

        }

    };

    const filteredDepartments =
        useMemo(() => {

            return departments.filter(

                department =>

                    department.name

                        .toLowerCase()

                        .includes(

                            search.toLowerCase()

                        )

            );

        }, [departments, search]);

    const handleAssign = async () => {

        if (!selected) return;

        try {

            setAssigning(true);

            await assignDepartment({

                projectId,

                departmentId: selected

            });

            onSuccess();

        }

        catch (err) {

            console.error(err);

        }

        finally {

            setAssigning(false);

        }

    };

    if (!open) return null;

    return (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">

            <div

                className="w-full max-w-2xl rounded-3xl p-6"

                style={{

                    background: theme.card,

                    border: "1px solid rgba(255,255,255,.08)"

                }}

            >

                <h2

                    className="text-2xl font-bold"

                    style={{

                        color: theme.text

                    }}

                >

                    Assign Department

                </h2>

                <div

                    className="mt-5 flex items-center rounded-xl px-4"

                    style={{

                        background: "rgba(255,255,255,.05)"

                    }}

                >

                    <Search

                        size={18}

                        color={theme.secondary}

                    />

                    <input

                        value={search}

                        onChange={e =>

                            setSearch(

                                e.target.value

                            )

                        }

                        placeholder="Search Department..."

                        className="w-full bg-transparent p-4 outline-none"

                    />

                </div>

                <div className="mt-6 max-h-[400px] space-y-3 overflow-y-auto">

                    {

                        loading ?

                        (

                            <p

                                style={{

                                    color: theme.secondary

                                }}

                            >

                                Loading...

                            </p>

                        )

                        :

                        filteredDepartments.map(

                            department => (

                                <button

                                    key={department.id}

                                    onClick={() =>

                                        setSelected(

                                            department.id

                                        )

                                    }

                                    className="flex w-full items-center justify-between rounded-2xl p-5 transition"

                                    style={{

                                        background:

                                            selected === department.id

                                                ? "rgba(124,58,237,.18)"

                                                : "rgba(255,255,255,.03)",

                                        border:

                                            selected === department.id

                                                ? "1px solid #7C3AED"

                                                : "1px solid rgba(255,255,255,.05)"

                                    }}

                                >

                                    <div className="flex items-center gap-4">

                                        <Building2

                                            color={theme.primaryLight}

                                        />

                                        <div className="text-left">

                                            <h3

                                                style={{

                                                    color: theme.text

                                                }}

                                            >

                                                {department.name}

                                            </h3>

                                            <p

                                                className="text-sm"

                                                style={{

                                                    color: theme.secondary

                                                }}

                                            >

                                                {

                                                    department.manager?.name ||

                                                    "No Manager"

                                                }

                                            </p>

                                        </div>

                                    </div>

                                    {

                                        selected === department.id &&

                                        <Check

                                            color="#22C55E"

                                        />

                                    }

                                </button>

                            )

                        )

                    }

                </div>

                <div className="mt-8 flex justify-end gap-3">

                    <button

                        onClick={onClose}

                        className="rounded-xl px-5 py-3"

                    >

                        Cancel

                    </button>

                    <button

                        disabled={

                            !selected ||

                            assigning

                        }

                        onClick={handleAssign}

                        className="rounded-xl px-6 py-3"

                        style={{

                            background: theme.primary,

                            color: "#fff"

                        }}

                    >

                        {

                            assigning ?

                            "Assigning..."

                            :

                            "Assign"

                        }

                    </button>

                </div>

            </div>

        </div>

    );

};

export default AssignDepartmentModal;