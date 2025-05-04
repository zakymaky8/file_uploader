/* eslint-disable react-hooks/exhaustive-deps */
"use client"

import { CreateFolderAction, TFolderCreationState } from "@/actions/create-folder"
import { useRouter } from "next/navigation"
import { Dispatch, SetStateAction, useActionState, useEffect, useState } from "react"
import InlineLoading from "./InlineLoading"

type TProps = {
    setUploadFolderOn: Dispatch<SetStateAction<boolean>>,
    setUploadFileOn: Dispatch<SetStateAction<boolean>>,
    upoadFolderOn: boolean,
    searchParams: { parent_folder_id: string }
}

const NewFolderButton = ({ setUploadFolderOn, setUploadFileOn, upoadFolderOn, searchParams }: TProps) => {
    const [ isFolderPrivate, setIsFolderPrivate ] = useState(false);
    const [status, setStatus] = useState< "init" | "pending" | "success" | "fail">("init")

    const r =useRouter()
    const actionWrapper = async (prev: TFolderCreationState, formdata: FormData) => {
        return CreateFolderAction(searchParams.parent_folder_id, formdata)
    }
    const [ folderFormState, folderFormAction ] = useActionState(actionWrapper, { message: "", success: "" })

    useEffect(() => {
        if (typeof folderFormState.success === "boolean") {
            r.refresh()
            setUploadFolderOn(false)
            setStatus(folderFormState.success ? "success" : "fail");
        }
    }, [folderFormState])


  return (
    <li>

        <button onClick={() => {
                setUploadFolderOn(prev => !prev)
                setUploadFileOn(false)
                }}
            className="cursor-pointer hover:opacity-80"
            id="new-folder"
        >🗂️ New Folder +</button>
        <form
            action={folderFormAction}
            onSubmit={() => setStatus("pending")}
            id="folder-form"
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 items-center flex-col gap-8"
            style={{padding: "15px",background: "black", display: `${upoadFolderOn ? 'flex' : "none"}`, width: "280px"}}
            >
            <h2>Parent folder: <span className="italic underline">{ "Root" }</span></h2>
            <input
                type="text"
                name="folder"
                id="folder"
                placeholder="Name your folder ..."
                required
                className="focus:outline-none rounded-[3px] flex-grow"
                style={{borderBottom: "1px solid white", height: "45px", width: "100%"}}
            />
            <div className="flex gap-2 items-center" style={{width: "100%"}}>
                <input
                    type="checkbox"
                    onChange={() => setIsFolderPrivate(!isFolderPrivate)}
                    name="item_type"
                    id="type"
                    style={{width: "18px", height: "18px"}}
                    className="accent-green-700"
                />
                <label htmlFor="type">Mark{isFolderPrivate ? "ed" : ""} as private</label>
            </div>

            {
                isFolderPrivate &&
                <div className="flex gap-2 items-center text-[14px]">
                    <label htmlFor="set_pwd">Set password: </label>
                    <input
                        style={{borderBottom: "1px solid white", height: "25px", padding: "2px"}}
                        className="focus:outline-none rounded-[3px] flex-grow"
                        type="password"
                        name="folder_password"
                        id="set_pwd"
                        required
                    />
                </div>
            }


        <button
            id="submit"
            className="rounded-[3px] cursor-pointer hover:opacity-80 relative"
            style={{padding: "6px", width: "100%"}}
            type="submit"
        > { status === "pending" ? <InlineLoading /> : "Create" } </button>

    </form>
</li>
  )
}

export default NewFolderButton