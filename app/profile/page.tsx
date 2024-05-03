"use client";

import './custom.css';
import ProHeader from "@/components/core/header/ProHeader";
import styles from "./profile.module.scss";
import { Avatar, Button, Descriptions, DescriptionsProps, Input, Modal, Spin, Upload, message } from "antd";
import { CloseOutlined, EditOutlined, InboxOutlined, RotateLeftOutlined, RotateRightOutlined, SaveOutlined } from "@ant-design/icons";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { isEmpty } from 'lodash';
import Cropper, { ReactCropperElement } from "react-cropper";
import { UploadProps } from 'antd/lib';
import { RcFile } from 'antd/lib/upload';
import { v4 as uuidv4 } from 'uuid';
import { putAvatarUserAPI, putCoverUserAPI } from '@/apis/user-apis';
import { isSessionLogging } from '@/services/session-service';
import { useDispatch } from 'react-redux';
import { getAccountInfo, updateAccountInfo } from '@/redux/reducers/account/accountProfileSlice';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import withNotification from '@/components/with-notification';
import withAuth from '@/components/with-auth';
import Banner from "@/components/banner";
import TextLoading from '@/components/core/TextLoading';
import { UserInfoResponse } from '@/types/account';
import { updateAccount } from '@/redux/reducers/account/accountUpdateSlice';
import ProfileForm from '@/components/core/forms/ProfileForm';
import moment from 'moment';

//https://flowbite.com/docs/components/forms/

const { Dragger } = Upload;

interface CropModalResult {
    original: string,
    crop: string,
    cropBlob: Blob,
    originalFile?: RcFile
}

const CropModal = ({ open, onCancel, onOk, aspectRatio, title, original }: { open: boolean, aspectRatio: number, title?: string, original?: string, onCancel: () => void, onOk: (res: CropModalResult) => void }) => {
    const [source, setSource] = useState<string>('');
    const [openFile, setOpenFile] = useState(true);
    const cropperRef = useRef<ReactCropperElement>(null);
    const changeRef = useRef<HTMLInputElement>(null);
    const draggerRef = useRef<HTMLDivElement>(null);
    const [fileSource, setFileSource] = useState<RcFile>();
    const onCrop = () => {
        const cropper = cropperRef.current?.cropper;
        //   console.log(cropper?.getCroppedCanvas().toDataURL());
    };
    const getCropData = () => {
        if (typeof cropperRef.current?.cropper !== "undefined") {
            return cropperRef.current?.cropper.getCroppedCanvas().toDataURL();
        }

        return "";
    };

    const props: UploadProps = {
        name: 'file',
        multiple: false,
        accept: "image/*",
        onChange(info) {
            const { status } = info.file;
            if (status !== 'uploading') {
                // console.log(info.file, info.fileList);
            }
            if (status === 'done') {
                message.success(`${info.file.name} file uploaded successfully.`);
                info.fileList.forEach((v, i) => {
                    var reader = new FileReader();
                    var url = reader.readAsDataURL(v.originFileObj!);
                    setFileSource(v.originFileObj);
                    reader.onloadend = function (e) {
                        setSource(reader.result as string ?? '');
                        setOpenFile(false);
                    };
                })
            } else if (status === 'error') {
                message.error(`${info.file.name} file upload failed.`);
            }
        },
        onDrop(e) {
            // console.log('Dropped files', e.dataTransfer.files);
        },
    };

    useEffect(() => {
        if (!isEmpty(original)) {
            setOpenFile(false);
            setSource(original!);
        }
    }, [original]);


    return <Modal open={open} width={'100%'} title={title} onCancel={() => {
        onCancel();
    }} onOk={() => {
        const data = getCropData();
        if (isEmpty(data)) {
            return;
        }

        if (typeof cropperRef.current?.cropper !== "undefined") {
            cropperRef.current?.cropper.getCroppedCanvas().toBlob(res => {

                res && onOk({
                    original: source,
                    crop: data,
                    cropBlob: res,
                    originalFile: fileSource
                });

            })
        }

    }}>
        <div ref={draggerRef}>
            {openFile && <Dragger {...props} >
                <p className="ant-upload-drag-icon">
                    <InboxOutlined />
                </p>
                <p className="ant-upload-text">Click or drag file to this area to upload</p>
            </Dragger>}
            {!openFile && source && <div className={styles.cropperContainer}>
                <Cropper
                    src={source}
                    style={{ width: "100%", maxWidth: '100%', minHeight: 300 }}
                    // Cropper.js options
                    initialAspectRatio={aspectRatio}
                    aspectRatio={aspectRatio}
                    guides={true}
                    viewMode={1}
                    crop={onCrop}
                    allowFullScreen={true}
                    responsive={true}
                    ref={cropperRef}
                // background={false}
                />

                <div className={styles.navGroup}>
                    <Button type="primary" className='gray_transparent_primary_button' onClick={() => {
                        cropperRef.current?.cropper?.rotate(-90);

                    }} icon={<RotateLeftOutlined />} />
                    <Button type="primary" className='gray_transparent_primary_button' onClick={() => {
                        cropperRef.current?.cropper?.rotate(90);

                    }} icon={<RotateRightOutlined />} />
                    <Button type="primary" className='gray_transparent_primary_button' onClick={() => {
                        changeRef?.current?.click();
                    }} icon={<EditOutlined />} />

                    <input type='file' ref={changeRef} onChange={e => {
                        const file = e.target.files?.[0];
                        if (file) {
                            var reader = new FileReader();
                            var url = reader.readAsDataURL(file);
                            setFileSource({ ...file, lastModifiedDate: new Date(), uid: uuidv4() });
                            reader.onloadend = function (e) {
                                setSource(reader.result as string ?? '');
                            };
                        }
                    }} hidden />
                </div>
            </div>}

        </div>
    </Modal>
}


const FullName = ({ data, onUpdate }: { data: UserInfoResponse, onUpdate: (request: { firstName: string, lastName: string }) => void }) => {
    const [editFullname, setEditFullname] = useState(false);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');

    useEffect(() => {
        setFirstName(data?.first_name);
        setLastName(data?.last_name);
    }, [data]);
    return <div className={styles.fullname}>
        {!editFullname && <React.Fragment>
            <p style={{fontWeight: 'bold'}}>{data?.first_name + ' ' + data?.last_name}</p>
        </React.Fragment>}
        {editFullname && <React.Fragment>
            <Input placeholder="First Name" value={firstName} onChange={e => setFirstName(e.target.value)} />
            <Input placeholder="Last Name" value={lastName} onChange={e => setLastName(e.target.value)} />
            <Button type='text' shape='circle' icon={<SaveOutlined />} onClick={() => onUpdate({ firstName: firstName, lastName: lastName })} />
            <Button type='text' shape='circle' icon={<CloseOutlined />} onClick={() => setEditFullname(false)} />
        </React.Fragment>}
    </div>
}

const ProfilePage = () => {
    const [openCover, setOpenCover] = useState(false);
    const [openAvatar, setOpenAvatar] = useState(false);
    const [coverSrc, setCoverSrc] = useState('');
    const [coverOriSrc, setCoverOriSrc] = useState('');
    const [avatar, setAvatar] = useState('');
    const [oriAvatar, setOriAvatar] = useState('');
    const dispatch = useDispatch();
    const { isCompleted, data, isError, loading } = useSelector((state: RootState) => state.account.profile);
    const { isSuccess: isUpdatedSuccess, response: updateResponse, isSubmit: isUpdateSubmit } = useSelector((state: RootState) => state.account.update);

    const items: DescriptionsProps['items'] = useMemo(() => {
        if (isEmpty(data)) {
            return [];
        }
        return [
            {
              key: '1',
              label: 'UserName',
              children: data.username,
            },
            {
              key: '2',
              label: 'Email',
              children: data.email,
            },
            {
              key: '3',
              label: 'First Name',
              children: data.first_name,
            },
            {
              key: '4',
              label: 'Last Name',
              children: data.last_name,
            },
            {
                key: '5',
                label: 'Created Time',
                children: moment(data.created_time).format("YYYY-MM-DD HH:mm:ss"),
            },
            {
                key: '6',
                label: 'Updated Time',
                children: moment(data.updated_time).format("YYYY-MM-DD HH:mm:ss"),
            }
        ];
    },[data]);


    useEffect(() => {
        if (isSessionLogging()) {
            dispatch(getAccountInfo({ locale: undefined }));
        }
    }, []);

    useEffect(() => {
        if (isUpdatedSuccess && !isEmpty(updateResponse)) {
            dispatch(updateAccountInfo(updateResponse));
        }

    },[isUpdatedSuccess, updateResponse]);

    useEffect(() => {
        if (!isEmpty(data?.user_data)) {

            setCoverSrc(`/cover/user${data.id}/${data.user_data.crop_cover}`);
            setCoverOriSrc(`/cover/user${data.id}/${data.user_data.original_cover}`);
            setAvatar(`/avatar/user${data.id}/${data.user_data.crop_avatar}`);
            setOriAvatar(`/avatar/user${data.id}/${data.user_data.original_avatar}`);
        }
    }, [data]);

    return <div className={styles.ProfilePage}>
        <ProHeader />
        <Banner />
        <Spin spinning={loading || isUpdateSubmit}>
            <div className={styles.cover}>
                {isEmpty(coverSrc) ? <img src="https://raw.githubusercontent.com/roadmanfong/react-cropper/master/example/img/child.jpg" /> : <img src={coverSrc} />}

                <div className={styles.avatar}>
                    <div className={styles.avatarWrapper}>
                        <Avatar size={{ xs: 64, sm: 80, md: 80, lg: 100, xl: 100, xxl: 140 }}
                            src={isEmpty(avatar) ? `https://api.dicebear.com/7.x/miniavs/svg?seed=${0}` : avatar} />
                        <Button className={styles.avatarBtn} type='text' shape='circle' icon={<EditOutlined />} onClick={() => setOpenAvatar(true)} />
                    </div>
                    <div className={styles.name}>{loading ? <TextLoading /> : !isEmpty(data) && <FullName data={data} onUpdate={req => {
                        dispatch(updateAccount({ request: { first_name: req.firstName, last_name: req.lastName }, locale: undefined }));
                    }} />}</div>
                    <div className={styles.coverEditBtn}><Button icon={<EditOutlined />} onClick={() => setOpenCover(true)} /></div>
                </div>
                <div className={styles.wrapper}>
                    <Descriptions title="User Info" items={items} />
                    {!isEmpty(data) && <ProfileForm userInfo={data} onUpdate={req => dispatch(updateAccount({ request: req, locale: undefined }))} />}
                </div>
            </div>
        </Spin>

        <CropModal open={openCover} title={'Change Cover'} original={coverOriSrc} aspectRatio={16 / 9} onCancel={() => setOpenCover(false)} onOk={result => {
            const myFile = new File([result.cropBlob], 'image.png', {
                type: result.cropBlob.type,
            });
            putCoverUserAPI({
                request: {
                    originCover: result.originalFile,
                    cropCover: myFile
                }
            }).then(res => {
                setCoverSrc(result.crop);
                setOpenCover(false);
                setCoverOriSrc(result.original);
            }).catch(err => {
                console.log(err);
            })


        }} />

        <CropModal open={openAvatar} title={'Change Avatar'} original={oriAvatar} aspectRatio={1} onCancel={() => setOpenAvatar(false)} onOk={result => {
            const myFile = new File([result.cropBlob], 'image.png', {
                type: result.cropBlob.type,
            });
            putAvatarUserAPI(({
                request: {
                    originAvatar: result.originalFile,
                    cropAvatar: myFile
                }
            })).then(res => {
                setAvatar(result.crop);
                setOpenAvatar(false);
                setOriAvatar(result.original);
            }).catch(err => {
                console.log(err);
            })

        }} />
    </div>
}

export default withNotification(withAuth(ProfilePage));