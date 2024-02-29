import moment from "moment";
import {LoggingUserInfo, LoginResponse, LoginResponseV2, RefreshTokenResponse} from "../types/account";

const PREFIX = "PRO_SANG_";


export const isSessionLogging = () => {
    return (!(!sessionStorage.getItem(PREFIX + "TOKEN") ||
        !sessionStorage.getItem(PREFIX + "RERESH_TOKEN") ||
        !sessionStorage.getItem(PREFIX + "USERNAME") || 
        !sessionStorage.getItem(PREFIX + "SESSION_ID")));

}

export const setLoginSessionStorage = (res: LoginResponseV2) => {
    if (!res) {
        return;
    }
    sessionStorage.setItem(PREFIX + "TOKEN", res.access_token);
    sessionStorage.setItem(PREFIX + "RERESH_TOKEN", res.refresh_token);
    sessionStorage.setItem(PREFIX + "USERNAME", res.username);
    sessionStorage.setItem(PREFIX + "USER_INFO", JSON.stringify({...res}));
    sessionStorage.setItem(PREFIX + "TOKEN_EXPIRED_TIME", res.expired_time + "+00:00");
    sessionStorage.setItem(PREFIX + "REFRESH_TOKEN_EXPIRED_TIME", res.refresh_expired_time + "+00:00");
    sessionStorage.setItem(PREFIX + "SESSION_ID", res.session_id);
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

export const getSession_SessionId = () => {
    const sessionId = sessionStorage.getItem(PREFIX + "SESSION_ID");
    if (!sessionId) {
        return "";
    }
    return sessionId;
}

export const getSessionUserInfo = (): LoginResponseV2 | null => {
    const userInfoVal = sessionStorage.getItem(PREFIX + "USER_INFO");
    if (!userInfoVal) {
        return null;
    }
    return JSON.parse(userInfoVal);
}

export const setSessionItem = (key: string, value: string) => {
    sessionStorage.setItem(key, value);
}

export const getSessionItem = (key: string) => {
    sessionStorage.getItem(key);
}