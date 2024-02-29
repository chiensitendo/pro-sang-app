import { NextPage } from "next";
import React, { useEffect } from "react";
import { NotificationProps } from "../types/page";
import { getSession_SessionId, isSessionAccessTokenExpired, isSessionLogging } from "@/services/session-service";
import { useRouter, useParams } from "next/navigation";
import { useLocale } from "next-intl";
import { isEmpty } from "lodash";
import { logoutAccount } from "@/apis/auth-apis";

const getUri = (location: Location) => {
    if (!location || !location.pathname) return "";
    return location.pathname.substring(1);
}

const withAuth = (WrapperComponent: NextPage<any>) => {
    // eslint-disable-next-line react/display-name
    return (props: any) => {
        const {onErrors, onSuccess} = props;
        const router = useRouter();
        const locale = useLocale();
        const [shouldLoad, setShouldLoad] = React.useState(false);
        useEffect(() => {
            const isLogging = isSessionLogging();
            const uri = getUri(location);
            const loginUrl = `/login${uri? '?redirectUrl='+ uri: ''}`;
            const sessionId = getSession_SessionId();
            if (!isLogging) {
                if (!isEmpty(sessionId)) {
                    logoutAccount(sessionId, locale).then(res => res).catch(err => err);
                }
                router.push(loginUrl);
                return;
            }
            if (isSessionAccessTokenExpired()) {
                if (!isEmpty(sessionId)) {
                    logoutAccount(sessionId, locale).then(res => res).catch(err => err);
                }
                router.push(loginUrl);
                return;
            } else  {
                setShouldLoad(true);
            }

        },[router]);
        return shouldLoad ? <WrapperComponent onErrors = {onErrors} onSuccess = {onSuccess} isAuth = {shouldLoad}/> : <React.Fragment></React.Fragment>;
    }
}

interface AuthProps extends NotificationProps {

}

export default withAuth;