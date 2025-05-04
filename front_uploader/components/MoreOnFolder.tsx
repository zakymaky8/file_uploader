/* eslint-disable react-hooks/exhaustive-deps */
"use client"

import { TFolderCreationState } from "@/actions/create-folder";
import { RenameFolderAction } from "@/actions/updateFolder";
import { TFolder } from "@/utils/types";
import { useRouter } from "next/navigation";
import { useActionState, useEffect, useState } from "react"
import InlineLoading from "./InlineLoading";
import { DeleteFolderAction } from "@/actions/delete-folder";

const MoreOnFolder = ({folder}: { folder: TFolder }) => {

    const [isMenuOn, setIsMenuOn] = useState(false)
    const [isEditOn, setIsEditOn] = useState(false);
    const [status, setStatus] = useState< "init" | "pending" | "success" | "fail">("init")

    const router = useRouter();

    const actionWrapper = async (prev: TFolderCreationState, formdata: FormData) => {
        return RenameFolderAction(folder.folders_id, formdata);
    }

    const [ renameState, formRenameAction ] = useActionState(actionWrapper, { success: "", message: "" });

    useEffect(() => {
        if (renameState.success === true) {
            setIsEditOn(false)
            setIsMenuOn(false)
            setStatus("success")
            router.refresh()
        }
        if (renameState.success === false) {
            setStatus("fail")
        }
    }, [renameState])


    async function handleDelete() {
        setStatus("pending");
        const {message, success} = await DeleteFolderAction(folder.folders_id);
        setStatus(success ? "success" : "fail");
        if (!success) {
            alert(message)
        }
        if (success) {
            router.refresh()
            setIsMenuOn(false)
        }

    }

  return (
    <td className="more-cont">
        <button
        onClick={() => {
            setIsMenuOn(PREV => !PREV)
        }}
            className="more cursor-pointer"
            style={{width: "20px"}}
            > ⋮
        </button>

        <div
            onClick={()=>{
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
            action= {formRenameAction}
            onSubmit={() => setStatus("pending")}
            className="gap-2 min-w-[290px] flex-wrap h-[90px] fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 items-center"
            style={{padding: "8px", display: `${isEditOn ? "flex" : "none"}`, border: "1px solid white", background: "black"}}
            >
            <input
                type="text"
                name="folder"
                defaultValue={folder.folder_name ?? ""}
                className="border-b-2 border-white rounded-[8px] focus:outline-none text-[12px]"
                placeholder="Rename folder"
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
            className=" z-20 w-[160px] h-[80px] rounded-[10px] flex justify-center gap-10 fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 items-center"
            style={{display: `${isMenuOn ? "flex" : "none"}`, background: "#093624"}}>

            <li>
                <button
                    className=" text-[24px] cursor-pointer hover:opacity-60"
                    style={{background: "none"}}
                    onClick={() => {
                        setIsEditOn(prev => !prev)
                        setIsMenuOn(false)
                    }}
                    >
                ✏️</button>

            </li>

            <li>
                <button className="text-[24px] cursor-pointer hover:opacity-60" onClick={handleDelete} style={{background: "none"}} type="submit">🗑️</button>
            </li>
        </ul>
    </td>
  )
}

export default MoreOnFolder