"use server"

import { getAccessToken } from "@/utils/serve-only"

export const DeleteFolderAction = async (folderId: number) => {

    const token = await getAccessToken();
    const url = `${process.env.API_URL}/api/folders/${folderId}`;
    const options = {
        method: "DELETE",
        headers: {
            "Authorization": `Bearer ${token}`,
        },
    }
    try {
        const response = await fetch(url, options);
        const { success, message } = await response.json()

        return { success, message };
    } catch {
        return { success: false, message: "Error Happened!" };
    }
}
