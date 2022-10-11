import { NextPage } from "next";
import { useRouter} from "next/router";
import React, { useEffect } from "react";
import { refreshTokenAPI } from "../apis/auth-apis";
import { RefreshTokenResponse } from "../types/account";
import { NotificationProps } from "../types/page";
import {
    getRefreshToken, getUsername,
    isAccessTokenExpired,
    isAccountLogging,
    isRefreshTokenExpired, setRefreshTokenLocalStorage
} from "../services/auth_services";

const getUri = (location: Location) => {
    if (!location || !location.pathname) return "";
    return location.pathname.substring(1);
}

const withAuth = (WrapperComponent: NextPage<any>) => {
    // eslint-disable-next-line react/display-name
    return (props: AuthProps) => {
        const {onErrors, onSuccess} = props;
        const router = useRouter();
        const [shouldLoad, setShouldLoad] = React.useState(false);
        useEffect(() => {
            const isLogging = isAccountLogging();
            const uri = getUri(location);
            const loginUrl = `/login${uri? '?redirectUrl='+ uri: ''}`;
            if (!isLogging) {
                router.push(loginUrl).then();
                return;
            }
            if (isAccessTokenExpired()) {
                if (isRefreshTokenExpired()) {
                    router.push(loginUrl).then();
                    return;
                } else {
                    const token = getRefreshToken();
                    const username = getUsername();
                    refreshTokenAPI({
                        refreshToken: token,
                        username: username
                    }).then(res => {
                        setRefreshTokenLocalStorage(res.data.body as RefreshTokenResponse);
                        setShouldLoad(true);
                    }).catch(err => router.push(loginUrl));
                }
            } else  {
                setShouldLoad(true);
            }

        },[router]);
        return shouldLoad ? <WrapperComponent onErrors = {onErrors} onSuccess = {onSuccess}/> : <React.Fragment></React.Fragment>;
    }
}

interface AuthProps extends NotificationProps {

}

export default withAuth;