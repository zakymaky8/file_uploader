export type TFolder = {
    password: string | null;
    folders_id: number;
    folder_name: string;
    createdAt: Date;
    updatedAt: Date;
    user_id: number;
    folderType: "Public" | "Private";
    sharableFolderUrl: string;
    parentId: number | null;
}


export type TFile = {
    user_id: number;
    password: string | null;
    files_id: number;
    filename: string;
    size: number;
    sharableFileUrl: string;
    uploadTime: Date;
    folder_id: number | null;
    fileType: "Public" | "Private";
}