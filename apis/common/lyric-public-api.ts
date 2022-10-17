import {AxiosResponse} from "axios";
import generalAxios from "../../axios/generalAxios";
import { DEFAULT_LANG} from "../../constants";
import {
    getAccessToken,
    getRefreshToken, getUsername,
    isAccessTokenExpired, isAccountLogging,
    isRefreshTokenExpired, setRefreshTokenLocalStorage
} from "../../services/auth_services";
import {refreshTokenAPI} from "../auth-apis";
import {RefreshTokenResponse} from "../../types/account";

const PREFIX = "/public/lyric";

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

export const preAxios = (isAuthAPI?: boolean): Promise<string | null> => {
    return new Promise((resolve, reject) => {
        if (!isAuthAPI && !isAccountLogging()) {
            resolve(null);
        }
        try {
            let accessToken = getAccessToken();
            if (!accessToken) {
                reject({shouldRedirect: true});
            }
            if (isAccessTokenExpired()) {
                if (isRefreshTokenExpired()) {
                    reject({shouldRedirect: true});
                } else {
                    const token = getRefreshToken();
                    const username = getUsername();
                    refreshTokenAPI({
                        refreshToken: token,
                        username: username
                    }).then(res => {
                        const response = res.data.body as RefreshTokenResponse;
                        accessToken = response.accessToken;
                        setRefreshTokenLocalStorage(response);
                        resolve(accessToken);
                    }).catch(err => reject({shouldRedirect: true}));
                }
            } else {
                resolve(accessToken);
            }
        } catch (e) {
            reject({shouldRedirect: true});
        }
    });
}
export const getLyricRepliedComments = (lyricId: number, commentId: number, offset: number, locale: string | undefined): Promise<AxiosResponse> => {

    return new Promise<AxiosResponse>((resolve, reject) => {
        preAxios().then(accessToken => {
            generalAxios.get<any>(process.env.apiUrl + `${PREFIX}/${lyricId}/comment/${commentId}/replies?offset=${offset ? offset: 0}`,
                { headers: authHeaders(locale, accessToken) as any }).then(res => resolve(res)).catch(err => reject(err));
        }).catch(err => reject(err));
    });
}

export const getLyricInfo = (ref: string, locale: string | undefined): Promise<AxiosResponse> => {

    return new Promise<AxiosResponse>((resolve, reject) => {
        preAxios().then(accessToken => {
            generalAxios.get<any>(process.env.apiUrl + `${PREFIX}/${ref}`,
                { headers: authHeaders(locale, accessToken) as any }).then(res => resolve(res)).catch(err => reject(err));
        }).catch(err => reject(err));
    });
}


export const loadMoreCommentsAPI = (lyricId: number, offset: number, locale: string | undefined): Promise<AxiosResponse> => {

    return new Promise<AxiosResponse>((resolve, reject) => {
        preAxios().then(accessToken => {
            generalAxios.get<any>(process.env.apiUrl + `${PREFIX}/${lyricId}/comments?offset=${offset ? offset: 0}`,
                { headers: authHeaders(locale, accessToken) as any }).then(res => resolve(res)).catch(err => reject(err));
        }).catch(err => reject(err));
    });
}

export const getLyricListAPI = (offset: number, searchText: string | undefined, locale: string | undefined): Promise<AxiosResponse> => {
    return new Promise<AxiosResponse>((resolve, reject) => {
        preAxios().then(accessToken => {
            generalAxios.get<any>(process.env.apiUrl + `${PREFIX}/list?offset=${offset ? offset: 0}${searchText ? '&searchText=' + searchText: ''}`,
                { headers: authHeaders(locale, accessToken) as any }).then(res => resolve(res)).catch(err => reject(err));
        }).catch(err => reject(err));
    });
}