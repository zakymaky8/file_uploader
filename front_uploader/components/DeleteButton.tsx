import { DeleteFileAction } from "@/actions/deleteFile"
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction, useState } from "react";
import InlineLoading from "./InlineLoading";

const DeleteButton = ({ fileId, setIsMenuOn }: { fileId: number, setIsMenuOn: Dispatch<SetStateAction<boolean>> }) => {
    const [status, setStatus] = useState<"init" | "pending" | "failed" | "succeded">("init");

    const r = useRouter();

    const handleDelete = async () => {
        setStatus("pending")
        const { success, message } = await DeleteFileAction(fileId);

        if (typeof success === "boolean") {
            alert(message)
            setStatus(success ? "succeded" : "failed")
        }

        if (success === true) {
            r.refresh()
            setIsMenuOn(false)
        }
    }
  return (
    <div className="relative">
        <button onClick={handleDelete} className="text-[24px] cursor-pointer hover:opacity-60" style={{background: "none"}}>{ status === "pending" ? <InlineLoading /> : "🗑️"}</button>
    </div>
  )
}

export default DeleteButton