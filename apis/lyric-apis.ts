import {LyricRequest} from "../types/account";
import {AxiosResponse} from "axios";
import authAxios from "../axios/authAxios";
import {
    LyricAddCommentRequest,
    LyricAddReplyRequest,
    LyricLikeCommentRequest,
    LyricLikeReplyRequest, LyricRateRequest
} from "../types/lyric";
import {authHeaders, preAxios, redirectToLogin} from "./common/lyric-public-api";
import {API_TIMEOUT} from "../constants";


export enum LyricStatuses {
    HIDDEN,
    PUBLISH
}

export interface AccountLyricItemResponse {
     id: number;
     title: string;
     content: string;
     description: string;
     rate: number;
     status: LyricStatuses;
     isDeleted: boolean;
     createdDate: string;
     updatedDate: string;
}

export interface LyricListAccountResponse {
    accountId: number;
    total: number;
    lyrics: AccountLyricItemResponse[];
}

export const getOwnLyricList = (locale: string | undefined, offset?: number): Promise<AxiosResponse> => {

    return new Promise<AxiosResponse>((resolve, reject) => {
        preAxios(true).then(accessToken => {
            authAxios.get<LyricListAccountResponse>(process.env.apiUrl + `/lyric/list?offset=${offset? offset: 0}`,
                { headers: authHeaders(locale, accessToken) as any }).then(res => resolve(res)).catch(err => reject(err));
        }).catch(err => redirectToLogin(err, reject));
    });
}

export const likeCommentAPI = (req: LyricLikeCommentRequest, locale: string | undefined): Promise<AxiosResponse> => {

    return new Promise<AxiosResponse>((resolve, reject) => {
        preAxios(true).then(accessToken => {
            authAxios.post<any>(process.env.apiUrl + `/lyric/info/comment/${req.comment_id}/like`, req,
                { headers: authHeaders(locale, accessToken) as any }).then(res => resolve(res)).catch(err => reject(err));
        }).catch(err => redirectToLogin(err, reject));
    });
}

export const likeReplyAPI = (req: LyricLikeReplyRequest, locale: string | undefined): Promise<AxiosResponse> => {

    return new Promise<AxiosResponse>((resolve, reject) => {
        preAxios(true).then(accessToken => {
            authAxios.post<any>(process.env.apiUrl + `/lyric/info/comment/${req.comment_id}/reply/${req.reply_id}/like`, req,
                { headers: authHeaders(locale, accessToken) as any }).then(res => resolve(res)).catch(err => reject(err));
        }).catch(err => redirectToLogin(err, reject));
    });
}

export const addNewCommentAPI = (req: LyricAddCommentRequest, locale: string | undefined): Promise<AxiosResponse> => {

    return new Promise<AxiosResponse>((resolve, reject) => {
        preAxios(true).then(accessToken => {
            authAxios.post<any>(process.env.apiUrl + `/lyric/info/comment/add`, req,
                { headers: authHeaders(locale, accessToken) as any }).then(res => resolve(res)).catch(err => reject(err));
        }).catch(err => redirectToLogin(err, reject));
    });
}

export const addNewReplyCommentAPI = (req: LyricAddReplyRequest, locale: string | undefined): Promise<AxiosResponse> => {

    return new Promise<AxiosResponse>((resolve, reject) => {
        preAxios(true).then(accessToken => {
            authAxios.post<any>(process.env.apiUrl + `/lyric/${req.lyric_id}/comment/${req.comment_id}/reply/add`, req,
                { headers: authHeaders(locale, accessToken) as any }).then(res => resolve(res)).catch(err => reject(err));
        }).catch(err => redirectToLogin(err, reject));
    });
}

export const rateLyricAPI = (lyricId: number, req: LyricRateRequest, locale: string | undefined): Promise<AxiosResponse> => {

    return new Promise<AxiosResponse>((resolve, reject) => {
        preAxios(true).then(accessToken => {
            authAxios.post<any>(process.env.apiUrl + `/lyric/${lyricId}/rate`, req,
                { headers: authHeaders(locale, accessToken) as any }).then(res => resolve(res)).catch(err => reject(err));
        }).catch(err => redirectToLogin(err, reject));
    });
}

export const addLyricAPI = (req: LyricRequest, locale: string | undefined): Promise<AxiosResponse> => {

    return new Promise<AxiosResponse>((resolve, reject) => {
        preAxios(true).then(accessToken => {
            authAxios.post<any>(process.env.apiUrl + `/lyric/add`, req,
                { headers: authHeaders(locale, accessToken) as any }).then(res => resolve(res)).catch(err => reject(err));
        }).catch(err => redirectToLogin(err, reject));
    });
}

export const getEditLyricDetailAPI = (lyricId: number, locale: string | undefined): Promise<AxiosResponse> => {

    return new Promise<AxiosResponse>((resolve, reject) => {
        preAxios(true).then(accessToken => {
            authAxios.get<any>(process.env.apiUrl + `/lyric/edit/${lyricId}`,
                { headers: authHeaders(locale, accessToken) as any }).then(res => resolve(res)).catch(err => reject(err));
        }).catch(err => redirectToLogin(err, reject));
    });
}

export const editLyricAPI = (lyricId: number, req: LyricRequest, locale: string | undefined): Promise<AxiosResponse> => {

    return new Promise<AxiosResponse>((resolve, reject) => {
        preAxios(true).then(accessToken => {
            authAxios.put<any>(process.env.apiUrl + `/lyric/edit/${lyricId}`,req,
                { headers: authHeaders(locale, accessToken) as any }).then(res => resolve(res)).catch(err => reject(err));
        }).catch(err => redirectToLogin(err, reject));
    });
}

export const deleteLyricAPI = (lyricId: number, locale: string | undefined): Promise<AxiosResponse> => {

    return new Promise<AxiosResponse>((resolve, reject) => {
        preAxios(true).then(accessToken => {
            authAxios.delete<any>(process.env.apiUrl + `/lyric/${lyricId}`,
                { headers: authHeaders(locale, accessToken) as any }).then(res => resolve(res)).catch(err => reject(err));
        }).catch(err => redirectToLogin(err, reject));
    });
}
