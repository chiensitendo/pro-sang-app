import {all, put, takeLatest} from "@redux-saga/core/effects";
import {showErrorNotification} from "../../reducers/notificationSlice";
import {useLoading} from "../../../components/core/useLoading";
import { getFolderByIdAPI } from "@/apis/folder-apis";
import { PayloadAction } from "@reduxjs/toolkit";
import { fetchFolderByIdFailed, fetchFolderByIdSuccess } from "@/redux/reducers/folder/folderDetailReducer";
const {setLoading} = useLoading();

export function* getFolderByIdSaga(action: PayloadAction<number>) {
    try {
        setLoading(true);
        let result: Response = yield getFolderByIdAPI(action.payload);
        yield put(fetchFolderByIdSuccess(result));
        setLoading(false);
    } catch (e) {
        setLoading(false);
        yield put(fetchFolderByIdFailed());
        yield put(showErrorNotification(e));
    }
}

function* folderDetailSaga() {
    yield all([
        takeLatest("folder/detail/fetchFolderById", getFolderByIdSaga)
    ]);
}

export default folderDetailSaga;