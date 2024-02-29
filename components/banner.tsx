import { getSessionUserInfo, isSessionAccessTokenExpired, isSessionLogging, setLoginSessionStorage } from "@/services/session-service";
import { Alert } from "antd";
import { useEffect, useState } from "react";
import { useSessionAuth } from "./use-session-auth";
import { isEmpty } from "lodash";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useDispatch } from "react-redux";
import { getAccountStatus } from "@/redux/reducers/account/accountStatusSlice";
import { useLocale } from "next-intl";

const Banner = () => {
    const [shouldShowBanner, setShouldShowBanner] = useState(false);
    const [message, setMessage] = useState('');
    const {isError, isSubmit, isVerified} = useSelector((state: RootState) => state.account.status);
    const dispatch = useDispatch();
    const {userInfo} = useSessionAuth();
    const locale = useLocale();
    useEffect(() => {
        if (isSessionLogging() && !isSessionAccessTokenExpired() && !isEmpty(userInfo)) {
            const {is_verify} = userInfo;
            if (!is_verify) {
                dispatch(getAccountStatus({locale}));
            }
            
          }
    },[userInfo]);

    useEffect(() => {
        if (isSubmit) {
            if (isError || !isVerified) {
                setShouldShowBanner(true);
                setMessage("Your account isn't verified! Please verify your account to use our advance features.");
            }
            if (!isEmpty(userInfo) &&  isVerified) {
                setLoginSessionStorage({...userInfo, is_verify: true});
            }
        }
    },[isError, isSubmit, isVerified, userInfo]);
    return shouldShowBanner ? <div style={{position: 'fixed', top: 0, left: 0, width: '100%', zIndex: 12}}><Alert message={message} banner /></div> : <></>
}

export default Banner;