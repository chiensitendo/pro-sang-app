import { DEFAULT_LANG } from "@/constants";
import { clearAuthSessionStorage } from "@/services/auth_services";
import { getSessionAccessToken, getSessionUserInfo, getSession_SessionId, isSessionAccessTokenExpired, isSessionLogging } from "@/services/session-service";
import { ErrorMessage } from "@/types/error";
import { ErrorPageType, HttpStatus, SESSION_HEADER } from "@/types/general";

export const langHeader = (locale: string | undefined) => ({
    headers: {
        'Accept-Language': locale ? locale: DEFAULT_LANG,
    }
});

export interface AuthObject {
    locale?: string, 
    sessionId?: string, 
    accessToken?: string | null
}

export const authHeaders = ({locale, sessionId, accessToken}: AuthObject) => {
    if (!accessToken || !sessionId) {
        return {'Accept-Language': locale ? locale: DEFAULT_LANG};
    }
    return {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': 'true',
        'Authorization': `Bearer ${accessToken}`,
        'Accept-Language': locale ? locale: DEFAULT_LANG,
        [`${SESSION_HEADER}`]: sessionId
    }
};

export const redirectToLogin = (err: any, reject: any) => {
    const error: ErrorMessage = err;
    if ([HttpStatus.UNAUTHORIZED].includes(error?.code)) {
        window.location.href = "/logout";
    } else if (err.errorPageType === ErrorPageType.INACTIVE || error?.code === HttpStatus.INACTIVE_ACCOUNT ) {

        window.location.href = `/error/${ErrorPageType.INACTIVE}`;
    } else {
        if (err.shouldRedirect) {
            window.location.href = "/logout";
        }
    }
    
    reject(err);
}

export const preSessionAxios = (isAuthAPI?: boolean): Promise<AuthObject | null> => {
    return new Promise((resolve, reject) => {
        if (!isAuthAPI && !isSessionLogging()) {
            resolve(null);
        }
        try {
            let accessToken = getSessionAccessToken();
            let sessionId = getSession_SessionId();
            const userInfo = getSessionUserInfo();
            if (!userInfo?.is_active) {
                reject({shouldRedirect: true, errorPageType: ErrorPageType.INACTIVE});
                return;
            }
            if (!accessToken || !sessionId) {
                reject({shouldRedirect: true});
            }
            if (isSessionAccessTokenExpired()) {
                clearAuthSessionStorage();
                reject({shouldRedirect: true});
                // if (isRefreshTokenExpired()) {
                //     clearAuthLocalStorage();
                //     reject({shouldRedirect: true});
                // } else {
                //     const token = getRefreshToken();
                //     const username = getUsername();
                //     refreshTokenAPI({
                //         refreshToken: token,
                //         username: username
                //     }).then(res => {
                //         const response = res.data.body as RefreshTokenResponse;
                //         accessToken = response.accessToken;
                //         setRefreshTokenLocalStorage(response);
                //         resolve(accessToken);
                //     }).catch(err => {
                //         clearAuthLocalStorage();
                //         reject({shouldRedirect: true});
                //     });
                // }
            } else {
                resolve({accessToken, sessionId});
            }
        } catch (e) {
            reject({shouldRedirect: true});
        }
    });
}

export const preSessionAxiosButNotRequired = (): Promise<AuthObject | null> => {
    return new Promise((resolve, reject) => {
        if (!isSessionLogging()) {
            resolve(null);
        }
        try {
            let accessToken = getSessionAccessToken();
            let sessionId = getSession_SessionId();
            if (!accessToken || !sessionId) {
                resolve(null);
            }
            if (isSessionAccessTokenExpired()) {
                resolve(null);
            } else {
                resolve({accessToken, sessionId});
            }
        } catch (e) {
            reject(null);
        }
    });
}