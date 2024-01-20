import {all, put, takeLatest} from "@redux-saga/core/effects";
import {showErrorNotification} from "../../reducers/lyric/notificationSlice";
import {useLoading} from "../../../components/core/useLoading";
import { PayloadAction } from "@reduxjs/toolkit";
import { deleteImagesAPI } from "@/apis/image-apis";
import { DeleteImageRequest } from "@/types/folder";
import { deleteImagesFailed, deleteImagesSuccess } from "@/redux/reducers/image/folderImageListSlice";

const {setLoading} = useLoading();



export function* deleteImagesAPISaga(action: PayloadAction<DeleteImageRequest>) {
    try {
        setLoading(true);
        let result: Response = yield deleteImagesAPI({request: action.payload});
        yield put(deleteImagesSuccess(action.payload));
        setLoading(false);
    } catch (e) {
        setLoading(false);
        yield put(deleteImagesFailed());
        yield put(showErrorNotification(e));
    }
}

function* deleteImageSaga() {
    yield all([
        takeLatest("image/folder/list/deleteImages", deleteImagesAPISaga),
    ]);
}

export default deleteImageSaga;