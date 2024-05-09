import { logoutAccount } from "@/apis/auth-apis";
import { getSession_SessionId, isSessionAccessTokenExpired, isSessionLogging } from "@/services/session-service";
import { isEmpty } from "lodash";
import { useLocale } from "next-intl";
import { useEffect } from "react";

const OutSessionComponent = () => {
    const locale = useLocale();
    // Turn off for now
    // useEffect(() => {
    //     window.addEventListener("unload", e => {
            
    //         if (isSessionLogging() && !isSessionAccessTokenExpired()) {
    //             const sessionId = getSession_SessionId();
    //             if (!isEmpty(sessionId)) {
    //                 logoutAccount(sessionId, locale).then(res => res).catch(err => err);
    //             }
    //         }
    //         e.preventDefault();
    //         return "";
    //     })
    // }, []);
    return <div></div>
}

export default OutSessionComponent;