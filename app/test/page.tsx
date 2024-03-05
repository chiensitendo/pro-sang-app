"use client";

import { isEmpty } from "lodash";
import { useEffect, useState } from "react";


const TestPage = () => {
    // useEffect(() => {
    //     fetch("https://sangapi.pro.vn/api/ping", {
    //         method: "GET"
    //     }).then(res => console.log(res)).catch(t => console.log(t));
    // },[]);
    const [data, setData] = useState('');

    useEffect(() => {
        setData(document.cookie);
    },[]);
    return <div>
        Data: {isEmpty(data) ? 'No data': data}
    </div>;
}

export default TestPage;