import {all, put, takeLatest} from "@redux-saga/core/effects";
import {PayloadAction} from "@reduxjs/toolkit";
import {AccountVerifyRequest, CreateAccountRequest, LoginRequest, RegisterRequest, UpdateUserRequest} from "../../types/account";
import {showErrorNotification} from "../reducers/notificationSlice";
import {useLoading} from "../../components/core/useLoading";
import {getAccountStatus, loginAccount, logoutAccount, putUpdateUserAPI, registerAccountAPI, verifyAccount} from "../../apis/auth-apis";
import {loginFailed, loginSuccess} from "../reducers/account/accountLoginSlice";
import {registerAccountFailed, registerAccountSuccess} from "../reducers/account/accountRegisterSlice";
import { verifyAccountFailed, verifyAccountSuccess } from "../reducers/account/accountVerifySlice";
import { HttpStatus } from "@/types/general";
import { logoutFailed, logoutSuccess } from "../reducers/account/accountLogoutSlice";
import { getAccountStatusFailed, getAccountStatusSuccess } from "../reducers/account/accountStatusSlice";
import { getUserInfoAPI } from "@/apis/user-apis";
import { getAccountInfoFailed, getAccountInfoSuccess } from "../reducers/account/accountProfileSlice";
import { updateAccountFailed, updateAccountSuccess } from "../reducers/account/accountUpdateSlice";
const {setLoading} = useLoading();

export function* loginSaga(action: PayloadAction<{request: LoginRequest, locale: string | undefined}>) {
    try {
        const {request, locale} = action.payload;
        setLoading(true);
        let result: Response = yield loginAccount(request, locale);
        yield put(loginSuccess(result));
        setLoading(false);
    } catch (e) {
        setLoading(false);
        yield put(loginFailed((e as any)?.code === HttpStatus.MAX_LOGIN_TIME));
        yield put(showErrorNotification(e));
    }
}

export function* logoutSaga(action: PayloadAction<{sessionId: string, locale: string | undefined}>) {
    try {
        const {sessionId, locale} = action.payload;
        setLoading(true);
        let result: Response = yield logoutAccount(sessionId, locale);
        yield put(logoutSuccess(result));
        setLoading(false);
    } catch (e) {
        setLoading(false);
        yield put(logoutFailed());
        yield put(showErrorNotification(e));
    }
}

export function* verifyAccountSaga(action: PayloadAction<{request: AccountVerifyRequest, locale: string | undefined}>) {
    try {
        const {request, locale} = action.payload;
        setLoading(true);
        let result: Response = yield verifyAccount(request, locale);
        yield put(verifyAccountSuccess(result));
        setLoading(false);
    } catch (e) {
        setLoading(false);
        yield put(verifyAccountFailed());
        yield put(showErrorNotification(e));
    }
}

export function* getAccountStatusSaga(action: PayloadAction<{locale: string | undefined}>) {
    try {
        const {locale} = action.payload;
        let result: Response = yield getAccountStatus(locale);
        yield put(getAccountStatusSuccess(result));
    } catch (e) {
        yield put(getAccountStatusFailed());
    }
}

export function* registerAccountSaga(action: PayloadAction<{request: RegisterRequest, locale: string | undefined}>) {
    try {
        const {request, locale} = action.payload;
        setLoading(true);
        let result: Response = yield registerAccountAPI({...request, is_test: true}, locale);
        yield put(registerAccountSuccess(result));
        setLoading(false);
    } catch (e) {
        setLoading(false);
        yield put(registerAccountFailed());
        yield put(showErrorNotification(e));
    }
}

export function* updateAccountSaga(action: PayloadAction<{request: UpdateUserRequest, locale: string | undefined}>) {
    try {
        const {request, locale} = action.payload;
        setLoading(true);
        let result: Response = yield putUpdateUserAPI({request});
        yield put(updateAccountSuccess(result));
        setLoading(false);
    } catch (e) {
        setLoading(false);
        yield put(updateAccountFailed());
        yield put(showErrorNotification(e));
    }
}


export function* getAccountInfoSaga(action: PayloadAction<{locale: string | undefined}>) {
    try {
        const {locale} = action.payload;
        let result: Response = yield getUserInfoAPI(locale);
        yield put(getAccountInfoSuccess(result));
    } catch (e) {
        yield put(getAccountInfoFailed());
    }
}

function* accountSaga() {
    yield all([
        takeLatest("account/login/login", loginSaga),
        takeLatest("account/logout/logout", logoutSaga),
        takeLatest("account/register/registerAccount", registerAccountSaga),
        takeLatest("account/update/updateAccount", updateAccountSaga),
        takeLatest("account/verify/verifyAccount", verifyAccountSaga),
        takeLatest("account/status/getAccountStatus", getAccountStatusSaga),
        takeLatest("account/profile/getAccountInfo", getAccountInfoSaga),
    ]);
}

export default accountSaga;