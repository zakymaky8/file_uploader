import { cookies } from "next/headers";
import "server-only";


export const getAccessToken = async () => {
    return (await cookies()).get("token")?.value
}