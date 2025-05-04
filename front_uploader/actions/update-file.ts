"use server"

import { getAccessToken } from "@/utils/serve-only"

export type TFolderCreationState = {
    success: boolean,
    message: string,
    error?: string,
    redirectUrl?: string | null
}

export const RenameFileAction = async (fileId: number, formdata: FormData) => {

    const token = await getAccessToken();
    const url = `${process.env.API_URL}/api/folders/files/${fileId}`;
    const options = {
        method: "PUT",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "Application/json"
        },
        body: JSON.stringify({ filename: formdata.get("filename") as string })
    }
    try {
        const response = await fetch(url, options);
        const { success, message } = await response.json()
        return { success, message };
    } catch {
        return { success: false, message: "Error Happened!" };
    }
}
