/* eslint-disable react-hooks/exhaustive-deps */
"use client"

import { useActionState, useEffect, useState } from "react"
import DeleteButton from "./DeleteButton"
import { TFile } from "@/utils/types"
import { TFolderCreationState } from "@/actions/create-folder"
import InlineLoading from "./InlineLoading"
import { RenameFileAction } from "@/actions/update-file"
import { useRouter } from "next/navigation"


const MoreOnFile = ({file}: { file: TFile}) => {
    const [isMenuOn, setIsMenuOn] = useState(false);
    const [isEditOn, setIsEditOn] = useState(false)
    const [status, setStatus] = useState< "init" | "pending" | "success" | "fail">("init")

    const router = useRouter();

    const actionWrapper = async (prev: TFolderCreationState, formdata: FormData) => {
        return RenameFileAction(file.files_id, formdata);
    }

    const [ state, formRenameAction ] = useActionState(actionWrapper, { success: "", message: "" });

    useEffect(() => {
        if (state.success === true) {
            setIsEditOn(false)
            setIsMenuOn(false)
            setStatus("success")
            router.refresh()
        }
        if (state.success === false) {
            setStatus("fail")
        }
    }, [state])


    const fileLink = JSON.parse(file.sharableFileUrl).secure_url
  return (
    <td className="more-on-file-cont">
        <button
            onClick={() => {
                setIsMenuOn(PREV => !PREV)
            }}
            className="more-on-file cursor-pointer"
            style={{width: "20px"}}
            > ⋮
        </button>

        <div
            onClick={()=> {
                setIsMenuOn(false)
                setIsEditOn(false)
            }}
            className={`
            fixed right-0 top-0 w-screen z-10
                min-h-screen bg-[black] opacity-50
                ${(isMenuOn || isEditOn) ? "block" : "hidden"}
            `}
        ></div>

        <form
            action={formRenameAction}
            onSubmit={() => setStatus("pending")}
            className="gap-2 min-w-[290px] flex-wrap h-[90px] fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 items-center"
        style={{padding: "8px", display: `${isEditOn ? "flex" : "none"}`, border: "1px solid white", background: "black"}}
            >
            <input
                type="text"
                name="filename"
                defaultValue={file.filename ?? ""}
                className="border-b-2 border-white rounded-[8px] focus:outline-none text-[12px]"
                placeholder="change name"
                required
                style={{padding: "4px"}}
            />
            <button
                type="submit"
                className="rounded-[3px] cursor-pointer hover:opacity-80 relative"
                style={{padding: "6px", background: "#022c1d", width: "60px"}}
                >{ status === "pending" ? <InlineLoading /> : "save"}
            </button>
        </form>

        <ul
            className="more-on-file-menu z-20 h-[85px]
                       rounded-[10px] flex justify-center gap-16
                       fixed top-1/2 left-1/2 -translate-x-1/2
                      -translate-y-1/2  items-center"
            style={{padding: "15px", display: `${isMenuOn ? "flex" : "none"}`, background: "#093624", width: "200px"}}>

            <li>
                <button className="text-[24px] cursor-pointer hover:opacity-60" style={{background: "none"}}
                >📝</button>
            </li>
            <li>
            <button
                    className=" text-[24px] cursor-pointer hover:opacity-60"
                    style={{background: "none"}}
                    onClick={() => {
                        setIsEditOn(prev => !prev)
                        setIsMenuOn(false)
                    }}
                    >✏️
            </button>
            </li>
            <li title="download" className="text-[24px] cursor-pointer hover:opacity-60" style={{background: "none"}}><a download={"fu"+file.filename} href={fileLink}>📥</a></li>
            <li>
                <DeleteButton fileId={file.files_id} setIsMenuOn={setIsMenuOn} />
            </li>
        </ul>
    </td>
  )
}

export default MoreOnFile