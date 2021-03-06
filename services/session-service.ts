import moment from "moment";
import { LoginResponse, RefreshTokenResponse } from "../types/account";

const PREFIX = "PRO_SANG_";


export const isSessionLogging = () => {
    return !(!sessionStorage.getItem(PREFIX + "TOKEN") || 
           !sessionStorage.getItem(PREFIX + "RERESH_TOKEN") || 
           !sessionStorage.getItem(PREFIX + "USERNAME"));
}

export const setLoginSessionStorage = (res: LoginResponse) => {

    if (!res) {
        return;
    }
    sessionStorage.setItem(PREFIX + "TOKEN", res.accessToken);
    sessionStorage.setItem(PREFIX + "RERESH_TOKEN", res.refreshToken);
    sessionStorage.setItem(PREFIX + "USERNAME", res.username);
    sessionStorage.setItem(PREFIX + "TOKEN_EXPIRED_TIME", res.accessTokenExpiredTime + "+07:00");
    sessionStorage.setItem(PREFIX + "REFRESH_TOKEN_EXPIRED_TIME", res.refreshTokenExpiredTime + "+07:00");
}

export const setRefreshTokenSessionStorage = (res: RefreshTokenResponse) => {

    if (!res) {
        return;
    }
    sessionStorage.setItem(PREFIX + "TOKEN", res.accessToken);
    sessionStorage.setItem(PREFIX + "RERESH_TOKEN", res.refreshToken);
    sessionStorage.setItem(PREFIX + "TOKEN_EXPIRED_TIME", res.accessTokenExpiredTime + "+07:00");
    sessionStorage.setItem(PREFIX + "REFRESH_TOKEN_EXPIRED_TIME", res.refreshTokenExpiredTime + "+07:00");
}

export const isSessionRefreshTokenExpired = () => {
    const expiredTimeStr = sessionStorage.getItem(PREFIX + "REFRESH_TOKEN_EXPIRED_TIME");
    if (!expiredTimeStr) {
        return false;
    }
    const expiredTime = moment.utc(expiredTimeStr).local();
    if (!expiredTime.isValid()) {
        return false;
    }
    return moment().isAfter(expiredTime);
}

export const isSessionAccessTokenExpired = () => {
    const expiredTimeStr = sessionStorage.getItem(PREFIX + "TOKEN_EXPIRED_TIME");
    if (!expiredTimeStr) {
        return false;
    }
    const expiredTime = moment.utc(expiredTimeStr).local();
    if (!expiredTime.isValid()) {
        return false;
    }
    return moment().isAfter(expiredTime);
}

export const getSessionAccessToken = () => {
    const token = sessionStorage.getItem(PREFIX + "TOKEN");
    if (!token) {
        return "";
    }
    return token;
}

export const getSessionRefreshToken = () => {
    const refreshToken = sessionStorage.getItem(PREFIX + "RERESH_TOKEN");
    if (!refreshToken) {
        return "";
    }
    return refreshToken;
}

export const getSessionUsername = () => {
    const username = sessionStorage.getItem(PREFIX + "USERNAME");
    if (!username) {
        return "";
    }
    return username;
}

export const setSessionItem = (key: string, value: string) => {
    sessionStorage.setItem(key, value);
}

export const getSessionItem = (key: string) => {
    sessionStorage.getItem(key);
}