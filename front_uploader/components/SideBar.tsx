"use client"

import { useState } from "react"
import NewFolderButton from "./NewFolderButton";
import NewFileButton from "./NewFileButton";

const SideBar = ({searchParams}: {searchParams: { parent_folder_id: string }}) => {
    const  [upoadFileOn, setUploadFileOn] = useState(false);
    const  [upoadFolderOn, setUploadFolderOn] = useState(false);

  return (
    <nav className="flex flex-col items-center bg-[black]">
        <ul
            className="flex flex-col items-start flex-wrap gap-8"
            style={{padding: "30px", marginTop: "10px"}}
            >


            <NewFileButton
                searchParams={searchParams}
                setUploadFileOn={setUploadFileOn}
                setUploadFolderOn={setUploadFolderOn}
                upoadFolderOn={upoadFolderOn}
                upoadFileOn={upoadFileOn}
            />

           <NewFolderButton
                searchParams={searchParams}
                setUploadFileOn={setUploadFileOn}
                setUploadFolderOn={setUploadFolderOn}
                upoadFolderOn={upoadFolderOn}
            />
            <button
                className="cursor-pointer hover:opacity-80"
                    >🚀 Share Folder
            </button>

        </ul>
    </nav>
  )
}

export default SideBar