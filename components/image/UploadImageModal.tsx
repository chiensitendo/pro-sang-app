import { Avatar, Button, Card, List, Modal, Progress, Tag, Tooltip, Upload, message } from "antd";
import styles from "./UploadImageModal.module.scss";
import { FolderItem } from "@/types/folder";
import { CheckCircleOutlined, CloseCircleOutlined, RedoOutlined, SyncOutlined, UploadOutlined } from "@ant-design/icons";
import { useCallback, useMemo, useState } from "react";
import { CustomUploadFile } from "@/app/folder/upload/page";
import { UploadProps } from "antd/lib";
import { getSessionAccessToken } from "@/services/session-service";
import { postUpdateFileAPI } from "@/apis/image-apis";
import { RcFile } from "antd/es/upload";
import { useDispatch } from "react-redux";
import { addImageInFolder } from "@/redux/reducers/image/folderImageListSlice";
import { Service } from "@/types/image";

const UploadImageModal = ({ open, onOk, onCancel, folder }: { open: boolean, onOk: (shouldRefresh: boolean) => void, onCancel: (shouldRefresh: boolean) => void, folder: FolderItem }) => {

    const [fileList, setFileList] = useState<CustomUploadFile<any>[]>([]);
    const [previewFileList, setPreviewFileList] = useState<(string | ArrayBuffer)[]>([]);
    const dispatch = useDispatch();
    const successfullFiles = useMemo(() => {
        return fileList.filter(f => f.status === 'done');
    }, [fileList]);

    const failedFiles = useMemo(() => {
        return fileList.filter(f => f.status === 'error');
    }, [fileList]);

    const props: UploadProps = {
        name: 'image',
        action: () => {
            return `/api/image/upload?folder_id=${folder.id}`;
        },
        headers: {
            authorization: `Bearer ${getSessionAccessToken()}`,
        },
        multiple: true,
        onChange(info) {

            if (info.file.status !== 'uploading') {
                console.log(info.file, info.fileList);
            }
            if (info.file.status === 'done') {
                message.success(`${info.file.name} file uploaded successfully`);
            } else if (info.file.status === 'error') {
                message.error(`${info.file.name} file upload failed.`);
            }

            const list = info.fileList.map(f => {
                const file = fileList.find(ff => ff.uid === f.uid);
                return { ...f, folder_id: !file ? folder.id! : file.folder_id };
            });
            list.forEach((v, i) => {
                var reader = new FileReader();
                var url = reader.readAsDataURL(v.originFileObj!);

                reader.onloadend = function (e) {
                    const l = Array.from(previewFileList);
                    const url = reader.result ?? `https://api.dicebear.com/7.x/miniavs/svg?seed=${i}`;
                    l.push(url);
                    dispatch(addImageInFolder({
                        content_type: '',
                        folder_id: folder.id,
                        id: -1,
                        name: v.name,
                        is_public: false,
                        path: url as string,
                        service: Service.AWS
                    }));
                    setPreviewFileList(l);
                };
            });
            setFileList(list);
        },
        withCredentials: true,
        showUploadList: false
    };


    const handleRetry = (item: CustomUploadFile<any>, index: number) => {
        if (item?.originFileObj) {
            postUpdateFileAPI({
                file: item.originFileObj,
                folder_id: item.folder_id
            }).then(res => {
                message.success(`${item.name} file re-uploaded successfully`);
                const newFileList: CustomUploadFile<any>[] = [];
                for (let i = 0; i < fileList.length; i++) {
                    if (i !== index) {
                        newFileList.push({ ...fileList[i] });
                    } else {
                        newFileList.push({ ...fileList[i], status: 'done' });
                    }
                }
                setFileList(newFileList);
            }).catch(err => {
                message.error(`${item.name} file re-upload failed.`);
            });
        }
    }

    const handleFile = (index: number, f: RcFile, folder_id: number): Promise<number> => {

        return new Promise((resolve, reject) => {
            postUpdateFileAPI({
                file: f,
                folder_id: folder_id
            }).then(res => resolve(index)).catch(err => reject(index));
        });
    }

    const handleRetryAll = useCallback(() => {
        const promises = [];
        for (let i = 0; i < fileList.length; i++) {
            const f = fileList[i];
            if (f.status === "error" && f.originFileObj) {
                promises.push(handleFile(i, f.originFileObj, f.folder_id));
            }
        }
        Promise.allSettled(promises).then(res => {

            const indexes: number[] = [];
            res.forEach(r => {
                if (r.status === "fulfilled") {
                    indexes.push(r.value);
                } else {
                    const f = fileList[r.reason];
                    if (f) {
                        message.error(`${f.name} file re-upload failed.`);
                    }
                }
            });

            const newFileList: CustomUploadFile<any>[] = [];
            for (let i = 0; i < fileList.length; i++) {
                const f = fileList[i];
                if (!indexes.includes(i)) {
                    newFileList.push({ ...f });
                } else {
                    message.success(`${f.name} file re-uploaded successfully.`);
                    newFileList.push({ ...f, status: 'done' });
                }
            }
            setFileList(newFileList);
        }).catch(err => {

        });
    }, [fileList]);

    const clearStates = () => {
        setFileList([]);
        setPreviewFileList([]);
    }


    return <Modal title={`Upload Image in ${folder.name} folder.`}
        open={open} onOk={() => {
            onOk(successfullFiles.length > 0);
            clearStates();
        }}
        onCancel={() => {
            onCancel(successfullFiles.length > 0);
            clearStates();
        }}>
        <div className={styles.UploadImageModal}>
            <Card title="Upload Files" className={styles.upload}
                extra={<div>
                    <Progress size={"small"} type="circle" percent={fileList.length === 0 ? 0 : (successfullFiles.length / fileList.length) * 100} />
                </div>}>
                <Upload {...props}>
                    <Button icon={<UploadOutlined />}>Click to Upload</Button>
                </Upload>
            </Card>
            <Card title={<div>Logs {failedFiles.length > 0 && <Tooltip title="retry all">
                <Button shape="circle" onClick={handleRetryAll} color="red" icon={<RedoOutlined />} />
            </Tooltip>}</div>} className={styles.log}>
                <div>
                    <List
                        itemLayout="horizontal"
                        dataSource={fileList}
                        renderItem={(item, index) => {

                            let statusTag = <></>;
                            const folderText = `Folder: ${folder.name}`;
                            if (item.status === "done") {
                                statusTag = <Tag icon={<CheckCircleOutlined />} color="success">
                                    Success on {folderText}!
                                </Tag>
                            } else if (item.status === "uploading") {
                                statusTag = <Tag icon={<SyncOutlined spin />} color="processing">
                                    Uploading on {folderText}!
                                </Tag>;
                            } else {
                                statusTag = <Tag icon={<CloseCircleOutlined />} color="error">
                                    Error on {folderText}!
                                </Tag>
                            }
                            return <List.Item>
                                <List.Item.Meta
                                    // avatar={<Avatar src={`https://api.dicebear.com/7.x/miniavs/svg?seed=${index}`} />}
                                    avatar={<Avatar src={previewFileList[index] as string} />}
                                    title={item.name}
                                    description={<div className={styles.description}>{statusTag}</div>}
                                />
                                {item.status === "error" && <Tooltip title="retry">
                                    <Button onClick={() => handleRetry(item, index)} shape="circle" color="red" icon={<RedoOutlined />} />
                                </Tooltip>}
                            </List.Item>;
                        }}
                    />
                </div>
            </Card>
        </div>
    </Modal>
}

export default UploadImageModal;