import generalAxios from "@/axios/generalAxios";
import { AvatarRequest, CoverRequest, UserContactRequest } from "@/types/account";
import { AxiosResponse } from "axios";
import { preSessionAxiosButNotRequired, authHeaders, preSessionAxios, redirectToLogin } from "./common";
import authAxios from "@/axios/authAxios";

export const sendUserContactEmail = ({request, isAuth, locale}: {request: UserContactRequest, isAuth: boolean, locale?: string}): Promise<AxiosResponse> => {

    return new Promise<AxiosResponse>((resolve, reject) => {
        preSessionAxiosButNotRequired().then(obj => {
            generalAxios.post<any>(`/api/user/contact`,request,
            { headers: obj === null ? undefined : authHeaders({locale, ...obj}) as any})
            .then(res => resolve(res)).catch(err => {
                if (!isAuth) {
                    reject(err);
                } else {
                    redirectToLogin(err, reject);
                }
                
            });
        }).catch(err => {
            if (!isAuth) {
                reject(err);
            } else {
                redirectToLogin(err, reject);
            }
        });
    });
}

export const getContactInfoAPI = (locale?: string): Promise<AxiosResponse> => {
    return new Promise<AxiosResponse>((resolve, reject) => {
        preSessionAxios(true).then(obj => {
            authAxios.get<any>(`/api/user/contact/info`,
                { headers: authHeaders(obj ? {locale, ...obj}: {locale}) as any, withCredentials: true })
                .then(res => resolve(res)).catch(err => redirectToLogin(err, reject));
        }).catch(err => redirectToLogin(err, reject));
    });
}


export const putCoverUserAPI = ({request, locale}: { request: CoverRequest, locale?: string }): Promise<AxiosResponse> => {
    const params: string[] = [];
    const formData = new FormData();
    if (request.originCover) {
        formData.append('origin',request.originCover);
    }
    formData.append('crop',request.cropCover);
    return new Promise<AxiosResponse>((resolve, reject) => {
        preSessionAxios(true).then(obj => {
            authAxios.put<any>(`/api/user/cover${params.length === 0 ? '': '?' + params.join("&")}`, formData,
                { headers: {...authHeaders(obj ? {locale, ...obj}: {locale}) as any}, withCredentials: true })
                .then(res => resolve(res)).catch(err => redirectToLogin(err, reject));
        }).catch(err => redirectToLogin(err, reject));
    });
}

export const putAvatarUserAPI = ({request, locale}: { request: AvatarRequest, locale?: string }): Promise<AxiosResponse> => {
    const params: string[] = [];
    const formData = new FormData();
    if (request.originAvatar) {
        formData.append('origin',request.originAvatar);
    }
    formData.append('crop',request.cropAvatar);
    return new Promise<AxiosResponse>((resolve, reject) => {
        preSessionAxios(true).then(obj => {
            authAxios.put<any>(`/api/user/avatar${params.length === 0 ? '': '?' + params.join("&")}`, formData,
                { headers: {...authHeaders(obj ? {locale, ...obj}: {locale}) as any}, withCredentials: true })
                .then(res => resolve(res)).catch(err => redirectToLogin(err, reject));
        }).catch(err => redirectToLogin(err, reject));
    });
}


export const getUserInfoAPI = (locale?: string): Promise<AxiosResponse> => {
    return new Promise<AxiosResponse>((resolve, reject) => {
        preSessionAxios(true).then(obj => {
            authAxios.get<any>(`/api/user/info`,
                { headers: authHeaders(obj ? {locale, ...obj}: {locale}) as any, withCredentials: true })
                .then(res => resolve(res)).catch(err => redirectToLogin(err, reject));
        }).catch(err => redirectToLogin(err, reject));
    });
}
