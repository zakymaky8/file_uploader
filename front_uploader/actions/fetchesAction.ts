"use server"

import { getAccessToken } from "@/utils/serve-only"

export const FetchFolders = async (parentId: string | number | null, search: string="") => {

    const token = await getAccessToken();
    const url = `${process.env.API_URL}/api/folders${parentId ? "?parent_folder_id="+parentId + "&search="+search : "?search="+search}`;
    const options = {
        method: "GET",
        headers: {
            "Content-Type": "Application/json",
            "authorization": `Bearer ${token}`
        },
    }
    try {
        const response = await fetch(url, options);
        const { success, message, data } = await response.json()

        return { success, message, data };
    } catch {
        return { success: false, message: "Error Happened!", data: null };
    }
}




export const FetchPaths = async (parentId: string) => {

    const token = await getAccessToken();
    const url = `${process.env.API_URL}/api/folders/path${parentId ? "?parent_folder_id="+parentId : ""}`;
    const options = {
        method: "GET",
        headers: {
            "Content-Type": "Application/json",
            "authorization": `Bearer ${token}`
        },
    }
    try {
        const response = await fetch(url, options);
        const { success, message, data } = await response.json()

        return { success, message, data };
    } catch {
        return { success: false, message: "Error Happened!", data: null };
    }
}
