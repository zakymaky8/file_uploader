"use client"

import { TFolder } from "@/utils/types";
import { useRouter } from "next/navigation"

const FolderName = ({folder}: { folder: TFolder }) => {

    const router = useRouter();
    const handleClick = () => {
        router.push(`?parent_folder_id=${folder.folders_id}`)
    }

  return (
    <button
        style={{textDecoration: "none"}}
        className="text-[#e8b80a] flex text-base items-center gap-3 cursor-pointer hover:opacity-75"
        onClick={handleClick}
    >
        <span style={{fontSize: '14px'}}>🗂️</span>
        <span> {folder.folder_name}</span>
    </button>
  )
}

export default FolderName