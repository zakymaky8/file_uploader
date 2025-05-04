

const FileDetailPage = async ({ params }:
    {
        params: Promise<{ fileId: string }>
    }) => {
        const res = await fetch("http://backend_uploader:3006");
        const { user } = await res.json();
    const { fileId } = await params;

    return (
        <main>
            FileDetailPage {fileId}
            <ul>
                {
                    user.map(user => {
                        return <li key={user.users_id}>{user.username}</li>
                    })
                }
            </ul>
        </main>
    )
}

export default FileDetailPage