import {all, put, takeLatest} from "@redux-saga/core/effects";
import {PayloadAction} from "@reduxjs/toolkit";
import {CreateAccountRequest, LoginRequest} from "../../types/account";
import {showErrorNotification} from "../reducers/notificationSlice";
import {useLoading} from "../../components/core/useLoading";
import {loginAccount, registerAccountAPI} from "../../apis/auth-apis";
import {loginFailed, loginSuccess} from "../reducers/account/accountLoginSlice";
import {registerAccountFailed, registerAccountSuccess} from "../reducers/account/accountRegisterSlice";
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
        yield put(loginFailed());
        yield put(showErrorNotification(e));
    }
}

export function* registerAccountSaga(action: PayloadAction<{request: CreateAccountRequest, locale: string | undefined}>) {
    try {
        const {request, locale} = action.payload;
        setLoading(true);
        let result: Response = yield registerAccountAPI(request, locale);
        yield put(registerAccountSuccess(result));
        setLoading(false);
    } catch (e) {
        setLoading(false);
        yield put(registerAccountFailed());
        yield put(showErrorNotification(e));
    }
}


function* accountSaga() {
    yield all([
        takeLatest("account/login/login", loginSaga),
        takeLatest("account/register/registerAccount", registerAccountSaga),
    ]);
}

export default accountSaga;