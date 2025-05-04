
import Link from "next/link"
import MoreOnFile from "./MoreOnFile"
import { TFile } from "@/utils/types"
import { decideWhichFormat } from "@/utils/util"

const FileItem = ({ file }: { file: TFile }) => {
  const { secure_url } = JSON.parse(file.sharableFileUrl);
  return (
    <tr>
        <td
            style={{padding:"5px", textDecoration: 'none', fontSize: "13px"}}
            className="flex text-[#e418ff] gap-2"
            >
            <Link target="_blank" href={`${secure_url}`}  className="flex text-[#e418ff] gap-2">
                <span> 📎 </span>
                <span>{ file.filename } 🔒</span>
            </Link>
        </td>

        <td> { decideWhichFormat(file.uploadTime) } </td>
        <td>{ Math.round(file.size/1000) }KB</td>
        <MoreOnFile file={file} />
    </tr>
  )
}

export default FileItem