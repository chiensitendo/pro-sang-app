"use client";

import useInsertNote from "@/apis/graphql/useCreateNote";
import useGetNoteList from "@/apis/graphql/useGetNoteList";
import generalAxios from "@/axios/generalAxios";
import BoostModal from "@/components/boostrap/boost-modal";
import Form1 from "@/components/core/forms/Form1";
import HandWriteList from "@/components/core/list/HandWriteList";
import { NextPage } from "next";
import { useEffect, useRef, useState } from "react";

const NotePage: NextPage = () => {
    const { insertNewNote, error, data: note } = useInsertNote();
    const [show, setShow] = useState(false);
    const {data, refetch} = useGetNoteList();
    const childRef = useRef();
    useEffect(() => {
        if (error) {
            alert(error);
        }
    }, [error]);

    useEffect(() => {
        if (note) {
            setShow(false);
        }
    }, [note]);

    useEffect(() => {
        // generalAxios.get("/api/public/folder").then(res => console.log(res))
    },[]);

    return <div>
        <button onClick={() => {
            setShow(true);
        }}>Create New Note</button>
        <HandWriteList list = {data?.note?.map(n => ({id: n.id, name: n.name}))}/>
        <BoostModal ref={childRef} show = {show} onClose={() => setShow(false)} useCustomConfirmButton><Form1 onSubmit={values => {
            insertNewNote(values).then(re => {
                (childRef?.current as any)?.closeModal();
                refetch();
            });
            
        }}  /></BoostModal>
    </div>
}

export default NotePage;