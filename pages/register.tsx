import {NextPage} from "next";
import styles from "./register.module.scss";
import withNotification from "../components/with-notification";
import {Button, Form, Input, Upload} from "antd";
import getTranslation from "../components/translations";
import React, {useEffect, useState} from "react";
import {useRouter} from "next/router";
import {FULL_DATETIME_FORMAT, MAX_TEXT_LENGTH} from "../constants";
import Icon, {HomeFilled, InboxOutlined, LoginOutlined} from "@ant-design/icons";
import {UploadFile} from "antd/lib/upload/interface";
import {getDownloadURL, ref, uploadBytes} from "@firebase/storage";
import {fireBaseDatabase, fireBaseStorage} from "../firebaseConfig";
import {NotificationProps} from "../types/page";
import {ValidateStatus} from "antd/lib/form/FormItem";
import {FieldData, InternalNamePath} from "rc-field-form/lib/interface";
import {useDispatch, useSelector} from "react-redux";
import {clearRegisterState, registerAccount} from "../redux/reducers/account/accountRegisterSlice";
import {CreateAccountRequest, CreateAccountResponse, Roles} from "../types/account";
import {RootState} from "../redux/store";
import {addDoc, collection} from "@firebase/firestore";
import moment from "moment";
import {useLoading} from "../components/core/useLoading";
import ConfirmModal from "../components/core/modals/ConfirmModal";
import MusicIcon from "/public/icons/music_note_1.svg";

interface RegisterFormSharp {
    newUsername: string,
    newEmail: string,
    newPassword: string,
    reNewPassword: string,
    firstName: string,
    lastName: string
    photoUrl: string
}

const uploadFile = async (e: UploadFile, username: string) => {
    const {name, originFileObj} = e;
    const file = originFileObj as File;
    const accountAvatarBuck = `/accounts/${username}/files/avatar/`;
    const accountStorage = ref(fireBaseStorage, accountAvatarBuck + name);
    return uploadBytes(accountStorage, file).then((snapshot) => {
        return getDownloadURL(snapshot.ref).then(url => {
            return url;
        }).catch(err => {
            return err;
        });
    });
}

const createNewRecordOnFireBase = async (response: CreateAccountResponse) => {
    const {username, id, email, created_date, updated_date} = response;
    const accountDb = collection(fireBaseDatabase, `/accounts/${id}/`);
    return addDoc(accountDb, {
        id: id,
        username: username,
        email: email,
        createdDate: moment(created_date, FULL_DATETIME_FORMAT).toDate(),
        updatedDate: moment(updated_date, FULL_DATETIME_FORMAT).toDate()
    }).then(snap => {
        return "";
    }).catch(err => {
        return err;
    });
}

const regex1 = /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$/;
const regex2 = /^[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/;
const checkImage = (imageSrc: string) => {
    return new Promise((resolve, reject) => {
        if (!regex1.test(imageSrc) && !regex2.test(imageSrc)) reject();
        let img = new Image();
        img.onload = function(e) {
            resolve("");
        };
        img.onerror = function (e) {
            reject();
        };
        img.src = imageSrc;
    })
}


const RegisterPage: NextPage<RegisterPageProps> = (props) => {
    const {onSuccess, onErrors} = props;
    const router = useRouter();
    const dispatch = useDispatch();
    const {setLoading} = useLoading();
    const [form] = Form.useForm<RegisterFormSharp>();
    const {response, isSubmit} = useSelector((state: RootState) => state.account.register);
    const [uploadedFile, setUploadedFile] = useState(null);
    const [photoUrlError, setPhotoUrlError] = useState("");
    const [photoUrlStatus, setPhotoUrlStatus] = useState<ValidateStatus>("success");
    const [confirmData, setConfirmData] = useState<RegisterFormSharp | null>(null);
    const doRegister = (values: RegisterFormSharp, photoUrl?: string) => {
        if (confirmData !== null) setConfirmData(null);
        const request: CreateAccountRequest = {
            email: values.newEmail,
            first_name: values.firstName,
            last_name: values.lastName,
            role: Roles.USER,
            username: values.newUsername,
            password: values.newPassword
        }
        if (photoUrl) {
            request.photoUrl = photoUrl;
        }
        dispatch(registerAccount({request, locale: router.locale}));
    }
    const onFinish = (values: RegisterFormSharp) => {
        if (uploadedFile) {
            uploadFile(uploadedFile, values.newUsername).then(url => {
                doRegister(values, url);
            }).catch(err => {
                onErrors && onErrors(getTranslation("notification.uploadPhotoFailed","Oops! Could not upload your photo! Please try again!", router.locale));
            });
        }
        if (values.photoUrl) {
            setPhotoUrlStatus("validating");
            checkImage(values.photoUrl).then(() => {
                setPhotoUrlStatus("success");
                doRegister(values, values.photoUrl);
            }).catch(() => {
                setPhotoUrlStatus("error");
                setPhotoUrlError("Photo Url is invalid!");
                setConfirmData(values);
            });
        } else {
            setPhotoUrlStatus("success");
            setPhotoUrlError("");
            doRegister(values);
        }
    }

    const onFinishFailed = (errorInfo: any) => {
        setPhotoUrlStatus("validating");
        form.getFieldValue('photoUrl') && checkImage(form.getFieldValue('photoUrl').photoUrl).then(() => {
            setPhotoUrlStatus("success");
        }).catch(() => {
            setPhotoUrlStatus("error");
            setPhotoUrlError("Photo Url is invalid!");
        });
    };

    const normFile = (e: any) => {
        if (e?.fileList && e.fileList.length > 0) {
            setUploadedFile(e.fileList[0]);
        } else {
            setUploadedFile(null);
        }
        if (Array.isArray(e)) {
            return e;
        }
        return e?.fileList;
    };

    const handleFieldsChange = (changedFields: FieldData[], allFields: FieldData[]) => {

        changedFields.forEach(field => {
            const {name, value} = field;
            if ((name as InternalNamePath)?.includes("photoUrl")) {
                photoUrlError && setPhotoUrlError("");
                photoUrlStatus === "error" && setPhotoUrlStatus("warning");
                if (!value) {
                    setPhotoUrlError("");
                    setPhotoUrlStatus("success");
                }
            }
        })
    }

    useEffect(() => {
        if (response) {
            setLoading(true);
            createNewRecordOnFireBase(response).then(() => {
                setLoading(false);
            }).catch(() => {
                setLoading(false);
            }).finally(() => {
                onSuccess && onSuccess(getTranslation("notification.createAccountSuccess","Congratulation! Your account has been created successfully!", router.locale));
                router.push("/login").then();
            });
        }
    },[response]);
    useEffect(() => {
       return () => {
           dispatch(clearRegisterState());
       }
    },[]);

    return <div className={styles.wrapper}>
        <div style={{padding: "2rem 0"}}>
            <h1>{getTranslation("account.register", "Register", router.locale)}</h1>
        </div>
        <div>
            <Button onClick={() => router.push("/lyric").then()} icon={ <Icon component={MusicIcon} />}>
                {getTranslation("lyric.list.header", "Lyric List", router.locale)}
            </Button>
            <Button onClick={() => router.push("/login").then()} icon={<LoginOutlined />} type={"primary"}>
                {getTranslation("account.login", "Login", router.locale)}</Button>
        </div>
        <Form

            name="register"
            form={form}
            layout={"vertical"}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            onFieldsChange={handleFieldsChange}
            autoComplete="off"
        >
            <Form.Item
                label={getTranslation("lyric.username", "Username", router.locale)}
                name="newUsername"
                rules={[{ required: true, message: getTranslation("lyric.validation.username.required",'Please input your username!' ,router.locale)}]}
            >
                <Input autoComplete ="off" maxLength={MAX_TEXT_LENGTH} />
            </Form.Item>

            <Form.Item
                label={getTranslation("lyric.email", "Email", router.locale)}
                name="newEmail"
                rules={[{ required: true, message: getTranslation("validation.email.required",'Please input your email!' ,router.locale)},
                    {type: "email", message: getTranslation("validation.email.email", "", router.locale)}
                ]}
            >
                <Input autoComplete ="off" maxLength={MAX_TEXT_LENGTH} />
            </Form.Item>

            <Form.Item
                label={getTranslation("lyric.password", "Password", router.locale)}
                name="newPassword"
                rules={[{ required: true, message: getTranslation("lyric.validation.password.required", 'Please input your password!', router.locale)}]}
            >
                <Input.Password autoComplete ="off" maxLength={MAX_TEXT_LENGTH} />
            </Form.Item>

            <Form.Item
                label={getTranslation("lyric.rePassword", "Verify Password", router.locale)}
                name="reNewPassword"
                rules={[
                    {
                        validator: function (rule, value, callback) {
                            const password = form.getFieldValue("newPassword");
                            if (password !== value) callback(getTranslation("validation.rePassword.notSame", "Please input correct password!", router.locale));
                            else callback(undefined);
                        }
                    }
                ]}
            >
                <Input.Password autoComplete ="off" maxLength={MAX_TEXT_LENGTH} />
            </Form.Item>
            <Form.Item
                label={getTranslation("account.firstName", "First Name", router.locale)}
                name="firstName"
                rules={[{ required: true, message: getTranslation("validation.firstName.required",'Please input your first name!' ,router.locale)}]}
            >
                <Input autoComplete ="off" maxLength={MAX_TEXT_LENGTH} />
            </Form.Item>
            <Form.Item
                label={getTranslation("account.lastName", "Last Name", router.locale)}
                name="lastName"
                rules={[{ required: true, message: getTranslation("validation.lastName.required",'Please input your last name!' ,router.locale)}]}
            >
                <Input autoComplete ="off" maxLength={MAX_TEXT_LENGTH} />
            </Form.Item>
            <Form.Item
                label={getTranslation("account.photoUrl", "Photo Url", router.locale)}
                name="photoUrl"
                hasFeedback
                validateStatus={photoUrlStatus}
                help={photoUrlError ? photoUrlError: undefined}
                hidden={uploadedFile !== undefined && uploadedFile !== null}
            >
                <Input autoComplete ="off"/>
            </Form.Item>
            <Form.Item label = {getTranslation("account.uploadPhotoUrl", "Upload Photo Url", router.locale)}>
                <Form.Item valuePropName={"fileList"} getValueFromEvent={normFile} noStyle>
                    <Upload.Dragger name={"files"} maxCount={1} onChange={normFile}>
                        <p className="ant-upload-drag-icon">
                            <InboxOutlined />
                        </p>
                        <p className="ant-upload-text">{getTranslation("account.uploadPhotoText","Click or drag file to this area to upload", router.locale)}</p>

                    </Upload.Dragger>
                </Form.Item>
            </Form.Item>
            <Form.Item style={{textAlign: "center"}}>
                <Button type="primary" htmlType="submit" disabled = {isSubmit}>
                    {getTranslation("button.register", "Register", router.locale)}
                </Button>
            </Form.Item>
        </Form>
        <ConfirmModal visible={confirmData !== null}
                      onCancel={() => setConfirmData(null)}
                      onOk={() => confirmData && doRegister(confirmData)}
                      description={getTranslation("notification.inValidPhotoUrlConfirm","Photo url isn't valid or available. Do you want to create new account with our default photo?", router.locale)}
                      locale={router.locale}/>
    </div>
}

interface RegisterPageProps extends NotificationProps {
    children?: any;
}

export default withNotification(RegisterPage);