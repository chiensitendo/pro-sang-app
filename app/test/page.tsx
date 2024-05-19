"use client";

import generalAxios from "@/axios/generalAxios";
import { isEmpty } from "lodash";
import { useEffect, useState } from "react";


const TestPage = () => {
    useEffect(() => {
        generalAxios.get("/api/ping").then(res => console.log(res));
    },[]);
    const [data, setData] = useState('');

    useEffect(() => {
        setData(document.cookie);
    },[]);
    return <div>
        Data: {isEmpty(data) ? 'No data': data}
    </div>;
}

export default TestPage;