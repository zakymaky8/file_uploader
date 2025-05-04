/* eslint-disable react-hooks/exhaustive-deps */
"use client"

import { SignInAction } from "@/actions/authActions"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useActionState, useEffect, useState } from "react"
import InlineLoading from "./InlineLoading"

const LoginForm = () => {
    const router = useRouter();
    const [status, setStatus] = useState<"intial" | "pending" | "failure" | "success">("intial");
    const [state, action] = useActionState(SignInAction, { success: "", message: "" })

    useEffect(() => {
        if (state.success === true) {
            setStatus("success");
            router.push("/")
            state.success = ""
        }

        if (typeof state.success === "boolean" ) {
            setStatus(state.success ? "success" : "failure")
        }

    }, [state])

  return (
    <div
        className="login"
        style={{background: '#0e0f10', color: 'rgb(93, 250, 250)'}}>

        <form action={action} className="flex flex-col gap-[18px]" onSubmit={() => setStatus("pending")}>
            <h2 className="text-[28px]">Log in</h2>

            <div>
                <label htmlFor="uname">Username: </label>
                <input
                    type="text"
                    name="username"
                    id="uname"
                    required
                    placeholder="username"
                    className="focus:outline-none"
                />
            </div>

            <div>
                <label htmlFor="pwd">Password: </label>
                <input
                    type="password"
                    name="password"
                    id="pwd"
                    required
                    placeholder="password"
                    className="focus:outline-none"
                />
            </div>

            {
                typeof state.success === "boolean"
            }
            <button disabled={status==="pending"} type="submit" className="hover:opacity-60 cursor-pointer relative">
                { status === "pending" ? <InlineLoading /> : "Login"}
            </button>

            {typeof state.success === "boolean" &&
                <span className={`italic text-[13px] ${state.success ? "text-green-600" : "text-red-600"} self-center` }
                    >{state.message}
                </span>}
        </form>
        <div>
            <div>Not Registered Yet? <Link className="opacity-60 hover:opacity-100" href="/register">Register</Link></div><br/>
        </div>
    </div>
  )
}

export default LoginForm