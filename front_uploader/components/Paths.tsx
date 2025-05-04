import { FetchPaths } from "@/actions/fetchesAction"
import { TFolder } from "@/utils/types";
import Link from "next/link"

const Paths = async ({ searchParams }: {searchParams: { parent_folder_id: string }}) => {

    const results = await FetchPaths(searchParams.parent_folder_id);
    if (!results.success) {
        return results.message
    }

  return (
    <div className="path sticky top-0 left-0 text-[14px] sm:text-[15px] h-[34px]">
        <p>
            <Link style={{color: "rgb(202, 148, 0)"}} href="/">zach://root</Link>

            {
                results.data.paths.map((path: TFolder) => {
                    return <Link key={path.folders_id} href={`?parent_folder_id=${path.folders_id}`} style={{color: 'rgb(7, 167, 15)'}}>/{path.folder_name}</Link>
                })
            }
        </p>
    </div>
  )
}

export default Paths