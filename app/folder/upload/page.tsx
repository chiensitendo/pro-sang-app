"use client";

import withAuth from "@/components/with-auth";
import styles from "./upload.module.scss";
import { Alert, Avatar, Button, Card, Divider, Form, Input, List, Modal, Progress, Select, Tag, Tooltip, Upload, UploadFile, message } from "antd";
import { useLocale } from "next-intl";
import getTranslation from "@/components/translations";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useCallback, useEffect, useMemo, useState } from "react";
import { fetchFolderList } from "@/redux/reducers/folder/folderListReducer";
import { CheckCircleOutlined, CloseCircleOutlined, PlusOutlined, RedoOutlined, SyncOutlined, UploadOutlined } from '@ant-design/icons';
import { FolderItem, FolderRequest } from "@/types/folder";
import { clearCreateFolderError, createFolderAction } from "@/redux/reducers/folder/createFolderReducer";
import { UploadProps } from "antd/lib";
import { getSessionAccessToken } from "@/services/session-service";
import { postUpdateFileAPI } from "@/apis/image-apis";
import { RcFile } from "antd/lib/upload";
import TextArea from "antd/lib/input/TextArea";
import ProHeader from "@/components/core/header/ProHeader";



interface FolderForm {
    folder_id: number
}

export interface CustomUploadFile<T> extends UploadFile<T> {
    folder_id: number
}


const AddFolderModal = ({ open, onCancel, onOk, clearError, error }: {
    open: boolean, onCancel: () => void, onOk: (props: FolderRequest) => void, clearError: () => void,
    error?: string
}) => {
    const [form] = Form.useForm<FolderRequest>();

    useEffect(() => {
        if (open) {
            form.resetFields(["folder_name", "description"]);
            clearError();
        }
    }, [open, clearError]);

    return <Modal title="Add new folder" okButtonProps={{
        disabled: !!error
    }} open={open} onOk={() => {
        form.validateFields(["folder_name", "description"]).then(values => {
            onOk(values);
        }).catch(_ => { });
    }} onCancel={() => {
        form.resetFields(["folder_name", "description"]);
        clearError();
        onCancel();
    }}>
        <Form name="createFolderForm" form={form} layout="vertical" onChange={() => error && clearError()}>
            {error && <div style={{ width: '100%', padding: '1rem 0' }}><Alert message={error} type="error" showIcon /></div>}
            <Form.Item label="Folder Name" name={"folder_name"} rules={[{ required: true, message: 'Please insert folder name!' }]}>
                <Input />
            </Form.Item>
            <Form.Item label="Description" name={"description"}>
                <TextArea />
            </Form.Item>
        </Form>
    </Modal>
}

const RetryModal = ({ open, onCancel, fileList, previewFileList, getFolderName, handleRetry, handleRetryAll }: {
    open: boolean, onCancel: () => void,
    fileList: CustomUploadFile<any>[],
    previewFileList: any[],
    getFolderName: (folderId: number) => void,
    handleRetry: (item: CustomUploadFile<any>, index: number) => void,
    handleRetryAll: () => void
}) => {
    useEffect(() => {
        if (open) {
            if (fileList.filter(f => f.status === "error").length === 0) {
                onCancel();
            }
        }
    }, [open, fileList, onCancel]);

    return <Modal title={<div>There are some images failed. Do you want to retry them ? <br />
        {fileList.filter(f => f.status === "error").length > 0 && <Tooltip title="retry all">
            <Button shape="circle" onClick={handleRetryAll} color="red" icon={<RedoOutlined />} />
        </Tooltip>}
    </div>} open={open} onOk={() => {
        onCancel();
    }} onCancel={() => {
        onCancel();
    }}>
        <List
            itemLayout="horizontal"
            dataSource={fileList}
            renderItem={(item, index) => {
                if (item.status !== "error") {
                    return <></>;
                }
                const folderText = `Folder: ${getFolderName(item.folder_id)}`;
                let description = <Tag icon={<CloseCircleOutlined />} color="error">
                    Error on {folderText}!
                </Tag>;
                return <List.Item>
                    <List.Item.Meta
                        // avatar={<Avatar src={`https://api.dicebear.com/7.x/miniavs/svg?seed=${index}`} />}
                        avatar={<Avatar src={previewFileList[index]} />}
                        title={item.name}
                        description={description}
                    />
                    {item.status === "error" && <Tooltip title="retry">
                        <Button onClick={() => handleRetry(item, index)} shape="circle" color="red" icon={<RedoOutlined />} />
                    </Tooltip>}
                </List.Item>;
            }}
        />
    </Modal>
}



const FolderUploadPage = () => {
    const locale = useLocale();
    const dispatch = useDispatch();
    const [form] = Form.useForm<FolderForm>();
    const [folderId, setFolderId] = useState<number>();
    const [isOpenAddFolder, setIsOpenAddFolder] = useState(false);
    const [isOpenRetry, setIsOpenRetry] = useState(false);
    const [fileList, setFileList] = useState<CustomUploadFile<any>[]>([]);
    const [previewFileList, setPreviewFileList] = useState<(string | ArrayBuffer)[]>([]);
    const { list: { folders, loading }, create: { response, error } } = useSelector(
        (state: RootState) => state.folder
    );

    const props: UploadProps = {
        name: 'image',
        action: () => {
            return `/api/image/upload?folder_id=${folderId}`;
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
                return { ...f, folder_id: !file ? folderId! : file.folder_id };
            });
            list.forEach((v, i) => {
                var reader = new FileReader();
                var url = reader.readAsDataURL(v.originFileObj!);

                reader.onloadend = function (e) {
                    const l = Array.from(previewFileList);
                    l.push(reader.result ?? `https://api.dicebear.com/7.x/miniavs/svg?seed=${i}`);
                    setPreviewFileList(l);
                };
            });
            setFileList(list);
            setIsOpenRetry(list.filter(i => i.status === "error").length > 0);
        },
        withCredentials: true,
        showUploadList: false
    };

    const handleAddFolder = (values: FolderRequest) => {
        dispatch(createFolderAction(values));
    }

    const clearAddFolderError = () => {
        dispatch(clearCreateFolderError());
    }

    const handleAddFolderSuccess = (response: FolderItem) => {
        dispatch(fetchFolderList());
        setIsOpenAddFolder(false);
        form.setFieldValue("folder_id", response.id);
        setFolderId(response.id);
    }

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


    const getFolderName = (folderId: number) => {

        return folders?.find(f => f.id === folderId)?.name;
    }

    const successfullFiles = useMemo(() => {
        return fileList.filter(f => f.status === 'done');
    }, [fileList]);

    const failedFiles = useMemo(() => {
        return fileList.filter(f => f.status === 'error');
    }, [fileList]);

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


    useEffect(() => {
        dispatch(fetchFolderList());
    }, [dispatch]);

    useEffect(() => {
        if (response) {
            handleAddFolderSuccess(response);
        }
    }, [response, handleAddFolderSuccess]);


    return <div className={styles.FolderUploadPageWrapper}>
        <ProHeader />
        <div className={styles.FolderUploadPage}>

            <Card title="Upload Files" className={styles.upload}
                extra={<div>
                    <Progress size={"small"} type="circle" percent={fileList.length === 0 ? 0 : (successfullFiles.length / fileList.length) * 100} />
                </div>}>
                <Form
                    name="upload"
                    labelCol={{ span: 12 }}
                    layout="vertical"
                    form={form}
                    autoComplete="off"
                >
                    <div>
                        {<Form.Item
                            label={<div className={styles.folderListLabel}>
                                <p>{getTranslation("folder.folderList", "Folder", locale)}</p>
                                <Button
                                    type="dashed"
                                    onClick={() => {
                                        setIsOpenAddFolder(true);
                                    }}
                                    icon={<PlusOutlined />}
                                >
                                    New Folder
                                </Button>
                            </div>}
                            name="folder_id" required>
                            <Select loading={loading} onSelect={v => setFolderId(v)}>
                                {(folders ?? []).map((folder, index) => <Select.Option key={index} value={folder.id}>{folder.name}</Select.Option>)}
                            </Select>
                        </Form.Item>}

                    </div>
                    <Divider />

                    <Upload {...props} disabled={!folderId}>
                        <Button icon={<UploadOutlined />} disabled={!folderId}>Click to Upload</Button>
                    </Upload>
                </Form>
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
                            const folderText = `Folder: ${getFolderName(item.folder_id)}`;
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
            <AddFolderModal error={error} open={isOpenAddFolder} onOk={handleAddFolder} onCancel={() => setIsOpenAddFolder(false)} clearError={clearAddFolderError} />
            <RetryModal open={isOpenRetry} previewFileList={previewFileList} onCancel={() => setIsOpenRetry(false)} fileList={fileList} getFolderName={getFolderName} handleRetry={handleRetry} handleRetryAll={handleRetryAll} />
        </div>
    </div>
}

export default withAuth(FolderUploadPage);