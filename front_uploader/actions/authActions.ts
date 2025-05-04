"use server"

import { cookies } from "next/headers"

type TFormState = {
    success: boolean,
    message?: string,
    error?: string | string[],

}

export const createAccountAction = async (prev:TFormState, formdata:FormData) => {
    const url = `${process.env.API_URL}/api/register`

    const userData = {
        firstname: formdata.get("firstname") as string,
        lastname: formdata.get("lastname") as string,
        username: formdata.get("username") as string,
        password: formdata.get("password") as string,
        confirm_password: formdata.get("confirm_password") as string,
    }

    try {
        const res = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "Application/json",
            },
            body: JSON.stringify(userData)
        })

        const { success, message, error } = await res.json();
        return {success, message, error}
    } catch {
        return {
            success: false,
            message: "Failed to fetch",
        }
    }
}


export const SignInAction = async (prev:TFormState, formdata:FormData) => {
    // await new Promise((resolve, reject) => setTimeout(resolve, 5000))
    const userData = {
        username: formdata.get("username") as string,
        password: formdata.get("password") as string,
    }

    const url = `${process.env.API_URL}/api/signin`
    const options = {
        method: "POST",
        headers: {
            "content-type": "Application/json",
        },
        body: JSON.stringify(userData)
    }

    try {
        const res = await fetch(url, options)

        const { success, message, token } = await res.json();
        (await cookies()).set("token", token, {
            httpOnly: true,
            sameSite: "lax",
            path: "/",
        })
        return {success, message};
    } catch {
        return {
            success: false,
            message: "Failed to fetch",
        }
    }
}


export const SignOutAction = async () => {
    (await cookies()).delete("token")
}