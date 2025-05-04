/* eslint-disable react-hooks/exhaustive-deps */
"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { FormEvent, useEffect, useState } from "react";

const Search = () => {
    const [key, setKey] = useState("");
    const params = useSearchParams()
    const router = useRouter()

    const urlParams = new URLSearchParams(params.toString())

    useEffect(() => {
      if (key === "") {
        urlParams.set("search", "");
        router.replace(`?${urlParams.toString()}`, {scroll: false})
      }
    }, [key])
  
    const handleSubmit = (e:FormEvent) => {
      e.preventDefault()
      urlParams.set("search", key!)
      const allParams = urlParams.toString()
      router.push(`?${allParams}`, { scroll: false })
    }
  return (
    <form className="searchform" onSubmit={handleSubmit}>
        <div className="search flex">
            <input
                type="search"
                name="search"
                value={key}
                id="search"
                onChange={(e) => setKey(e.target.value)}
                className="w-[150px] p-2 placeholder:text-[12px] focus:outline-none focus:border-[1px] focus:border-white"
                placeholder="search in items" />
            <button
                type="submit"
                className="bg-black hover:bg-gray-950 cursor-pointer"
                style={{padding: "4px", height: "35px", width: "40px"}}
                    >👁️
            </button>
        </div>
    </form>
  )
}

export default Search