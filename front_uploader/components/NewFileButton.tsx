/* eslint-disable react-hooks/exhaustive-deps */
import { CreateFileAction } from "@/actions/create-file";
import { TFolderCreationState } from "@/actions/create-folder";
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction, useActionState, useEffect, useState } from "react"
import InlineLoading from "./InlineLoading";

type TProps = {
    setUploadFolderOn: Dispatch<SetStateAction<boolean>>,
    setUploadFileOn: Dispatch<SetStateAction<boolean>>,
    upoadFolderOn: boolean,
    upoadFileOn: boolean,
    searchParams: { parent_folder_id: string }
}

const NewFileButton = ({ setUploadFolderOn, setUploadFileOn, upoadFolderOn, upoadFileOn, searchParams }: TProps) => {

    const [ isFilePrivate, setIsFilePrivate ] = useState(false);
    const [status, setStatus] = useState<"intial" | "pending" | "failure" | "success">("intial");

    const r = useRouter()
    const actionWrapper = async (prev: TFolderCreationState, formdata: FormData) => {
        return CreateFileAction(searchParams.parent_folder_id, formdata)
    }
    const [ fileFormState, fileFormAction ] = useActionState(actionWrapper, { message: "", success: "" })

    useEffect(() => {
        if (typeof fileFormState.success === "boolean") {
            setStatus(fileFormState.success ? "success" : "failure")
            setTimeout( () => fileFormState.message = "", 3000)
            r.refresh()
        }
        if (fileFormState.success ===true) {
            setTimeout(() => setUploadFileOn(false), 1500)
        }
    }, [fileFormState])

  return (
    <li>
        <button onClick={() => {
            setUploadFileOn(prev => !prev)
            setUploadFolderOn(false)
        }} className="cursor-pointer hover:opacity-80" id="newfile">📎 New File +</button>
        <div
            onClick={()=>{
                setUploadFileOn(false)
                setUploadFolderOn(false)
            }}
            className={`
                fixed right-0 top-0 w-screen z-10
                min-h-screen bg-[black] opacity-70
                ${upoadFileOn || upoadFolderOn ? "block" : "hidden"}
            `}
        ></div>
        <form
            action={fileFormAction}
            onSubmit={() => setStatus("pending")}
            style={{display: `${upoadFileOn ? 'flex' : "none"}`, background: "black", padding: "10px"}}
            id="upload-form"
            className="flex-col bg-[#3b3131] items-center gap-8 fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 rounded-[10px]"
            >
            <h2>Parent folder: <span className="italic underline">{ "Root" }</span></h2>
            <input
                type="file"
                name="file"
                id="file"
                required
                className="underline italic"
            />

            <div className="flex gap-2 items-center" style={{width: "100%"}}>
                <input
                    type="checkbox"
                    onChange={() => setIsFilePrivate(!isFilePrivate)}
                    name="item_type"
                    id="filetype"
                    style={{width: "18px", height: "18px"}}
                    className="accent-green-700"
                />
                <label htmlFor="filetype">Mark{isFilePrivate ? "ed" : ""} as private</label>
            </div>

            {
                isFilePrivate &&
                <div className="flex gap-2 items-center text-[14px]">
                    <label htmlFor="set_pwd">Set password: </label>
                    <input
                        style={{borderBottom: "1px solid white", height: "25px", padding: "2px", width: "70px"}}
                        className="focus:outline-none rounded-[3px] flex-grow"
                        type="password"
                        name="file_password"
                        id="set_pwd"
                        required
                    />
                </div>
            }
            <span className="text-amber-600 italic text-center self-center text-[12px]">{ fileFormState.message }</span>
            <button
                className="hover:opacity-80 cursor-pointer relative"
                style={{background: "none", padding: "4px", fontSize: "20px"}}
                title="Upload"
                type="submit"
            >
                { status === "pending" ? <InlineLoading /> : "📤 Upload"}
            </button>

        </form>
    </li>

  )
}

export default NewFileButton