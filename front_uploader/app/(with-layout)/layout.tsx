import type { Metadata } from "next";
import "../globals.css";
// import Header from "@/components/Header";
// import SideBar from "@/components/SideBar";


export const metadata: Metadata = {
  title: "File Uploader",
  description: "App to upload files into",
};

export default async function RootLayout({
  children,
  // searchParams
}: Readonly<{
  children: React.ReactNode,
  // searchParams: Promise<{ parent_folder_id: string }>
}>) {

  // const srcParams = await searchParams;
  // console.log(searchParams)
  return (
    <html lang="en">
      <body className="lay-body">
        {/* <Header />
        <SideBar searchParams={srcParams} /> */}
        {children}
      </body>
    </html>
  );
}
