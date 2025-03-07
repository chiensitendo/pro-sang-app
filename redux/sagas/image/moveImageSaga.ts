import { all, put, takeLatest } from "@redux-saga/core/effects";
import { showErrorNotification } from "../../reducers/notificationSlice";
import { useLoading } from "../../../components/core/useLoading";
import { PayloadAction } from "@reduxjs/toolkit";
import { moveImageFromFolderToFolderAPI } from "@/apis/image-apis";
import { moveImageFailed, moveImageSuccess } from "@/redux/reducers/image/folderImageListSlice";
const { setLoading } = useLoading();



export function* moveImageFromFolderToFolderSaga(action: PayloadAction<{ images: number[], sourceFolderId: number, targetFolderId: number }>) {
    const { images, sourceFolderId, targetFolderId } = action.payload;
    try {
        setLoading(true);
        let result: Response = yield moveImageFromFolderToFolderAPI({ request: {imageIds: images}, sourceFolderId, targetFolderId });
        yield put(moveImageSuccess(action.payload));
        setLoading(false);
    } catch (e) {
        setLoading(false);
        yield put(moveImageFailed());
        yield put(showErrorNotification(e));
    }
}

function* moveImageSaga() {
    yield all([
        takeLatest("image/folder/list/moveImage", moveImageFromFolderToFolderSaga)
    ]);
}

export default moveImageSaga;