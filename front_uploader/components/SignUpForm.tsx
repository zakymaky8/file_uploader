/* eslint-disable react-hooks/exhaustive-deps */
"use client"

import { createAccountAction } from "@/actions/authActions"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useActionState, useEffect, useState } from "react"
import InlineLoading from "./InlineLoading"

const SignUpForm = () => {
    const router = useRouter()
    const [status, setStatus] = useState<"intial" | "pending" | "failure" | "success">("intial");
    const [state, action] = useActionState(createAccountAction, { success: "", message: "", error: "" })

    useEffect(() => {
        if (state.success === true) {
            setStatus("success");
            router.push("/signin")
            state.success = ""
        }

        if (typeof state.success === "boolean" ) {
            setStatus(state.success ? "success" : "failure")
        }
    }, [state])

  return (
    <div style={{background: '#0e0f10', color: 'rgb(93, 250, 250)'}} className="signup">

        <form action={action} method="POST">
            <h2 className="text-[28px]">Register</h2>

            <div>
                <label htmlFor="fname">First Name: </label>
                <input
                type="text"
                    name="firstname"
                    id="fname"
                    required
                    className="focus:outline-none"
                    placeholder="first name"
                />
            </div>
            <div>
                <label htmlFor="lname">Last Name: </label>
                <input
                    type="text"
                    name="lastname"
                    id="lname"
                    required
                    className="focus:outline-none"
                    placeholder="last name"
                />
            </div>
            <div>
                <label htmlFor="uname">Username: </label>
                <input
                    type="text"
                    name="username"
                    id="uname"
                    required
                    className="focus:outline-none"
                    placeholder="username"
                />
            </div>

            <div>
                <label htmlFor="pwd">Set Your Password: </label>
                <input
                    type="password"
                    name="password"
                    id="pwd"
                    required
                    className="focus:outline-none"
                    placeholder="password"
                />
            </div>

            <div>
                <label htmlFor="cpwd">Confirm Password: </label>
                <input
                    type="password"
                    name="confirm_password"
                    id="cpwd"
                    required
                    className="focus:outline-none"
                    placeholder="confirm password"
                />
            </div>
            <ul>
            {(state.success === false && state.error) &&
                state.error.map((err: {message: string}, i: number) => {
                    return <li key={i}>{err.message}</li>
                })
            }
            </ul>
            {state.message}
            <button disabled={status==="pending"} type="submit" className="hover:opacity-60 cursor-pointer relative">
                { status === "pending" ? <InlineLoading /> : "Register"}
            </button>
        </form>
        <div>
            <div>Already have an account? <Link className="opacity-60 hover:opacity-100" href="/signin">Log in</Link></div><br />
        </div>
</div>
  )
}

export default SignUpForm