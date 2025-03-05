import {all, put, takeLatest} from "@redux-saga/core/effects";
import {showErrorNotification} from "../../reducers/notificationSlice";
import {useLoading} from "../../../components/core/useLoading";
import { PayloadAction } from "@reduxjs/toolkit";
import { ErrorMessage } from "@/types/error";
import { CreateBlogRequest } from "@/types/blog";
import { createBlogAPI, getBlogsAPI } from "@/apis/blog-apis";
import { createBlogActionFailed, createBlogActionSuccess } from "@/redux/reducers/blog/createBlogReducer";
import { BlogListAction, changeBlogListLimitFailed, changeBlogListLimitSuccess, fetchBlogListFailed, fetchBlogListSuccess, fetchNextBlogListFailed, fetchNextBlogListSuccess } from "@/redux/reducers/blog/blogListReducer";
const {setLoading} = useLoading();

export function* createBlog(action: PayloadAction<CreateBlogRequest>) {
    try {
        setLoading(true);
        let result: Response = yield createBlogAPI(action.payload);
        yield put(createBlogActionSuccess(result));
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
        yield put(createBlogActionFailed(message));
        yield put(showErrorNotification(e));
    }
}

export function* getBlogList(action: PayloadAction<BlogListAction>) {
    try {
        const {limit, offset, sortBy, ascending} = action.payload;
        setLoading(true);
        let result: Response = yield getBlogsAPI({limit, offset, sortBy, ascending});
        yield put(fetchBlogListSuccess(result));
        setLoading(false);
    } catch (e) {
        setLoading(false);
        yield put(fetchBlogListFailed());
        yield put(showErrorNotification(e));
    }
}

export function* getNextBlogList(action: PayloadAction<BlogListAction>) {
    try {
        const {limit, offset, sortBy, ascending} = action.payload;
        // setLoading(true);
        let result: Response = yield getBlogsAPI({limit, offset, sortBy, ascending});
        yield put(fetchNextBlogListSuccess(result));
        // setLoading(false);
    } catch (e) {
        // setLoading(false);
        yield put(fetchNextBlogListFailed());
        yield put(showErrorNotification(e));
    }
}

export function* changeBlogListLimit(action: PayloadAction<BlogListAction>) {
    try {
        const {limit, offset, sortBy, ascending} = action.payload;
        // setLoading(true);
        let result: Response = yield getBlogsAPI({limit, offset, sortBy, ascending});
        yield put(changeBlogListLimitSuccess(result));
        // setLoading(false);
    } catch (e) {
        // setLoading(false);
        yield put(changeBlogListLimitFailed());
        yield put(showErrorNotification(e));
    }
}

function* blogSata() {
    yield all([
        takeLatest("blog/create/createBlogAction", createBlog),
        takeLatest("blog/list/fetchBlogList", getBlogList),
        takeLatest("blog/list/fetchNextBlogList", getNextBlogList),
        takeLatest("blog/list/changeBlogListLimit", changeBlogListLimit),
    ]);
}

export default blogSata;