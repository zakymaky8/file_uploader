"use server"

import { getAccessToken } from "@/utils/serve-only"

export const RenameFolderAction = async (folderId: number, formdata: FormData) => {

    const token = await getAccessToken();
    const url = `${process.env.API_URL}/api/folders/${folderId}`;
    const options = {
        method: "PUT",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "Application/json"
        },
        body: JSON.stringify({ folder: formdata.get("folder") as string })
    }
    try {
        const response = await fetch(url, options);
        const { success, message } = await response.json()
        return { success, message };
    } catch {
        return { success: false, message: "Error Happened!" };
    }
}
