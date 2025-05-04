import MoreOnFolder from "./MoreOnFolder"
import FolderName from "./FolderName"
import { TFolder } from "@/utils/types"
import { decideWhichFormat } from "@/utils/util"

const FolderItem = ({ folder }: { folder: TFolder }) => {
  return (
    <tr>
        <td style={{display: "flex", gap: '10px', padding:"5px"}}>
            <FolderName folder={folder} />
        </td>

        <td>{decideWhichFormat(folder.createdAt)}</td>
        <td>---</td>
        <MoreOnFolder folder={folder} />
    </tr>
  )
}

export default FolderItem