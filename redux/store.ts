import {configureStore, MiddlewareArray} from "@reduxjs/toolkit";
import rootReducer from "./reducers/rootReducer";
import logger from "redux-logger";
import createSagaMiddleware from "@redux-saga/core";
import lyricListSaga from ".//sagas/lyric/lyricListSaga";
import lyricCommentsSaga from "./sagas/lyric/lyricCommentListSaga";
import shellUserSaga from "./sagas/shellUserSaga";
import lyricContentSaga from "./sagas/lyric/lyricContentSaga";
import lyricInfoSaga from "./sagas/lyric/lyricInfoSaga";
import lyricActionSaga from "./sagas/lyric/lyricActionSaga";
import accountSaga from "./sagas/accountSaga";
import folderListSaga from "./sagas/folder/folderListSaga";
import folderImageListSaga from "./sagas/image/folderImageListSaga";
import createFolderSaga from "./sagas/folder/createFolderSaga";
import publicImageListSaga from "./sagas/image/publicImageListSaga";
import folderDetailSaga from "./sagas/folder/getFolderSaga";
import updateFolderSaga from "./sagas/folder/updateFolderSaga";
import changePublicOfImagesSaga from "./sagas/image/changePublicOfImagesSaga";
import deleteImageSaga from "./sagas/image/deleteImageSaga";
import adminSaga from "./sagas/folder/adminSaga";

const sagaMiddleware = createSagaMiddleware();

const store = configureStore({
    reducer: rootReducer,
    middleware: process.env.NODE_ENV !== "production" ?
        new MiddlewareArray().concat(logger as any, sagaMiddleware): new MiddlewareArray().concat(sagaMiddleware),
});

sagaMiddleware.run(lyricListSaga);
sagaMiddleware.run(lyricCommentsSaga);
sagaMiddleware.run(shellUserSaga);
sagaMiddleware.run(lyricContentSaga);
sagaMiddleware.run(lyricInfoSaga);
sagaMiddleware.run(lyricActionSaga);
sagaMiddleware.run(accountSaga);
sagaMiddleware.run(folderListSaga);
sagaMiddleware.run(folderImageListSaga);
sagaMiddleware.run(createFolderSaga);
sagaMiddleware.run(publicImageListSaga);
sagaMiddleware.run(folderDetailSaga);
sagaMiddleware.run(updateFolderSaga);
sagaMiddleware.run(changePublicOfImagesSaga);
sagaMiddleware.run(deleteImageSaga);
sagaMiddleware.run(adminSaga);

export type RootState = ReturnType<typeof store.getState>;

export default store;