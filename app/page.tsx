"use client";

import useGetFolderList from "@/apis/graphql/useGetFolderList";

export default function Home() {
    const {data} = useGetFolderList();
    return <div>
        {data?.folder?.map((folder, index) => <div key={index}>{folder.name}: {folder.count}</div>)}
    </div>
}