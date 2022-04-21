import { AxiosResponse } from "axios";
import generalAxios from "../axios/generalAxios";
import { LoginRequest, RefreshTokenRequest } from "../types/account";

export const loginAccount = (req: LoginRequest): Promise<AxiosResponse<any>> => {
    return generalAxios.post<any>(process.env.apiUrl + "/account/login", req);
}

export const refreshTokenAPI = (req: RefreshTokenRequest): Promise<AxiosResponse<any>> => {
    return generalAxios.post<any>(process.env.apiUrl + "/account/refresh-token", req);
}