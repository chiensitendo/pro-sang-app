import { AxiosResponse } from "axios";
import { authHeaders, preSessionAxios, redirectToLogin } from "./common";
import authAxios from "@/axios/authAxios";
import { LinkRequest } from "@/types/link";

export const getLinkListAPI = ({limit, offset, locale}: {limit?: number, offset?: number, locale?: string}): Promise<AxiosResponse> => {
    const params: string[] = [];
    if (limit) {
        params.push(`limit=${limit}`);
    }
    if (offset !== undefined && offset !== null) {
        params.push(`offset=${offset}`);
    }

    return new Promise<AxiosResponse>((resolve, reject) => {
        preSessionAxios(true).then(obj => {
            authAxios.get<any>(`/api/link${params.length === 0 ? '': '?' + params.join("&")}`,
                { headers: authHeaders(obj ? {locale, ...obj}: {locale}) as any, withCredentials: true })
                .then(res => resolve(res)).catch(err => redirectToLogin(err, reject));
        }).catch(err => redirectToLogin(err, reject));
    });
}

export const addNewLinkAPI = (request: LinkRequest, locale?: string): Promise<AxiosResponse> => {

    return new Promise<AxiosResponse>((resolve, reject) => {
        preSessionAxios(true).then(obj => {
            authAxios.post<any>(`/api/link`,request,
                { headers: authHeaders(obj ? {locale, ...obj}: {locale}) as any, withCredentials: true })
                .then(res => resolve(res)).catch(err => redirectToLogin(err, reject));
        }).catch(err => redirectToLogin(err, reject));
    });
}


export const updateLinkByIdAPI = (id: number, request: LinkRequest, locale?: string): Promise<AxiosResponse> => {
    return new Promise<AxiosResponse>((resolve, reject) => {
        preSessionAxios(true).then(obj => {
            authAxios.put<any>(`/api/link/${id}`, request,
                { headers:  authHeaders(obj ? {locale, ...obj}: {locale}) as any, withCredentials: true })
                .then(res => resolve(res)).catch(err => redirectToLogin(err, reject));
        }).catch(err => redirectToLogin(err, reject));
    });
}