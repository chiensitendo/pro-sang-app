import { AxiosResponse } from "axios";
import { authHeaders, preSessionAxios, redirectToLogin } from "./common";
import authAxios from "@/axios/authAxios";
import { FolderRequest, UpdateFolderRequest } from "@/types/folder";

export const getFolderListAPI = (locale?: string): Promise<AxiosResponse> => {

    return new Promise<AxiosResponse>((resolve, reject) => {
        preSessionAxios(true).then(obj => {
            authAxios.get<any>(`/api/folder`,
                { headers: authHeaders(obj ? {locale, ...obj}: {locale}) as any, withCredentials: true })
                .then(res => resolve(res)).catch(err => redirectToLogin(err, reject));
        }).catch(err => redirectToLogin(err, reject));
    });
}

export const createFolderAPI = (request: FolderRequest, locale?: string): Promise<AxiosResponse> => {

    return new Promise<AxiosResponse>((resolve, reject) => {
        preSessionAxios(true).then(obj => {
            authAxios.post<any>(`/api/folder`,request,
                { headers: authHeaders(obj ? {locale, ...obj}: {locale}) as any, withCredentials: true })
                .then(res => resolve(res)).catch(err => redirectToLogin(err, reject));
        }).catch(err => redirectToLogin(err, reject));
    });
}

export const getFolderByIdAPI = (id: number, locale?: string): Promise<AxiosResponse> => {
    return new Promise<AxiosResponse>((resolve, reject) => {
        preSessionAxios(true).then(obj => {
            authAxios.get<any>(`/api/folder/${id}`,
                { headers: authHeaders(obj ? {locale, ...obj}: {locale}) as any, withCredentials: true })
                .then(res => resolve(res)).catch(err => redirectToLogin(err, reject));
        }).catch(err => redirectToLogin(err, reject));
    });
}

export const updateFolderByIdAPI = (id: number, request: UpdateFolderRequest, locale?: string): Promise<AxiosResponse> => {
    return new Promise<AxiosResponse>((resolve, reject) => {
        preSessionAxios(true).then(obj => {
            authAxios.put<any>(`/api/folder/${id}`, request,
                { headers:  authHeaders(obj ? {locale, ...obj}: {locale}) as any, withCredentials: true })
                .then(res => resolve(res)).catch(err => redirectToLogin(err, reject));
        }).catch(err => redirectToLogin(err, reject));
    });
}