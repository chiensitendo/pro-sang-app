import { AxiosResponse } from "axios";
import { authHeaders, preSessionAxios, preSessionAxiosButNotRequired, redirectToLogin } from "./common";
import authAxios from "@/axios/authAxios";
import { RcFile } from "antd/lib/upload";
import generalAxios from "@/axios/generalAxios";
import { DeleteImageRequest, PublicImageRequest } from "@/types/folder";

export const getImageListByFolderIdAPI = ({folderId, limit, offset, locale}: {folderId: number, limit?: number, offset?: number, locale?: string}): Promise<AxiosResponse> => {
    const params: string[] = [];
    if (limit) {
        params.push(`limit=${limit}`);
    }
    if (offset !== undefined && offset !== null) {
        params.push(`offset=${offset}`);
    }

    return new Promise<AxiosResponse>((resolve, reject) => {
        preSessionAxios(true).then(accessToken => {
            authAxios.get<any>(`/api/image/folder/${folderId}${params.length === 0 ? '': '?' + params.join("&")}`,
                { headers: authHeaders(locale, accessToken) as any, withCredentials: true })
                .then(res => resolve(res)).catch(err => reject(err));
        }).catch(err => redirectToLogin(err, reject));
    });
}


export const postUpdateFileAPI = ({folder_id, file, locale}: {folder_id: number, file: RcFile, locale?: string }): Promise<AxiosResponse> => {
    const params: string[] = [];
    params.push(`folder_id=${folder_id}`);
    const formData = new FormData();
    formData.append('image',file);
    return new Promise<AxiosResponse>((resolve, reject) => {
        preSessionAxios(true).then(accessToken => {
            authAxios.post<any>(`/api/image/upload${params.length === 0 ? '': '?' + params.join("&")}`, formData,
                { headers: {...authHeaders(locale, accessToken) as any, 'Content-Type': 'multipart/form-data'}, withCredentials: true })
                .then(res => resolve(res)).catch(err => reject(err));
        }).catch(err => redirectToLogin(err, reject));
    });
}

export const getPublicImageListAPI = ({limit, offset, locale}: {limit?: number, offset?: number, locale?: string}): Promise<AxiosResponse> => {
    const params: string[] = [];
    if (limit) {
        params.push(`limit=${limit}`);
    }
    if (offset !== undefined && offset !== null) {
        params.push(`offset=${offset}`);
    }

    return new Promise<AxiosResponse>((resolve, reject) => {
        preSessionAxiosButNotRequired().then(accessToken => {
            generalAxios.get<any>(`/public/images${params.length === 0 ? '': '?' + params.join("&")}`,
            { headers: accessToken === null ? undefined : authHeaders(locale, accessToken) as any})
            .then(res => resolve(res)).catch(err => {
                reject(err);
            });
        }).catch(err => {
            reject(err);
        });
    });
}

export const changePublicOfImagesAPI = ({request, locale}: {request: PublicImageRequest, locale?: string }): Promise<AxiosResponse> => {

    return new Promise<AxiosResponse>((resolve, reject) => {
        preSessionAxios(true).then(accessToken => {
            authAxios.put<any>(`/api/image/change-public`, request,
                { headers: {...authHeaders(locale, accessToken) as any}, withCredentials: true })
                .then(res => resolve(res)).catch(err => reject(err));
        }).catch(err => redirectToLogin(err, reject));
    });
}

export const changeAllPublicOfImagesAPI = ({folderId, request, locale}: {folderId: number, request: PublicImageRequest, locale?: string }): Promise<AxiosResponse> => {

    return new Promise<AxiosResponse>((resolve, reject) => {
        preSessionAxios(true).then(accessToken => {
            authAxios.put<any>(`/api/image/folder/${folderId}/change-all-public`, request,
                { headers: {...authHeaders(locale, accessToken) as any}, withCredentials: true })
                .then(res => resolve(res)).catch(err => reject(err));
        }).catch(err => redirectToLogin(err, reject));
    });
}

export const deleteImagesAPI = ({request, locale}: {request: DeleteImageRequest, locale?: string }): Promise<AxiosResponse> => {

    return new Promise<AxiosResponse>((resolve, reject) => {
        preSessionAxios(true).then(accessToken => {
            authAxios.put<any>(`/api/image/delete`, request,
                { headers: {...authHeaders(locale, accessToken) as any}, withCredentials: true })
                .then(res => resolve(res)).catch(err => reject(err));
        }).catch(err => redirectToLogin(err, reject));
    });
}