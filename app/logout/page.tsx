"use client";

import withNotification from "@/components/with-notification"
import { clearAuthSessionStorage } from "@/services/auth_services";
import { NotificationProps } from "@/types/page";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSession_SessionId, isSessionAccessTokenExpired, isSessionLogging } from "@/services/session-service";
import { isEmpty } from "lodash";
import { useDispatch } from "react-redux";
import { logout } from "@/redux/reducers/account/accountLogoutSlice";
import { useLocale } from "next-intl";

const LogoutPage = (props: LogoutPageProps) => {
    
    const {onSuccess} = props;
    const [status, setStatus] = useState(0);
    const router = useRouter();
    const dispatch = useDispatch();
    const locale = useLocale();
    useEffect(() => {
        if (status === 0)
            setStatus(1);
        if (status === 1) {
            if (isSessionLogging() && !isSessionAccessTokenExpired()) {
                const sessionId = getSession_SessionId();
                if (!isEmpty(sessionId)) {
                    dispatch(logout({sessionId, locale}));
                }
            }
            clearAuthSessionStorage();
            onSuccess && onSuccess("Your account has been logged out successfully!");
            router.push("/login");
        }
    },[status, router, onSuccess]);

    return <></>
}

interface LogoutPageProps extends NotificationProps {

}

export default withNotification(LogoutPage);