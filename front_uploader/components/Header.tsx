"use client"

import Image from "next/image"
import { useState } from "react"
import signout from "../public/signout.svg"
import { SignOutAction } from "@/actions/authActions"
import Search from "./Search"

const Header = () => {
    const [ profPrefOn, setProfPrefOn ] = useState(false)
  return (
    <header>

        <h1 className="text-[28px] text-black font-[1000]">File Uploader 📤</h1>

        <Search />

        <div className="profile">

            <button
                onClick={() => setProfPrefOn(prev => !prev)}
                id="profile-icon"
                className="mb-2"
                >{"Z"}
            </button>

            <div
                onClick={()=>setProfPrefOn(false)}
                className={`
                    fixed right-0 top-0 w-screen z-10
                    min-h-screen bg-[black] opacity-30
                    ${profPrefOn ? "block" : "hidden"}
                `}
            ></div>

            <ul
                id="prof-pref"
                className="bg-[#6c7b6d] rounded-[15px] z-20"
                style={{display: `${profPrefOn ? "flex" : "none"}`}}
                >
                <li>📝 Profile Detail</li>
                <li>⚙️ Setting</li>
                <div className="flex gap-1">
                    <Image src={signout} alt="Sign Out" height={20} width={20}/>
                    <button title="logout" onClick={SignOutAction} className="hover:opacity-70">Sign Out</button>
                </div>
            </ul>
        </div>
    </header>
  )
}

export default Header