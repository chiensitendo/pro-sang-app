import { NextPage } from "next";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { refreshTokenAPI } from "../apis/auth-apis";
import { getSessionRefreshToken, getSessionUsername, isSessionAccessTokenExpired, isSessionLogging, isSessionRefreshTokenExpired, setRefreshTokenSessionStorage } from "../services/session-service";
import { RefreshTokenResponse } from "../types/account";
import { NotificationProps } from "../types/page";

const withAuth = (WrapperComponent: NextPage<any>) => {
    // eslint-disable-next-line react/display-name
    return (props: AuthProps) => {
        const {onErrors, onSuccess} = props;
        const router = useRouter();
        const [shouldLoad, setShouldLoad] = React.useState(false);
        useEffect(() => {
            const isLogging = isSessionLogging();
            if (!isLogging) {
                router.push("/login");
                return;
            }
            if (isSessionAccessTokenExpired()) {
                if (isSessionRefreshTokenExpired()) {
                    router.push("/login");
                    return;
                } else {
                    const token = getSessionRefreshToken();
                    const username = getSessionUsername();
                    refreshTokenAPI({
                        refreshToken: token,
                        username: username
                    }).then(res => {
                        setRefreshTokenSessionStorage(res.data.body as RefreshTokenResponse);
                        setShouldLoad(true);
                    }).catch(err => router.push("/login"));
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