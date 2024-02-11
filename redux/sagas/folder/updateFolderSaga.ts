import {all, put, takeLatest} from "@redux-saga/core/effects";
import {showErrorNotification} from "../../reducers/notificationSlice";
import {useLoading} from "../../../components/core/useLoading";
import { updateFolderByIdAPI } from "@/apis/folder-apis";
import { PayloadAction } from "@reduxjs/toolkit";
import { updateFolderFailed, updateFolderSuccess } from "@/redux/reducers/folder/folderDetailReducer";
import { UpdateFolderRequest } from "@/types/folder";
const {setLoading} = useLoading();

export function* updateFolderFunctionSaga(action: PayloadAction<{id: number, request: UpdateFolderRequest}>) {

    const {id, request} = action.payload;
    try {
        setLoading(true);
        let result: Response = yield updateFolderByIdAPI(id, request);
        yield put(updateFolderSuccess(result));
        setLoading(false);
    } catch (e) {
        setLoading(false);
        yield put(updateFolderFailed());
        yield put(showErrorNotification(e));
    }
}

function* updateFolderSaga() {
    yield all([
        takeLatest("folder/detail/updateFolder", updateFolderFunctionSaga)
    ]);
}

export default updateFolderSaga;