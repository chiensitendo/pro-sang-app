import { AxiosResponse } from "axios";
import generalAxios from "../axios/generalAxios";
import { LoginRequest, RefreshTokenRequest } from "../types/account";
import {authHeaders, preAxios, redirectToLogin} from "./common/lyric-public-api";
import authAxios from "../axios/authAxios";
import {LyricListAccountResponse} from "./lyric-apis";

export const loginAccount = (req: LoginRequest): Promise<AxiosResponse> => {
    return generalAxios.post<any>(process.env.apiUrl + "/account/login", req);
}

export const refreshTokenAPI = (req: RefreshTokenRequest): Promise<AxiosResponse> => {
    return generalAxios.post<any>(process.env.apiUrl + "/account/refresh-token", req);
}

export const logoutAccount = (locale?: string | undefined): Promise<AxiosResponse> => {

    return new Promise<AxiosResponse>((resolve, reject) => {
        preAxios(true).then(accessToken => {
            authAxios.post<any>(process.env.apiUrl + "/account/logout",null,
                { headers: authHeaders(locale, accessToken) as any }).then(res => resolve(res)).catch(err => reject(err));
        }).catch(err => redirectToLogin(err, reject));
    });
}