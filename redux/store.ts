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

const sagaMiddleware = createSagaMiddleware();

const store = configureStore({
    reducer: rootReducer,
    middleware: process.env.NODE_ENV !== "production" ?
        new MiddlewareArray().concat(logger, sagaMiddleware): new MiddlewareArray().concat(sagaMiddleware),
});

sagaMiddleware.run(lyricListSaga);
sagaMiddleware.run(lyricCommentsSaga);
sagaMiddleware.run(shellUserSaga);
sagaMiddleware.run(lyricContentSaga);
sagaMiddleware.run(lyricInfoSaga);
sagaMiddleware.run(lyricActionSaga);


export type RootState = ReturnType<typeof store.getState>;

export default store;