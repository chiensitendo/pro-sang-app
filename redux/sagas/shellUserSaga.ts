import {all, put, takeLatest} from "@redux-saga/core/effects";
import {getShellName} from "../../apis/general-apis";
import {PayloadAction} from "@reduxjs/toolkit";
import {fetchShellUserNameSuccess} from "../reducers/shellUserSlice";

export function* fetchShellUserName(action: PayloadAction<String>) {
    const name = action.payload as string;
    let result: Response = yield getShellName(name);
    yield put(fetchShellUserNameSuccess(result));
}

function* shellUserSaga() {
    yield all([
        takeLatest("shell-user/fetchShellUserName", fetchShellUserName)]);
}

export default shellUserSaga;