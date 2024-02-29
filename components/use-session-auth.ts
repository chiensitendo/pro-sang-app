import { getSessionUserInfo, isSessionAccessTokenExpired, isSessionLogging } from "@/services/session-service";
import { LoginResponseV2 } from "@/types/account";
import { useEffect, useState } from "react"

export const useSessionAuth = () => {
    const [userInfo, setUserInfo] = useState<LoginResponseV2 | null>(null);

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
        isValidAccount: userInfo?.is_verify && userInfo?.is_active
    }
}