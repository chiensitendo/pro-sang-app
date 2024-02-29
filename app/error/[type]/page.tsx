"use client";

import { logoutAccount } from "@/apis/auth-apis";
import { clearAuthSessionStorage } from "@/services/auth_services";
import { getSession_SessionId, isSessionAccessTokenExpired, isSessionLogging, setLoginSessionStorage } from "@/services/session-service";
import { ErrorPageType } from "@/types/general";
import { Button, Result } from "antd";
import { isEmpty } from "lodash";
import { useLocale } from "next-intl";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";


const InactiveAccount: React.FC = () => (
    <Result
      status="error"
      title="Your account has been inactived!"
      extra={[
        <Button key="homepage" onClick={() => window.location.href = "/"}>HomePage</Button>
      ]}
    >
    </Result>
  );
const ErrorPage = () => {
    const locale = useLocale();
    const params: {type: number} = useParams<any>();
    const {type: pageType} = params;
    const [status, setStatus] = useState(0);
    const components = useMemo(() => {
        switch(+pageType) {
            case ErrorPageType.INACTIVE:
                return <InactiveAccount/>;
            default:
                return <></>;
        }
    },[pageType]);

    const handleLogout = async () => {
        if (isSessionLogging() && !isSessionAccessTokenExpired()) {
            const sessionId = getSession_SessionId();
            if (!isEmpty(sessionId)) {
                await logoutAccount(sessionId, locale).then(res => res).catch(err => err);
            }
        }
        clearAuthSessionStorage();
    }

    useEffect(() => {
        if (status === 0)
            setStatus(1);
        if (status === 1) {
            handleLogout();
        }
    },[status]);

    return <div>{components}</div>
}


export default ErrorPage;