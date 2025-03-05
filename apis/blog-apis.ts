import { AxiosResponse } from "axios";
import { authHeaders, normalHeaders, preSessionAxios, preSessionAxiosButNotRequired, redirectToLogin } from "./common";
import authAxios from "@/axios/authAxios";
import { CreateBlogRequest } from "@/types/blog";

export const createBlogAPI = (request: CreateBlogRequest, locale?: string): Promise<AxiosResponse> => {

    return new Promise<AxiosResponse>((resolve, reject) => {
        preSessionAxios(true).then(obj => {
            authAxios.post<any>(`/api/blog`,request,
                { headers: authHeaders(obj ? {locale, ...obj}: {locale}) as any, withCredentials: true })
                .then(res => resolve(res)).catch(err => redirectToLogin(err, reject));
        }).catch(err => redirectToLogin(err, reject));
    });
}

export const getBlogsAPI = ({limit, offset, sortBy, ascending, locale}: {limit?: number, offset?: number, sortBy?: string, ascending?: boolean, locale?: string}): Promise<AxiosResponse> => {
    const params: string[] = [];
    if (limit) {
        params.push(`limit=${limit}`);
    }
    if (offset !== undefined && offset !== null) {
        params.push(`offset=${offset}`);
    }
    if (sortBy) {
        params.push(`sortBy=${sortBy}`);
    }
    if (ascending) {
        params.push(`ascending=${ascending}`);
    }


    return new Promise<AxiosResponse>((resolve, reject) => {
        preSessionAxiosButNotRequired().then(obj => {
            authAxios.get<any>(`/api/blog${params.length === 0 ? '': '?' + params.join("&")}`,
            { headers: obj === null ? normalHeaders(locale) : authHeaders({locale, ...obj}) as any})
            .then(res => resolve(res)).catch(err => {
                reject(err);
            });
        }).catch(err => {
            reject(err);
        });
    });
}