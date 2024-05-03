import { AxiosResponse } from "axios";
import generalAxios from "../axios/generalAxios";
import {AccountVerifyRequest, CreateAccountRequest, LoginRequest, RefreshTokenRequest, RegisterRequest, UpdateUserRequest} from "../types/account";
import {langHeader, preAxios, redirectToLogin} from "./common/lyric-public-api";
import authAxios from "../axios/authAxios";
import { preSessionAxios, authHeaders } from "./common";
export const loginAccount = (req: LoginRequest, locale: string | undefined): Promise<AxiosResponse> => {
    return generalAxios.post<any>("/api/auth/login", {password: req.password, loginId: req.username}, {
        ...langHeader(locale), withCredentials: true
    });
}


export const logoutAccount = (sessionId: string, locale: string | undefined): Promise<AxiosResponse> => {

    return new Promise<AxiosResponse>((resolve, reject) => {
        preSessionAxios(true).then(obj => {
            authAxios.post<any>(`/api/auth/logout/${sessionId}`, null,
                { headers: authHeaders(obj ? {locale, ...obj}: {locale}) as any, withCredentials: true })
                .then(res => resolve(res)).catch(err => reject(err));
        }).catch(err => reject(err));
    });
}

export const getAccountStatus = (locale: string | undefined): Promise<AxiosResponse> => {

    return new Promise<AxiosResponse>((resolve, reject) => {
        preSessionAxios(true).then(obj => {
            authAxios.get<any>(`/api/auth/status`,
                { headers: authHeaders(obj ? {locale, ...obj}: {locale}) as any, withCredentials: true })
                .then(res => resolve(res)).catch(err => reject(err));
        }).catch(err => reject(err));
    });
}
export const verifyAccount = (req: AccountVerifyRequest, locale: string | undefined): Promise<AxiosResponse> => {
    return generalAxios.post<any>("/api/auth/verify", req, {
        ...langHeader(locale)
    });
}

export const registerAccountAPI = (req: RegisterRequest, locale: string | undefined): Promise<AxiosResponse> => {
    return generalAxios.post<any>("/api/auth/register", req, {
        ...langHeader(locale), withCredentials: true
    });
}

export const refreshTokenAPI = (req: RefreshTokenRequest): Promise<AxiosResponse> => {
    return generalAxios.post<any>(process.env.apiUrl + "/account/refresh-token", req);
}

export const putUpdateUserAPI = ({request, locale}: { request: UpdateUserRequest, locale?: string }): Promise<AxiosResponse> => {
    const params: string[] = [];
    return new Promise<AxiosResponse>((resolve, reject) => {
        preSessionAxios(true).then(obj => {
            authAxios.put<any>(`/api/auth/update-user${params.length === 0 ? '': '?' + params.join("&")}`, request,
                { headers: {...authHeaders(obj ? {locale, ...obj}: {locale}) as any}, withCredentials: true })
                .then(res => resolve(res)).catch(err => redirectToLogin(err, reject));
        }).catch(err => redirectToLogin(err, reject));
    });
}