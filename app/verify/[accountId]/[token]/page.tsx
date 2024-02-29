"use client";

import styles from "./index.module.scss";
import { verifyAccount } from "@/redux/reducers/account/accountVerifySlice";
import { isEmpty, isNaN, isNumber } from "lodash";
import { useParams, useRouter, notFound } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useLocale } from "next-intl";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { Button, Result } from "antd";
import ProLogo from "@/components/core/logo/ProLogo";
import OutSessionComponent from "@/components/out-session";
import withNotification from "@/components/with-notification";

enum Status {
    INIT = 1,
    VERIFIED = 2,
    ERROR = 3
}

const InvalidToken: React.FC = () => (
    <Result
      status="error"
      title="Token is invalid or expired!"
      extra={[
        <Button key="homepage" onClick={() => window.location.href = "/"}>HomePage</Button>,
      ]}
    >
    </Result>
  );

  const ValidToken: React.FC = () => (
    <Result
      status="success"
      title="Successfully verifed your account!"
      subTitle="Congras!! your account is verified!"
      extra={[
        <Button type="primary" key="login" onClick={() => window.location.href = "/login"}>
          Go Login
        </Button>,
        <Button key="homepage" onClick={() => window.location.href = "/"}>HomePage</Button>,
      ]}
    />
  );

const AccountContainer = ({token, accountId}: {token: string, accountId: number}) => {
    const dispatch = useDispatch();
    const locale = useLocale();
    const {isError, isSubmit, isVerified} = useSelector((state: RootState) => state.account.verify);
    
    useEffect(() => {
        if (!isEmpty(token) && !isEmpty(accountId) && !isNaN(+accountId) && isNumber(+accountId)) {
            dispatch(verifyAccount({
                request: {accountId, verifyToken: token},
                locale
            }))
        }
    },[token, accountId, locale]);
    return <div className={styles.AccountContainer}>
        <ProLogo/>
        <OutSessionComponent/>
        {(isSubmit && isVerified && !isError) && <ValidToken/>}
        {(isSubmit && (!isVerified || isError)) && <InvalidToken/>}
    </div>
}
const AccountVerifyPage = () => {
    const params: {token: string, accountId: number} = useParams<any>();
    const [status, setStatus] = useState<Status.INIT | Status.VERIFIED | Status.ERROR>(Status.INIT );
    useEffect(() => {
        const {accountId, token} = params;
        if (!isEmpty(params) && !isEmpty(accountId) && !isEmpty(token)) {
            if (isNaN(+accountId) || !isNumber(+accountId)) {
                setStatus(Status.ERROR);
            } else {
                setStatus(Status.VERIFIED);
            }
        }
    },[params]);  
    if (status === Status.ERROR) {
        return notFound();
    }
    return params && status === Status.VERIFIED && <AccountContainer token={params.token} accountId={params.accountId}/>

}

export default withNotification(AccountVerifyPage);