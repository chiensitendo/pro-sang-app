import { DEFAULT_LANG } from "@/constants";
import { clearAuthSessionStorage } from "@/services/auth_services";
import { getSessionAccessToken, isSessionAccessTokenExpired, isSessionLogging } from "@/services/session-service";

export const langHeader = (locale: string | undefined) => ({
    headers: {
        'Accept-Language': locale ? locale: DEFAULT_LANG,
    }
});

export const authHeaders = (locale: string | undefined, accessToken?: string | null) => {
    if (!accessToken) {
        return {'Accept-Language': locale ? locale: DEFAULT_LANG};
    }
    return {
        'Access-Control-Allow-Origin': '*',
        'Authorization': `Bearer ${accessToken}`,
        'Accept-Language': locale ? locale: DEFAULT_LANG,
    }
};

export const redirectToLogin = (err: any, reject: any) => {
    if (!err.shouldRedirect) {
    } else {
        window.location.href = "/login";
    }
    reject(err);
}

export const preSessionAxios = (isAuthAPI?: boolean): Promise<string | null> => {
    return new Promise((resolve, reject) => {
        if (!isAuthAPI && !isSessionLogging()) {
            resolve(null);
        }
        try {
            let accessToken = getSessionAccessToken();
            if (!accessToken) {
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
                resolve(accessToken);
            }
        } catch (e) {
            reject({shouldRedirect: true});
        }
    });
}

export const preSessionAxiosButNotRequired = (): Promise<string | null> => {
    return new Promise((resolve, reject) => {
        if (!isSessionLogging()) {
            resolve(null);
        }
        try {
            let accessToken = getSessionAccessToken();
            if (!accessToken) {
                resolve(null);
            }
            if (isSessionAccessTokenExpired()) {
                resolve(null);
            } else {
                resolve(accessToken);
            }
        } catch (e) {
            reject(null);
        }
    });
}