"use client";

import { fetchFolderList } from "@/redux/reducers/folder/folderListReducer";
import { RootState } from "@/redux/store";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import styles from "./folder.module.scss";
import ProHeader from "@/components/core/header/ProHeader";
import withAuth from "@/components/with-auth";
const FolderListPage = () => {

  const dispatch = useDispatch();

  const { count, folders } = useSelector(
    (state: RootState) => state.folder.list
  );

  useEffect(() => {
    dispatch(fetchFolderList());
  }, [dispatch]);

  return <div className={styles.FolderListPageWrapper}>
    <ProHeader />
    <div className={styles.FolderListPage}>

      <div className={styles.container}>
        <h2>Directory List</h2>
        <div className={styles.box}>
          <ul>
            <p><b>Total</b>: <span>{count}</span></p>
          </ul>
          <ul className={styles.directoryList}>
            {folders && folders.map((folder, index) => <li key={index} className={styles.folder}>
              {folder.is_sync && <a href={`/image/${folder.name}_${folder.id}/list`}>{`${folder.name} (${folder.image_count})`}</a>}
            </li>)}
          </ul>
        </div>
      </div>
    </div>
  </div>
}

export default withAuth(FolderListPage);