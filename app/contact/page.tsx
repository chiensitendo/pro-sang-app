"use client";

import ProHeader from "@/components/core/header/ProHeader";
import OutSessionComponent from "@/components/out-session";
import styles from "./contact.module.scss";
import withNotification from "@/components/with-notification";
import { Button, Card, Form, Input, Spin } from "antd";
import getTranslation from "@/components/translations";
import { MAX_TEXT_LENGTH } from "@/constants";
import { useLocale } from "next-intl";
import TextArea from "antd/es/input/TextArea";
import { buildMaxRule, buildMinRule } from "@/types/rules";
import { useSessionAuth } from "@/components/use-session-auth";
import { isEmpty } from "lodash";
import { useEffect, useState } from "react";
import { ContactInfo, UserContactRequest } from "@/types/account";
import { getContactInfoAPI, sendUserContactEmail } from "@/apis/user-apis";
import { createMobileSessionId, getMobileSessionId, isSessionLogging } from "@/services/session-service";
import { getAnonymousContactInfo } from "@/apis/public-apis";
import { Statistic } from 'antd';
import { MIN_SECONDS } from "@/types/general";
import { showErrorNotification } from "@/redux/reducers/notificationSlice";

const { Countdown } = Statistic;

interface ContactFormSharp {
    email: string,
    content: string,
    name: string
}


const ContactPage = () => {
    const [form] = Form.useForm<ContactFormSharp>();
    const locale = useLocale();
    const { userInfo, isValidAccount, getFullName } = useSessionAuth();
    const [status, setStatus] = useState(0);
    const [shouldShowForm, setShouldShowForm] = useState(false);
    const [remainingSeconds, setRemainingSeconds] = useState(0);
    const [loading, setLoading] = useState(false);
    const get_ga = () => {
        let result = "";
        const regexp = /_ga=[^;]*;/g;
        var myRegexp = new RegExp(regexp, "g");
        let match = myRegexp.exec(document.cookie);
        while (match != null) {
            result = match[0];
            break;
        }
        return result.replaceAll(";", "").replaceAll("_ga=", "");
    }

    const onFinish = (values: ContactFormSharp) => {
        const request: UserContactRequest = {
            email: values.email,
            content: values.content,
            full_name: values.name
        }
        const _ga = get_ga();
        const mobileSessionId = getMobileSessionId();
        const isAnonymous = !isSessionLogging() && (!isEmpty(_ga) || !isEmpty(mobileSessionId));
        if (isAnonymous) {
            if (!isEmpty(_ga)) {
                request._ga = _ga;
            } else {
                request._ga = mobileSessionId;
            }
        }
        setLoading(true);
        sendUserContactEmail({ request, isAuth: !isAnonymous }).then(res => {
            setShouldShowForm(false);
            if (isAnonymous) {
                setRemainingSeconds(3 * MIN_SECONDS);
                form.setFieldValue("name", "");
                form.setFieldValue("email", "");
            } else {
                setRemainingSeconds(MIN_SECONDS);
            }
            form.setFieldValue("content", "");
        }).catch(err => showErrorNotification(err)).finally(() => setLoading(false));
    };

    const onFinishFailed = (errorInfo: any) => {
        // console.log('Failed:', errorInfo);
    };

    const shouldEnable = !userInfo || isValidAccount;

    useEffect(() => {
        const fullName = getFullName();
        if (!isEmpty(fullName)) {
            form.setFieldValue("name", fullName);
            form.setFieldValue("email", userInfo?.email);
        }


    }, [form, userInfo, getFullName]);

    useEffect(() => {
        if (status === 0)
            setStatus(1);
        if (status === 1) {
            const _ga = get_ga();
            if (!isSessionLogging() && !isEmpty(_ga)) {
                setLoading(true);
                getAnonymousContactInfo({ _ga }).then(res => {
                    const data: ContactInfo = res.data;
                    setShouldShowForm(data?.can_send);
                    setRemainingSeconds(data?.remaining_seconds ?? 0);
                }).catch(err => { setShouldShowForm(false); showErrorNotification(err); }).finally(() => setLoading(false));
            } else {
                if (isSessionLogging()) {
                    setLoading(true);
                    getContactInfoAPI().then(res => {
                        const data: ContactInfo = res.data;
                        setShouldShowForm(data?.can_send);
                        setRemainingSeconds(data?.remaining_seconds ?? 0);
                    }).catch(err => {
                        setShouldShowForm(false);
                        showErrorNotification(err);
                    }).finally(() => setLoading(false));
                } else  {
                    const mobileSessionId = createMobileSessionId();
                    getAnonymousContactInfo({ _ga: mobileSessionId }).then(res => {
                        const data: ContactInfo = res.data;
                        setShouldShowForm(data?.can_send);
                        setRemainingSeconds(data?.remaining_seconds ?? 0);
                    }).catch(err => { setShouldShowForm(false); showErrorNotification(err); }).finally(() => setLoading(false));
                }
            }
        }
    }, [status]);

    return <div className={styles.ContactPage}>
        <ProHeader />
        <OutSessionComponent />
        <Spin spinning={loading}>
            <div className="flex_center">
                {!shouldShowForm && remainingSeconds > 0 && <Countdown style={{ textAlign: 'center' }} title="You can ask another question after" value={Date.now() + remainingSeconds * 1000} onFinish={() => {
                    setShouldShowForm(true);
                    setRemainingSeconds(0);
                }} />}
                {shouldShowForm && <Card className={styles.wrapper}>
                    <h2 style={{ textAlign: 'center' }}>Ask questions to us</h2>
                    <Form
                        name="contact"
                        layout={"vertical"}
                        onFinish={onFinish}
                        form={form}
                        onFinishFailed={onFinishFailed}
                        autoComplete="off"
                        disabled={!shouldEnable}
                    >

                        <Form.Item
                            label={getTranslation("email", "Email", locale)}
                            name="email"
                            rules={[{ required: true, message: getTranslation("validation.email.required", 'Please input your email!', locale) },
                            { type: "email", message: getTranslation("validation.email.email", "", locale) }
                            ]}
                        >
                            <Input autoComplete="off" disabled={!isEmpty(userInfo?.email)} maxLength={MAX_TEXT_LENGTH} />
                        </Form.Item>
                        <Form.Item
                            label={getTranslation("yourName", "Your Name", locale)}
                            name="name"
                            rules={[
                                { required: true, message: getTranslation("validation.name.required", 'Please input your name!', locale) }
                            ]}
                        >
                            <Input autoComplete="off" disabled={!isEmpty(getFullName())} maxLength={MAX_TEXT_LENGTH} />
                        </Form.Item>
                        <Form.Item
                            label={"Your questions"}
                            name="content"
                            rules={[{ required: true, message: "Please input your questions!" },
                            buildMinRule(20),
                            buildMaxRule(1000),
                            ]}
                        >
                            <TextArea autoComplete="off" rows={10} minLength={20} maxLength={1000} />
                        </Form.Item>
                        <Form.Item style={{ textAlign: "center" }}>
                            <Button type="primary" htmlType="submit" disabled={loading} style={{ width: '100%' }}>
                                {getTranslation("button.submit", "Submit", locale)}
                            </Button>
                        </Form.Item>
                    </Form>
                </Card>}
            </div>
        </Spin>
    </div>
}

export default withNotification(ContactPage);