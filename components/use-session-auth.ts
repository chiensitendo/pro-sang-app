import { getSessionUserInfo, isSessionAccessTokenExpired, isSessionLogging } from "@/services/session-service";
import { LoggingUserInfo } from "@/types/account";
import { useEffect, useState } from "react"

export const useSessionAuth = () => {
    const [userInfo, setUserInfo] = useState<LoggingUserInfo | null>(null);

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
        userInfo
    }
}