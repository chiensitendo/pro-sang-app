"use client";

import { useDispatch } from "react-redux";
import styles from "./admin.module.scss";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useEffect, useState } from "react";
import { fetchJobList, fetchNextJobList, fetchSystemData, refreshJobList, syncFolderAction, syncImagesInFolderAction } from "@/redux/reducers/admin/adminSlice";
import SystemFileTable from "./components/SystemFileTable";
import { Button, Spin, Tooltip } from "antd";
import withNotification from "@/components/with-notification";
import ProHeader from "@/components/core/header/ProHeader";
import JobTable from "./components/JobTable";
import { SyncOutlined } from "@ant-design/icons";

const AdminPage = () => {
    const dispatch = useDispatch();
    const { folders, loading, job } = useSelector((state: RootState) => state.admin);
    const { count, limit, loading: jobLoading, offset, jobs, page } = job;
    const [status, setStatus] = useState(0);

    const handleOnTableChange = (page: number, pageSize: number) => {
        dispatch(fetchNextJobList({
            limit: limit,
            page: page
        }));
    }

    useEffect(() => {
        if (status === 0)
            setStatus(1);
        if (status === 1) {
            dispatch(fetchSystemData());
            dispatch(fetchJobList({ limit, offset }));
        }

    }, [status]);



    return <div className={styles.AdminPage}>
        <ProHeader />
        <h2>Folder Status</h2>
        <Spin spinning={loading}><SystemFileTable folders={folders ?? []} onSync={folderName =>
            dispatch(syncFolderAction([folderName]))} onSyncImages={folderId => dispatch(syncImagesInFolderAction(folderId))} /></Spin>
        <div className={styles.heading}>
            <h2>Jobs</h2>
            <Tooltip title="refresh">
                <Button type="primary" shape="circle" onClick={() => dispatch(refreshJobList({
                    limit: limit,
                    offset: 0
                }))} icon={<SyncOutlined spin={jobLoading} />} />
            </Tooltip>
        </div>
        <Spin spinning={jobLoading}>
            <JobTable jobs={jobs ?? []} count={count} page={page} limit={limit} onChange={handleOnTableChange} onDelete={jobId => { }} />
        </Spin>
    </div>
}

export default withNotification(AdminPage);