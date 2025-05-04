"use server"

import { getAccessToken } from "@/utils/serve-only"

export type TFolderCreationState = {
    success: boolean,
    message: string,
    error?: string,
    redirectUrl?: string | null
}

export const CreateFileAction = async (parentId: string, formdata: FormData) => {

    const token = await getAccessToken();
    const url = `${process.env.API_URL}/api/folders/files?parent_folder_id=${parentId ? parentId : ""}`;
    const options = {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${token}`,
        },
        body: formdata
    }
    try {
        const response = await fetch(url, options);
        const { success, message } = await response.json()

        return { success, message };
    } catch {
        return { success: false, message: "Error Happened!" };
    }
}
