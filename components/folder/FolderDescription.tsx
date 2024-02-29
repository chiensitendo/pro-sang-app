import { FolderItem } from "@/types/folder";
import { Button, Descriptions, DescriptionsProps, Divider, message } from "antd";
import styles from "./FolderDescription.module.scss";
import React, { useEffect, useMemo, useState } from "react";
import moment from "moment";
import TextArea from "antd/es/input/TextArea";
import { PlusOutlined } from "@ant-design/icons";
import { useDispatch } from "react-redux";
import { openUploadImageModal } from "@/redux/reducers/image/folderImageListSlice";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useSessionAuth } from "../use-session-auth";


const FolderDescription = ({ folder, onDescription }: { folder: FolderItem, onDescription: (description: string) => void }) => {

    const [description, setDescription] = useState("");
    const [isEdit, setIsEdit] = useState(false);
    const {isValidAccount} = useSessionAuth();
    const { count } = useSelector(
        (state: RootState) => state.image.folder.list
    );
    const dispatch = useDispatch();
    const items: DescriptionsProps['items'] = useMemo(() => {
        return [
            {
                key: '1',
                label: 'ID',
                children: <b>{folder.id}</b>,
            },
            {
                key: '2',
                label: 'Name',
                children: folder.name,
            },
            {
                key: '3',
                label: 'Total image',
                children: count,
            },
            {
                key: '4',
                label: 'Created Time',
                children: moment(folder.created_date).format("YYYY-MM-DD HH:mm:ss"),
            },
            {
                key: '5',
                label: 'Updated Time',
                children: moment(folder.updated_date).format("YYYY-MM-DD HH:mm:ss"),
            }
        ]

    }, [folder, count]);

    const title = useMemo(() => folder.name, [folder]);

    const copyToClipboard = async (text: string) => {
        const t = text.trim();
        if (t === '') return;
        try {
            await navigator.clipboard.writeText(t);
            message.success('Copied!');
        } catch (err) {
            message.error('Failed to copy!');
        };
    }

    useEffect(() => {
        setDescription(folder.description);
    }, [folder]);

    return <div className={styles.FolderDescription}>
        <Descriptions extra={<div className={styles.buttonGroup}>
            <Button type="primary" className="green_primary_button" icon={<PlusOutlined />} disabled={!isValidAccount} onClick={() => dispatch(openUploadImageModal({ open: true }))}>Add</Button>
            <Button type="primary" disabled={!isValidAccount} onClick={() => {
                if (isEdit) {
                    setDescription(folder.description);
                }
                setIsEdit(!isEdit);
            }}>{isEdit ? 'Close' : 'Edit'}</Button>
        </div>} title={title} items={items} />

        {!isEdit && description && <React.Fragment>
            <Divider />
            <div className={styles.description}>
                {description.replaceAll('\n', '_s$ng_').split('_s$ng_').map((v, i) => {

                    return v === '' ? <br key={i} /> : <p className={styles.line} key={i}>{v} <span onClick={() => copyToClipboard(v)}>Copy</span></p>;
                })}</div>
            <Divider />
        </React.Fragment>}

        {isEdit && <TextArea disabled={!isEdit} rows={4} placeholder="Description" maxLength={565} value={description} onChange={e => setDescription(e.target.value)} />}
        {isEdit && <div className={styles.UpdateBtn}><Button type="primary" onClick={() => onDescription(description.replaceAll('_s$ng_', '_sAng_'))}>Update</Button></div>}
    </div>
}

export default FolderDescription;