import moment from "moment";
import {LoggingUserInfo, LoginResponse, RefreshTokenResponse} from "../types/account";

const PREFIX = "PRO_SANG_";


export const isAccountLogging = () => {
    return (!(!localStorage.getItem(PREFIX + "TOKEN") ||
        !localStorage.getItem(PREFIX + "RERESH_TOKEN") ||
        !localStorage.getItem(PREFIX + "USERNAME")));

}

export const setLoginLocalStorage = (res: LoginResponse) => {

    if (!res) {
        return;
    }
    const userInfo: LoggingUserInfo = {...res};
    localStorage.setItem(PREFIX + "TOKEN", res.accessToken);
    localStorage.setItem(PREFIX + "RERESH_TOKEN", res.refreshToken);
    localStorage.setItem(PREFIX + "USERNAME", res.username);
    localStorage.setItem(PREFIX + "USER_INFO", JSON.stringify(userInfo));
    localStorage.setItem(PREFIX + "TOKEN_EXPIRED_TIME", res.accessTokenExpiredTime + "+07:00");
    localStorage.setItem(PREFIX + "REFRESH_TOKEN_EXPIRED_TIME", res.refreshTokenExpiredTime + "+07:00");
}

export const clearAuthLocalStorage = () => {
    localStorage.removeItem(PREFIX + "TOKEN");
    localStorage.removeItem(PREFIX + "RERESH_TOKEN");
    localStorage.removeItem(PREFIX + "USERNAME");
    localStorage.removeItem(PREFIX + "USER_INFO");
    localStorage.removeItem(PREFIX + "TOKEN_EXPIRED_TIME");
    localStorage.removeItem(PREFIX + "REFRESH_TOKEN_EXPIRED_TIME");
}

export const clearAuthSessionStorage = () => {
    sessionStorage.removeItem(PREFIX + "TOKEN");
    sessionStorage.removeItem(PREFIX + "RERESH_TOKEN");
    sessionStorage.removeItem(PREFIX + "USERNAME");
    sessionStorage.removeItem(PREFIX + "USER_INFO");
    sessionStorage.removeItem(PREFIX + "TOKEN_EXPIRED_TIME");
    sessionStorage.removeItem(PREFIX + "REFRESH_TOKEN_EXPIRED_TIME");
    sessionStorage.removeItem(PREFIX + "SESSION_ID");
}



export const setRefreshTokenLocalStorage = (res: RefreshTokenResponse) => {

    if (!res) {
        return;
    }
    localStorage.setItem(PREFIX + "TOKEN", res.accessToken);
    localStorage.setItem(PREFIX + "RERESH_TOKEN", res.refreshToken);
    localStorage.setItem(PREFIX + "TOKEN_EXPIRED_TIME", res.accessTokenExpiredTime + "+07:00");
    localStorage.setItem(PREFIX + "REFRESH_TOKEN_EXPIRED_TIME", res.refreshTokenExpiredTime + "+07:00");
}

export const isRefreshTokenExpired = () => {
    const expiredTimeStr = localStorage.getItem(PREFIX + "REFRESH_TOKEN_EXPIRED_TIME");
    if (!expiredTimeStr) {
        return false;
    }
    const expiredTime = moment.utc(expiredTimeStr).local();
    if (!expiredTime.isValid()) {
        return false;
    }
    return moment().isAfter(expiredTime);
}

export const isAccessTokenExpired = () => {
    const expiredTimeStr = localStorage.getItem(PREFIX + "TOKEN_EXPIRED_TIME");
    if (!expiredTimeStr) {
        return false;
    }
    const expiredTime = moment.utc(expiredTimeStr).local();
    if (!expiredTime.isValid()) {
        return false;
    }
    return moment().isAfter(expiredTime);
}

export const getAccessToken = () => {
    const token = localStorage.getItem(PREFIX + "TOKEN");
    if (!token) {
        return "";
    }
    return token;
}

export const getRefreshToken = () => {
    const refreshToken = localStorage.getItem(PREFIX + "RERESH_TOKEN");
    if (!refreshToken) {
        return "";
    }
    return refreshToken;
}

export const getUsername = () => {
    const username = localStorage.getItem(PREFIX + "USERNAME");
    if (!username) {
        return "";
    }
    return username;
}

export const getUserInfo = (): LoggingUserInfo | null => {
    const userInfoVal = localStorage.getItem(PREFIX + "USER_INFO");
    if (!userInfoVal) {
        return null;
    }
    return JSON.parse(userInfoVal);
}

export const setItem = (key: string, value: string) => {
    localStorage.setItem(key, value);
}

export const getItem = (key: string) => {
    localStorage.getItem(key);
}