"use client";

import { Button, Form, Input, Result } from "antd";
import { NextPage } from "next";
import { useRouter, useSearchParams } from "next/navigation";
import React, { Suspense, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import withNotification from "@/components/with-notification";
import { RootState } from "@/redux/store";
import getTranslation from "@/components/translations";
import {
  clearLoginState,
  login,
} from "@/redux/reducers/account/accountLoginSlice";
import { LoginRequest } from "@/types/account";
import { NotificationProps } from "@/types/page";
import { useLocale } from "next-intl";
import { setLoginSessionStorage, isSessionLogging, isSessionAccessTokenExpired, getSession_SessionId } from "@/services/session-service";
import { isEmpty } from "lodash";
import { logoutAccount } from "@/apis/auth-apis";

const LoginPage: NextPage = (props: LoginPageProps) => {

  return <Suspense><Login {...props} /></Suspense>
}

const Login = (props: LoginPageProps) => {
  const { onSuccess } = props;
  const router = useRouter();
  const locale = useLocale();
  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams?.get('redirectUrl');
  const { isSubmit, response , isComplete, isTooManyLogin} = useSelector(
    (state: RootState) => state.account.login
  );

  const shouldShowTooManyLogin = isComplete && isTooManyLogin;

  const onFinish = (values: any) => {
    const req: LoginRequest = {
      username: values.username,
      password: values.password,
    };
    dispatch(
      login({
        request: req,
        locale: locale,
      })
    );
  };

  const onFinishFailed = (errorInfo: any) => {
    // console.log('Failed:', errorInfo);
  };

  useEffect(() => {
    if (response !== null) {
      if (isSessionLogging() && !isSessionAccessTokenExpired()) {
        const sessionId = getSession_SessionId();
          if (!isEmpty(sessionId)) {
              logoutAccount(sessionId, locale).then(res => res).catch(err => err);
          }
      }
      setLoginSessionStorage(response);
      onSuccess &&
        onSuccess(
          getTranslation(
            "lyric.notification.loginSuccess",
            "Your login is successfully!",
            locale
          )
        );

      if (redirectUrl) {

        router.push(redirectUrl as string);
      } else {
        router.push("/folder");
      }
    }
  }, [response, redirectUrl, router, locale, onSuccess]);

  useEffect(() => {
    try {
      if (isSessionLogging() && !isSessionAccessTokenExpired()) {
        router.push(redirectUrl ? (redirectUrl as string) : "/images");
      }
    } catch (e) { }
    return () => {
      dispatch(clearLoginState());
    };
  }, [redirectUrl]);


  return <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", flexDirection: "column" }}>
    <div style={{ padding: "2rem 0" }}>
      <h1>{getTranslation("account.login", "Login", locale)}</h1>
    </div>
    {shouldShowTooManyLogin && <Result
      status="error"
      title="You've too many login to this account!"
      subTitle = "Please logout some others to login again."
      extra={[
        <Button key="homepage" onClick={() => window.location.href = "/"}>HomePage</Button>,
      ]}
    >
    </Result>}
    {!shouldShowTooManyLogin && <Form
      name="login"
      labelCol={{ span: 8 }}
      initialValues={{ remember: true }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
    >
      <Form.Item
        label={getTranslation("lyric.username", "Username", locale)}
        name="username"
        rules={[{ required: true, message: getTranslation("lyric.validation.username.required", 'Please input your username!', locale) }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label={getTranslation("lyric.password", "Password", locale)}
        name="password"
        rules={[{ required: true, message: getTranslation("lyric.validation.password.required", 'Please input your password!', locale) }]}
      >
        <Input.Password />
      </Form.Item>

      {/*<Form.Item name="remember" valuePropName="checked" wrapperCol={{ offset: 8, span: 16 }}>*/}
      {/*<Checkbox>Remember me</Checkbox>*/}
      {/*</Form.Item>*/}

      <Form.Item style={{ textAlign: "center" }}>
        <Button type="primary" htmlType="submit" disabled={isSubmit}>
          {getTranslation("lyric.button.login", "Login", locale)}
        </Button>
        <p style={{marginTop: 10}}><a href="/register">Register a new account</a></p>
      </Form.Item>
    </Form>}
    <div style={{ padding: "50px 0 0 0" }}>
      {/* <Button onClick={() => router.push("/lyric")} icon={ <Icon component={MusicIcon} />}>
                {getTranslation("lyric.list.header", "Lyric List", locale)}
            </Button> */}
      {/* <Button onClick={() => router.push("/register")} icon={<UserAddOutlined />} type={"primary"}>
                {getTranslation("account.register", "Register", locale)}</Button> */}
    </div>
  </div>
};

interface LoginPageProps extends NotificationProps {
  children?: any;
}

export default withNotification(LoginPage);
