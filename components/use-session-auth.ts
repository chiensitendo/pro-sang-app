import { getSessionUserInfo, isSessionAccessTokenExpired, isSessionLogging } from "@/services/session-service";
import { LoginResponseV2 } from "@/types/account";
import { useEffect, useState } from "react"

export const useSessionAuth = () => {
    const [userInfo, setUserInfo] = useState<LoginResponseV2 | null>(null);

    const getFullName = () => {
        if (!userInfo) return "";
        if (!userInfo.first_name) return userInfo.last_name;
        if (!userInfo.last_name) return userInfo.first_name;

        return userInfo.first_name + " " + userInfo.last_name;
    }

    useEffect(() => {
        const isLogging = isSessionLogging();

        if (!isLogging) {
            return;
        }
        if (isSessionAccessTokenExpired()) {
            return;
        } else  {
            setUserInfo(getSessionUserInfo());
        }
    },[]);
    return {
        userInfo,
        isValidAccount: userInfo?.is_verify && userInfo?.is_active,
        getFullName
    }
}