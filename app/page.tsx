"use client";

import useGetFolderList from "@/apis/graphql/useGetFolderList";
import { Button } from "antd";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
    // const {data} = useGetFolderList();
    const router = useRouter();
    useEffect(() => {
        router.push("/images");
    },[router]);
    return <div>
        {/* {data?.folder?.map((folder, index) => <div key={index}>{folder.name}: {folder.count}</div>)} */}
        {/* <Button>AAA</Button> */}
    </div>
}