"use client";

import { Button, Card, Form, Input, Modal, Result, Upload } from "antd";
import styles from "./register.module.scss";
import { useRouter, useSearchParams } from "next/navigation";
import { useLocale } from "next-intl";
import { useDispatch } from "react-redux";
import getTranslation from "@/components/translations";
import { MAX_TEXT_LENGTH } from "@/constants";
import { InboxOutlined, LoginOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { ValidateStatus } from "antd/es/form/FormItem";
import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";
import ProHeader from "@/components/core/header/ProHeader";
import { RegisterRequest, RoleIds } from "@/types/account";
import { registerAccount } from "@/redux/reducers/account/accountRegisterSlice";
import ProLogo from "@/components/core/logo/ProLogo";
import { clearAuthSessionStorage } from "@/services/auth_services";
import withNotification from "@/components/with-notification";
import OutSessionComponent from "@/components/out-session";

interface RegisterFormSharp {
    newUsername: string,
    newEmail: string,
    newPassword: string,
    reNewPassword: string,
    firstName: string,
    lastName: string
    photoUrl: string
}

const regex1 = /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$/;
const regex2 = /^[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/;
const checkImage = (imageSrc: string) => {
    return new Promise((resolve, reject) => {
        if (!regex1.test(imageSrc) && !regex2.test(imageSrc)) reject();
        let img = new Image();
        img.onload = function (e) {
            resolve("");
        };
        img.onerror = function (e) {
            reject();
        };
        img.src = imageSrc;
    })
}

const RegisterPage = () => {
    const [form] = Form.useForm<RegisterFormSharp>();
    const router = useRouter();
    const locale = useLocale();
    const dispatch = useDispatch();
    const onFinish = (values: RegisterFormSharp) => {
        const request: RegisterRequest = {
            email: values.newEmail,
            first_name: values.firstName,
            last_name: values.lastName,
            password: values.newPassword,
            username: values.newUsername,
            role_id: RoleIds.USER
        }
        dispatch(registerAccount({ request, locale }));
    };

    const onFinishFailed = (errorInfo: any) => {
        // console.log('Failed:', errorInfo);
    };
    const { response, isSuccess, isSubmit } = useSelector((state: RootState) => state.account.register);
    const [photoUrlStatus, setPhotoUrlStatus] = useState<ValidateStatus>();
    const [uploadedFile, setUploadedFile] = useState(null);
    const [photoUrlError, setPhotoUrlError] = useState("");

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

    useEffect(() => {
        if (isSuccess) {
            const obj: RegisterFormSharp = {
                firstName: "",
                lastName: "",
                newEmail: "",
                newPassword: "",
                newUsername: "",
                photoUrl: "",
                reNewPassword: ""
            }
            form.resetFields(Object.keys(obj));
        }
    }, [isSuccess]);


    return <div className={styles.RegisterPage}>
        {isSuccess && <ProLogo />}
        <OutSessionComponent />
        {!isSuccess && <div className={"flex_center"}>
            <Card className={styles.wrapper} title={<div style={{ display: 'flex' }}><ProLogo /></div>}>
                <h1 style={{ textAlign: 'center' }}>Register Account</h1>
                <Form
                    name="register"
                    layout={"vertical"}
                    onFinish={onFinish}
                    form={form}
                    onFinishFailed={onFinishFailed}
                    autoComplete="off"
                >
                    <Form.Item
                        label={getTranslation("lyric.username", "Username", locale)}
                        name="newUsername"
                        rules={[{ required: true, message: getTranslation("lyric.validation.username.required", 'Please input your username!', locale) }]}
                    >
                        <Input autoComplete="off" maxLength={MAX_TEXT_LENGTH} />
                    </Form.Item>

                    <Form.Item
                        label={getTranslation("lyric.email", "Email", locale)}
                        name="newEmail"
                        rules={[{ required: true, message: getTranslation("validation.email.required", 'Please input your email!', locale) },
                        { type: "email", message: getTranslation("validation.email.email", "", locale) }
                        ]}
                    >
                        <Input autoComplete="off" maxLength={MAX_TEXT_LENGTH} />
                    </Form.Item>

                    <Form.Item
                        label={getTranslation("lyric.password", "Password", locale)}
                        name="newPassword"
                        rules={[{ required: true, message: getTranslation("lyric.validation.password.required", 'Please input your password!', locale) }]}
                    >
                        <Input.Password autoComplete="off" maxLength={MAX_TEXT_LENGTH} />
                    </Form.Item>

                    <Form.Item
                        label={getTranslation("lyric.rePassword", "Verify Password", locale)}
                        name="reNewPassword"
                        rules={[
                            {
                                validator: function (rule, value, callback) {
                                    const password = form.getFieldValue("newPassword");
                                    if (password !== value) callback(getTranslation("validation.rePassword.notSame", "Please input correct password!", locale));
                                    else callback(undefined);
                                }
                            }
                        ]}
                    >
                        <Input.Password autoComplete="off" maxLength={MAX_TEXT_LENGTH} />
                    </Form.Item>
                    <Form.Item
                        label={getTranslation("account.firstName", "First Name", locale)}
                        name="firstName"
                        rules={[{ required: true, message: getTranslation("validation.firstName.required", 'Please input your first name!', locale) }]}
                    >
                        <Input autoComplete="off" maxLength={MAX_TEXT_LENGTH} />
                    </Form.Item>
                    <Form.Item
                        label={getTranslation("account.lastName", "Last Name", locale)}
                        name="lastName"
                        rules={[{ required: true, message: getTranslation("validation.lastName.required", 'Please input your last name!', locale) }]}
                    >
                        <Input autoComplete="off" maxLength={MAX_TEXT_LENGTH} />
                    </Form.Item>
                    {/* <Form.Item
                    label={getTranslation("account.photoUrl", "Photo Url", locale)}
                    name="photoUrl"
                    hasFeedback
                    validateStatus={photoUrlStatus}
                    validateDebounce={1000}
                    help={photoUrlError ? photoUrlError : undefined}
                    hidden={uploadedFile !== undefined && uploadedFile !== null}
                    rules={[{
                        validator: function (rule, value, callback) {

                            return new Promise((resolve, reject) => {
                                if (!value) reject(undefined);
                                checkImage(value).then(() => resolve(undefined)).catch(err => reject("Invalid Url"))
                            })
                        }
                    }]}
                >
                    <Input autoComplete="off" disabled={!!uploadedFile} />
                </Form.Item>
                <Form.Item label={getTranslation("account.uploadPhotoUrl", "Upload Photo Url", locale)}>
                    <Form.Item valuePropName={"fileList"} getValueFromEvent={normFile} noStyle>
                        <Upload.Dragger name={"files"} maxCount={1} onChange={normFile}>
                            <p className="ant-upload-drag-icon">
                                <InboxOutlined />
                            </p>
                            <p className="ant-upload-text">{getTranslation("account.uploadPhotoText", "Click or drag file to this area to upload", locale)}</p>

                        </Upload.Dragger>
                    </Form.Item>
                </Form.Item> */}
                    <Form.Item style={{ textAlign: "center" }}>
                        <Button type="primary" htmlType="submit" style={{ width: '100%' }} disabled={isSubmit}>
                            {getTranslation("button.register", "Register", locale)}
                        </Button>
                        <p className={styles.subText}>Go to <a href="/login"><span>login</span></a></p>
                    </Form.Item>
                </Form>
            </Card>
        </div>}
        {isSuccess && <div>
            <Result
                status="success"
                title="Successfully register your account!"
                subTitle="Congras!! your account has been registered!"
                extra={[
                    <Button type="primary" key="login" onClick={() => window.location.href = "/login"}>
                        Go Login
                    </Button>,
                    <Button key="homepage" onClick={() => window.location.href = "/"}>HomePage</Button>,
                ]}
            />
        </div>}
    </div>
}


export default withNotification(RegisterPage);