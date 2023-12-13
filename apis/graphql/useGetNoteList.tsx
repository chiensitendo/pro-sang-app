import { useQuery, gql } from "@apollo/client";
import { FolderItem } from "./type";
import { NoteType } from "./useCreateNote";

const GET_NOTE_LIST = gql`
  query useGetNoteList {
    note {
      id
      created_date
      name
    }
  }
`;

export type GetNoteListType = {
  note: Array<NoteType>;
}

const useGetNoteList = () => {
  const { loading, error, data, refetch } = useQuery<GetNoteListType>(GET_NOTE_LIST);

  return {loading, error, data, refetch};
};

export default useGetNoteList;
