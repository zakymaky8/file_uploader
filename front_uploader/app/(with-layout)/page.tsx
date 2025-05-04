import { FetchFolders } from "@/actions/fetchesAction";
import FileItem from "@/components/FileItem";
import FolderItem from "@/components/FolderItem";
import Header from "@/components/Header";
// import InlineLoading from "@/components/InlineLoading";
import Paths from "@/components/Paths"
import SideBar from "@/components/SideBar";
import { getAccessToken } from "@/utils/serve-only";
import { TFile, TFolder } from "@/utils/types";
import { redirect } from "next/navigation";

export default async function Home({ searchParams }: {searchParams: Promise<{ parent_folder_id: string, search: string }>} ) {
  const token = await getAccessToken();

  if (!token) {
    redirect("/signin")
  }

  const searParams = await searchParams;
  const results = await FetchFolders(+searParams.parent_folder_id, searParams.search);
  const { data, message, success } = results;

  if (success === false) {
    return message
  }

  return (
    <>
    <Header />
    <SideBar searchParams={searParams} />
    <main>
      <Paths searchParams={searParams} />
      <table>
          <thead className="sticky top-8 left-0">
            <tr className="hover:opacity-90">
              <th>Name</th>
              <th>Uploaded At</th>
              <th>Size</th>
              <th>More</th>
            </tr>
          </thead>

          <tbody className="relative">
            {/* { typeof success !== "boolean" ? <div className="relative"><InlineLoading /></div> : "" } */}
            { data.folders.length > 0 && data.folders.map((folder: TFolder) => <FolderItem folder={folder} key={folder.folders_id}/>)}
            { data.files.length > 0 && data.files.map((file: TFile) => <FileItem file={file} key={file.files_id}/>)}
            { (data.folders.length === 0 && data.folders.length === 0) && <tr className="absolute left-1/2 top-20 -translate-1/2">empty!</tr> }
          </tbody>
      </table>

    </main>
    </>
  );
}
