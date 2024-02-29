import { AxiosResponse } from "axios";
import { authHeaders, preSessionAxios, redirectToLogin } from "./common";
import authAxios from "@/axios/authAxios";

export const getAdminSystemData = ({locale}: {locale?: string}): Promise<AxiosResponse> => {
    const params: string[] = [];
    return new Promise<AxiosResponse>((resolve, reject) => { 
        preSessionAxios(true).then(obj => {
            authAxios.get<any>(`/api/admin${params.length === 0 ? '': '?' + params.join("&")}`,
                { headers: authHeaders(obj ? {locale, ...obj}: {locale}) as any, withCredentials: true })
                .then(res => resolve(res)).catch(err => reject(err));
        }).catch(err => redirectToLogin(err, reject));
    });
}

export const syncFolders = ({locale, folders}: {locale?: string, folders: string[]}): Promise<AxiosResponse> => {
    const params: string[] = [];
    if (folders) {
        params.push(`folders=${folders.join(",")}`);
    }
    return new Promise<AxiosResponse>((resolve, reject) => {
        preSessionAxios(true).then(obj => {
            authAxios.post<any>(`/api/admin/sync/folder${params.length === 0 ? '': '?' + params.join("&")}`,
            null,
                { headers: authHeaders(obj ? {locale, ...obj}: {locale}) as any, withCredentials: true })
                .then(res => resolve(res)).catch(err => reject(err));
        }).catch(err => redirectToLogin(err, reject));
    });
}

export const syncImagesInFolder = (id: number, locale?: string): Promise<AxiosResponse> => {
    return new Promise<AxiosResponse>((resolve, reject) => {
        preSessionAxios(true).then(obj => {
            authAxios.post<any>(`/api/admin/sync/folder/${id}/images`, null,
                { headers: authHeaders(obj ? {locale, ...obj}: {locale}) as any, withCredentials: true })
                .then(res => resolve(res)).catch(err => reject(err));
        }).catch(err => redirectToLogin(err, reject));
    });
}

export const getJobList = ({locale, limit, offset}: { locale?: string, limit?: number, offset?: number}): Promise<AxiosResponse> => {
    const params: string[] = [];
    if (limit) {
        params.push(`limit=${limit}`);
    }
    if (offset !== undefined && offset !== null) {
        params.push(`offset=${offset}`);
    }
    return new Promise<AxiosResponse>((resolve, reject) => {
        preSessionAxios(true).then(obj => {
            authAxios.get<any>(`/api/admin/jobs${params.length === 0 ? '': '?' + params.join("&")}`,
                { headers: authHeaders(obj ? {locale, ...obj}: {locale}) as any, withCredentials: true })
                .then(res => resolve(res)).catch(err => reject(err));
        }).catch(err => redirectToLogin(err, reject));
    });
}