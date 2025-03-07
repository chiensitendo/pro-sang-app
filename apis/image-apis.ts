import { AxiosResponse } from "axios";
import { authHeaders, normalHeaders, preSessionAxios, preSessionAxiosButNotRequired, redirectToLogin } from "./common";
import authAxios from "@/axios/authAxios";
import { RcFile } from "antd/lib/upload";
import generalAxios from "@/axios/generalAxios";
import { DeleteImageRequest, ImageSearchParameter, PublicImageRequest } from "@/types/folder";
import { isEmpty } from "lodash";

export const getImageListByFolderIdAPI = ({folderId, limit, offset, locale, searchParams}: {folderId: number, searchParams: ImageSearchParameter, limit?: number, offset?: number, locale?: string}): Promise<AxiosResponse> => {
    const params: string[] = [];
    if (limit) {
        params.push(`limit=${limit}`);
    }
    if (offset !== undefined && offset !== null) {
        params.push(`offset=${offset}`);
    }
    if (searchParams.is_public !== undefined && searchParams.is_public !== null) {
        params.push(`is_public=${searchParams.is_public}`);
    }

    return new Promise<AxiosResponse>((resolve, reject) => {
        preSessionAxios(true).then(obj => {
            authAxios.get<any>(`/api/image/folder/${folderId}${params.length === 0 ? '': '?' + params.join("&")}`,
                { headers: authHeaders(obj ? {locale, ...obj}: {locale}) as any, withCredentials: true })
                .then(res => resolve(res)).catch(err => redirectToLogin(err, reject));
        }).catch(err => redirectToLogin(err, reject));
    });
}


export const postUpdateFileAPI = ({folder_id, file, locale}: {folder_id: number, file: RcFile, locale?: string }): Promise<AxiosResponse> => {
    const params: string[] = [];
    params.push(`folder_id=${folder_id}`);
    const formData = new FormData();
    formData.append('image',file);
    return new Promise<AxiosResponse>((resolve, reject) => {
        preSessionAxios(true).then(obj => {
            authAxios.post<any>(`/api/image/upload${params.length === 0 ? '': '?' + params.join("&")}`, formData,
                { headers: {...authHeaders(obj ? {locale, ...obj}: {locale}) as any, 'Content-Type': 'multipart/form-data'}, withCredentials: true })
                .then(res => resolve(res)).catch(err => redirectToLogin(err, reject));
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
        preSessionAxiosButNotRequired().then(obj => {
            generalAxios.get<any>(`/public/images${params.length === 0 ? '': '?' + params.join("&")}`,
            { headers: obj === null ? normalHeaders(locale) : authHeaders({locale, ...obj}) as any})
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
        preSessionAxios(true).then(obj => {
            authAxios.put<any>(`/api/image/change-public`, request,
                { headers: {...authHeaders(obj ? {locale, ...obj}: {locale}) as any}, withCredentials: true })
                .then(res => resolve(res)).catch(err => redirectToLogin(err, reject));
        }).catch(err => redirectToLogin(err, reject));
    });
}

export const changeAllPublicOfImagesAPI = ({folderId, request, locale}: {folderId: number, request: PublicImageRequest, locale?: string }): Promise<AxiosResponse> => {

    return new Promise<AxiosResponse>((resolve, reject) => {
        preSessionAxios(true).then(obj => {
            authAxios.put<any>(`/api/image/folder/${folderId}/change-all-public`, request,
                { headers: {...authHeaders(obj ? {locale, ...obj}: {locale}) as any}, withCredentials: true })
                .then(res => resolve(res)).catch(err => redirectToLogin(err, reject));
        }).catch(err => redirectToLogin(err, reject));
    });
}

export const deleteImagesAPI = ({request, locale}: {request: DeleteImageRequest, locale?: string }): Promise<AxiosResponse> => {

    return new Promise<AxiosResponse>((resolve, reject) => {
        preSessionAxios(true).then(obj => {
            authAxios.put<any>(`/api/image/delete`, request,
                { headers: {...authHeaders(obj ? {locale, ...obj}: {locale}) as any}, withCredentials: true })
                .then(res => resolve(res)).catch(err => redirectToLogin(err, reject));
        }).catch(err => redirectToLogin(err, reject));
    });
}

export const moveImageFromFolderToFolderAPI = ({request, sourceFolderId, targetFolderId, locale}: {request: {imageIds: number[]}, sourceFolderId: number, targetFolderId: number, locale?: string }): Promise<AxiosResponse> => {

    return new Promise<AxiosResponse>((resolve, reject) => {
        preSessionAxios(true).then(obj => {
            authAxios.post<any>(`/api/image/move/${sourceFolderId}/${targetFolderId}`, request,
                { headers: {...authHeaders(obj ? {locale, ...obj}: {locale}) as any}, withCredentials: true })
                .then(res => resolve(res)).catch(err => redirectToLogin(err, reject));
        }).catch(err => redirectToLogin(err, reject));
    });
}