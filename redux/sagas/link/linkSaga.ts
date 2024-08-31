import {all, put, takeLatest} from "@redux-saga/core/effects";
import {showErrorNotification} from "../../reducers/notificationSlice";
import {useLoading} from "../../../components/core/useLoading";
import { PayloadAction } from "@reduxjs/toolkit";
import { ErrorMessage } from "@/types/error";
import { addNewLinkAPI, deleteLinkByIdAPI, getLinkListAPI, updateLinkByIdAPI } from "@/apis/link-api";
import { createLinkActionFailed, createLinkActionSuccess, deleteLinkActionFailed, deleteLinkActionSuccess, fetchLinkListFailed, fetchLinkListSuccess, fetchNextLinkListFailed, fetchNextLinkListSuccess, LinkListAction, updateLinkActionFailed, updateLinkActionSuccess } from "@/redux/reducers/link/linkSlice";
import { LinkRequest } from "@/types/link";
const {setLoading} = useLoading();

export function* addNewLinkSaga(action: PayloadAction<LinkRequest>) {
    try {
        setLoading(true);
        let result: Response = yield addNewLinkAPI(action.payload);
        yield put(createLinkActionSuccess(result));
        setLoading(false);
    } catch (e: any) {
        let message = "";
        if (e?.response?.data) {
            const error: ErrorMessage = e?.response?.data;
            if (error.message) {
                message = error.message;
            }
        }
        setLoading(false);
        yield put(createLinkActionFailed(message));
        yield put(showErrorNotification(e));
    }
}

export function* getLinkListSaga(action: PayloadAction<LinkListAction>) {
    try {
        const {limit, offset} = action.payload;
        setLoading(true);
        let result: Response = yield getLinkListAPI({limit, offset});
        yield put(fetchLinkListSuccess(result));
        setLoading(false);
    } catch (e) {
        setLoading(false);
        yield put(fetchLinkListFailed());
        yield put(showErrorNotification(e));
    }
}

export function* getNextLinkListSaga(action: PayloadAction<LinkListAction>) {
    try {
        const {limit, offset} = action.payload;
        // setLoading(true);
        let result: Response = yield getLinkListAPI({limit, offset});
        yield put(fetchNextLinkListSuccess(result));
        // setLoading(false);
    } catch (e) {
        // setLoading(false);
        yield put(fetchNextLinkListFailed());
        yield put(showErrorNotification(e));
    }
}

export function* updateLinkSaga(action: PayloadAction<{id: number, request: LinkRequest}>) {
    try {
        setLoading(true);
        let result: Response = yield updateLinkByIdAPI(action.payload.id, action.payload.request);
        yield put(updateLinkActionSuccess(result));
        setLoading(false);
    } catch (e: any) {
        let message = "";
        if (e?.response?.data) {
            const error: ErrorMessage = e?.response?.data;
            if (error.message) {
                message = error.message;
            }
        }
        setLoading(false);
        yield put(updateLinkActionFailed({error: message, id: action.payload.id}));
        yield put(showErrorNotification(e));
    }
}

export function* deleteLinkSaga(action: PayloadAction<number>) {
    try {
        setLoading(true);
        let result: Response = yield deleteLinkByIdAPI(action.payload);
        yield put(deleteLinkActionSuccess(result));
        setLoading(false);
    } catch (e: any) {
        let message = "";
        if (e?.response?.data) {
            const error: ErrorMessage = e?.response?.data;
            if (error.message) {
                message = error.message;
            }
        }
        setLoading(false);
        yield put(deleteLinkActionFailed(message));
        yield put(showErrorNotification(e));
    }
}

function* linkSaga() {
    yield all([
        takeLatest("link/createLinkAction", addNewLinkSaga),
        takeLatest("link/fetchLinkList", getLinkListSaga),
        takeLatest("link/fetchNextLinkList", getNextLinkListSaga),
        takeLatest("link/updateLinkAction", updateLinkSaga),
        takeLatest("link/deleteLinkAction", deleteLinkSaga),
    ]);
}

export default linkSaga;