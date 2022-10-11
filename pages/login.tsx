import { Button, Checkbox, Form, Input } from "antd";
import { AxiosResponse } from "axios";
import moment from "moment";
import { NextPage } from "next";
import { useRouter } from "next/router";
import React from "react";
import { loginAccount } from "../apis/auth-apis";
import withNotification from "../components/with-notification";
import { LoginRequest, LoginResponse } from "../types/account";
import { GlobalError } from "../types/error";
import { NotificationProps } from "../types/page";
import {setLoginLocalStorage} from "../services/auth_services";
import getTranslation from "../components/translations";

const LoginPage: NextPage = (props: LoginPageProps) => {
    const {onErrors, onSuccess} = props;
    const router = useRouter();
    const {redirectUrl} = router.query;
    const [isSubmit, setIsSubmit] = React.useState(false);

    const handleLoginResponse = (res: AxiosResponse) => {
        if (res && res.data && res.data.body) {
            setLoginLocalStorage(res.data.body as LoginResponse);
        } else {
            throw {} as GlobalError;
        }
    }

    const onFinish = (values: any) => {
        const req: LoginRequest = {
            username: values.username,
            password: values.password
        };
        setIsSubmit(true);
        loginAccount(req).then(res => {
            handleLoginResponse(res);
            onSuccess && onSuccess(getTranslation("lyric.notification.loginSuccess","Your login is successfully!", router.locale));
            router.push(redirectUrl ? redirectUrl as string: "/lyric/list").then();
        }).catch((err)  => onErrors && onErrors(err) && setIsSubmit(false));
    };

    const onFinishFailed = (errorInfo: any) => {
        // console.log('Failed:', errorInfo);
    };

    return <div style={{display: "flex", alignItems: "center", justifyContent: "center", height: "100vh"}}>
        <Form
            name="basic"
            labelCol={{ span: 8 }}

            initialValues={{ remember: true }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
            >
                <Form.Item
                label={getTranslation("lyric.username", "Username", router.locale)}
                name="username"
                rules={[{ required: true, message: getTranslation("lyric.validation.username.required",'Please input your username!' ,router.locale)}]}
                >
                <Input />
                </Form.Item>

                <Form.Item
                label={getTranslation("lyric.password", "Password", router.locale)}
                name="password"
                rules={[{ required: true, message: getTranslation("lyric.validation.password.required", 'Please input your password!', router.locale) }]}
                >
                <Input.Password />
                </Form.Item>

                {/*<Form.Item name="remember" valuePropName="checked" wrapperCol={{ offset: 8, span: 16 }}>*/}
                {/*<Checkbox>Remember me</Checkbox>*/}
                {/*</Form.Item>*/}

                <Form.Item style={{textAlign: "center"}}>
                <Button type="primary" htmlType="submit" disabled = {isSubmit}>
                    {getTranslation("lyric.button.login", "Login", router.locale)}
                </Button>
                </Form.Item>
        </Form>
    </div>
}

interface LoginPageProps extends NotificationProps {
    children?: any;
}

export default withNotification(LoginPage);