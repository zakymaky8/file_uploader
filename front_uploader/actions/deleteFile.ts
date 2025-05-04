"use server"

import { getAccessToken } from "@/utils/serve-only"

export const DeleteFileAction = async (fileId: number) => {

    const token = await getAccessToken();
    const url = `${process.env.API_URL}/api/folders/files/${fileId}`;
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
