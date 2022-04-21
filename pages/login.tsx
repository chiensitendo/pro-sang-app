import { Button, Checkbox, Form, Input } from "antd";
import { AxiosResponse } from "axios";
import moment from "moment";
import { NextPage } from "next";
import { useRouter } from "next/router";
import React from "react";
import { loginAccount } from "../apis/auth-apis";
import withNotification from "../components/with-notification";
import { setLoginSessionStorage } from "../services/session-service";
import { LoginRequest, LoginResponse } from "../types/account";
import { GlobalError } from "../types/error";
import { NotificationProps } from "../types/page";

const LoginPage: NextPage = (props: LoginPageProps) => {
    const {onErrors, onSuccess} = props;
    const router = useRouter();
    const [isSubmit, setIsSubmit] = React.useState(false);

    const handleLoginResponse = (res: AxiosResponse<any>) => {
        if (res && res.data && res.data.body) {
            setLoginSessionStorage(res.data.body as LoginResponse);
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
            onSuccess && onSuccess("Your login is successfully!");
            router.push("/lyric");
        }).catch((err)  => onErrors && onErrors(err) && setIsSubmit(false));
    };

    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
    };

    return <div style={{display: "flex", alignItems: "center", justifyContent: "center", height: "100vh"}}>
        <Form
            name="basic"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            initialValues={{ remember: true }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
            >
                <Form.Item
                label="Username"
                name="username"
                rules={[{ required: true, message: 'Please input your username!' }]}
                >
                <Input />
                </Form.Item>

                <Form.Item
                label="Password"
                name="password"
                rules={[{ required: true, message: 'Please input your password!' }]}
                >
                <Input.Password />
                </Form.Item>

                <Form.Item name="remember" valuePropName="checked" wrapperCol={{ offset: 8, span: 16 }}>
                <Checkbox>Remember me</Checkbox>
                </Form.Item>

                <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                <Button type="primary" htmlType="submit" disabled = {isSubmit}>
                    Submit
                </Button>
                </Form.Item>
        </Form>
    </div>
}

interface LoginPageProps extends NotificationProps {
    children?: any;
}

export default withNotification(LoginPage);