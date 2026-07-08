import {

    useEffect,

    useState

} from "react";

import { updateWorkspace } from "@/services/workspace.service";

export const useWorkspaceSettings = (

    workspace,

    refreshWorkspace

) => {

    const [name, setName] =
        useState("");

    const [description, setDescription] =
        useState("");

    const [logo, setLogo] =
        useState(null);

    const [preview, setPreview] =
        useState("");

    const [saving, setSaving] =
        useState(false);

    const [error, setError] =
        useState("");

    /*
    =====================================================
    LOAD WORKSPACE
    =====================================================
    */

    useEffect(() => {

        if (!workspace) return;

        setName(

            workspace.name || ""

        );

        setDescription(

            workspace.description || ""

        );

        setPreview(

            workspace.logo || ""

        );

        setLogo(null);

    }, [workspace]);

    /*
    =====================================================
    SELECT LOGO
    =====================================================
    */

    const selectLogo = (file) => {

        if (!file) return;

        setLogo(file);

        setPreview(

            URL.createObjectURL(file)

        );

    };

    /*
    =====================================================
    SAVE
    =====================================================
    */

    const saveWorkspace = async () => {

        try {

            setSaving(true);

            setError("");

            const formData = new FormData();

            formData.append(

                "name",

                name.trim()

            );

            formData.append(

                "description",

                description.trim()

            );

            if (logo) {

                formData.append(

                    "logo",

                    logo

                );

            }

            await updateWorkspace(

                workspace.id,

                formData

            );

            if (refreshWorkspace) {

                await refreshWorkspace();

            }

        }

        catch (err) {

            console.error(err);

            setError(

                err.response?.data?.message ||

                "Failed to update workspace."

            );

        }

        finally {

            setSaving(false);

        }

    };

    return {

        name,

        setName,

        description,

        setDescription,

        preview,

        selectLogo,

        saveWorkspace,

        saving,

        error

    };

};