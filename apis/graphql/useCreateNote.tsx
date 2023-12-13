"use client";

import { useQuery, gql, useMutation } from "@apollo/client";
import { FolderItem } from "./type";
import { useState } from "react";

type NoteRequest = {
  name: string
}

const CREATE_NOTE = gql`
mutation CreateNote($objects: [note_insert_input]!) {
    insert_note(objects: $objects) {
      returning {
        id
      created_date
      name
      }
    }
}
`;


export type NoteType = {
    name: string;
    id: number;
    created_date: string;
}

const useInsertNote = () => {
  const [insertNote] = useMutation<NoteType, {objects: NoteRequest}>(CREATE_NOTE);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<NoteType>();
  const [error, setError] = useState();
  const insertNewNote = async (name: string) => {
    setLoading(true);
    return new Promise((resolve, reject) => {
      insertNote({variables: {objects: {name}}}).then(res => {
        if (!res?.data) {
          throw new Error('No data returns');
        }
        if (error) {
          setError(undefined);
        }
        setData(res.data);
        resolve(res.data);
      }).catch(err => {
        setError(err);
        setData(undefined);
        reject(err);
      }).finally(() => setLoading(false));
    });
  }
  return {insertNewNote, loading, error, data};
};

export default useInsertNote;
