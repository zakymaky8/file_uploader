"use server"

import { getAccessToken } from "@/utils/serve-only"

export type TFolderCreationState = {
    success: boolean,
    message: string,
    error?: string,
    redirectUrl?: string | null
}

export const CreateFolderAction = async (parentId: string, formdata: FormData) => {

    const folderData = {
        folder: formdata.get("folder") as string,
        parent_folder_id: parentId
    }
    const token = await getAccessToken();
    const url = `${process.env.API_URL}/api/folders?parent_folder_id=${parentId ? parentId : ""}`;
    const options = {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "Application/json"
        },
        body: JSON.stringify(folderData)
    }
    try {
        const response = await fetch(url, options);
        const { success, message } = await response.json()

        return { success, message };
    } catch {
        return { success: false, message: "Error Happened!" };
    }
}
