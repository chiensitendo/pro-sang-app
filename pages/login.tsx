import { Button, Form, Input } from "antd";
import { NextPage } from "next";
import { useRouter } from "next/router";
import React, {useEffect} from "react";
import withNotification from "../components/with-notification";
import { LoginRequest } from "../types/account";
import { NotificationProps } from "../types/page";
import {isAccountLogging, setLoginLocalStorage} from "../services/auth_services";
import getTranslation from "../components/translations";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../redux/store";
import {clearLoginState, login} from "../redux/reducers/account/accountLoginSlice";
import Icon, {UserAddOutlined} from "@ant-design/icons";
import MusicIcon from "/public/icons/music_note_1.svg";

const LoginPage: NextPage = (props: LoginPageProps) => {
    const {onSuccess} = props;
    const router = useRouter();
    const dispatch = useDispatch();
    const {redirectUrl} = router.query;
    const {isSubmit, response} = useSelector((state: RootState) => state.account.login);

    const onFinish = (values: any) => {
        const req: LoginRequest = {
            username: values.username,
            password: values.password
        };
        dispatch(login({
            request: req,
            locale: router.locale
        }));
    };

    const onFinishFailed = (errorInfo: any) => {
        // console.log('Failed:', errorInfo);
    };

    useEffect(() => {
        if (response !== null) {
            setLoginLocalStorage(response);
            onSuccess && onSuccess(getTranslation("lyric.notification.loginSuccess","Your login is successfully!", router.locale));
            router.push(redirectUrl ? redirectUrl as string: "/lyric/list").then();
        }
    },[response, redirectUrl, router]);

    useEffect(() => {
        try {
            if (isAccountLogging()) {
                router.push(redirectUrl ? redirectUrl as string: "/lyric").then();
            }
        } catch (e) {}
       return () => {
           dispatch(clearLoginState());
       }
    },[]);

    return <div style={{display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", flexDirection: "column"}}>
        <div style={{padding: "2rem 0"}}>
            <h1>{getTranslation("account.login", "Login", router.locale)}</h1>
        </div>
        <Form
            name="loin"
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
        <div style={{padding: "50px 0 0 0"}}>
            <Button onClick={() => router.push("/lyric").then()} icon={ <Icon component={MusicIcon} />}>
                {getTranslation("lyric.list.header", "Lyric List", router.locale)}
            </Button>
            <Button onClick={() => router.push("/register").then()} icon={<UserAddOutlined />} type={"primary"}>
                {getTranslation("account.register", "Register", router.locale)}</Button>
        </div>
    </div>
}

interface LoginPageProps extends NotificationProps {
    children?: any;
}

export default withNotification(LoginPage);