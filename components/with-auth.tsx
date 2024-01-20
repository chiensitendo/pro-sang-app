import { NextPage } from "next";
import React, { useEffect } from "react";
import { NotificationProps } from "../types/page";
import { isSessionAccessTokenExpired, isSessionLogging } from "@/services/session-service";
import { useRouter, useParams } from "next/navigation";

const getUri = (location: Location) => {
    if (!location || !location.pathname) return "";
    return location.pathname.substring(1);
}

const withAuth = (WrapperComponent: NextPage<any>) => {
    // eslint-disable-next-line react/display-name
    return (props: any) => {
        const {onErrors, onSuccess} = props;
        const router = useRouter();
        const [shouldLoad, setShouldLoad] = React.useState(false);
        useEffect(() => {
            const isLogging = isSessionLogging();
            const uri = getUri(location);
            const loginUrl = `/login${uri? '?redirectUrl='+ uri: ''}`;
            if (!isLogging) {
                router.push(loginUrl);
                return;
            }
            if (isSessionAccessTokenExpired()) {
                router.push(loginUrl);
                return;
                // if (isRefreshTokenExpired()) {
                //     router.push(loginUrl).then();
                //     return;
                // } else {
                //     const token = getRefreshToken();
                //     const username = getUsername();
                //     refreshTokenAPI({
                //         refreshToken: token,
                //         username: username
                //     }).then(res => {
                //         setRefreshTokenLocalStorage(res.data.body as RefreshTokenResponse);
                //         setShouldLoad(true);
                //     }).catch(err => router.push(loginUrl));
                // }
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