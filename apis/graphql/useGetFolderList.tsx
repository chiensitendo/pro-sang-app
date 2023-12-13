import { useQuery, gql } from "@apollo/client";
import { FolderItem } from "./type";

const GET_FOLDER_LIST = gql`
  query GetFolderList {
    folder {
      name
      path
      id
      created_date
      count
    }
  }
`;

export type GetFolderListType = {
    folder: Array<FolderItem>;
}

const useGetFolderList = () => {
  const { loading, error, data } = useQuery<GetFolderListType>(GET_FOLDER_LIST);
  return {loading, error, data};
};

export default useGetFolderList;
