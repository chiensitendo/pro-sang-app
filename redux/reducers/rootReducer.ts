import { combineReducers } from 'redux'
import lyricListSlice from "./lyric/lyricListSlice";
import lyricCommentSlice from "./lyric/lyricCommentSlice";
import shellUserSlice from "./shellUserSlice";
import lyricContentSlice from "./lyric/lyricContentSlice";
import lyricInfoSlice from "./lyric/lyricInfoSlice";
import notificationSlice from "./notificationSlice";
import lyricActionSlice from "./lyric/lyricActionSlice";
import accountLoginSlice from "./account/accountLoginSlice";
import accountRegisterSlice from "./account/accountRegisterSlice";
import folderListSlice from "@/redux/reducers/folder/folderListReducer";
import folderImageListSlice from '@/redux/reducers/image/folderImageListSlice';
import createFolderSlice from '@/redux/reducers/folder/createFolderReducer';
import publicImageListSlice from './image/publicImageListSlice';
import folderDetailSlice from "./folder/folderDetailReducer";
import adminSlice from './admin/adminSlice';
import accountVerifySlice from './account/accountVerifySlice';
import accountLogoutSlice from './account/accountLogoutSlice';
import accountStatusSlice from './account/accountStatusSlice';
const rootReducer = combineReducers({
    lyric: combineReducers({
        list: lyricListSlice,
        actions: lyricActionSlice
    }),
    lyricComments: lyricCommentSlice,
    shellUser: shellUserSlice,
    lyricContent: lyricContentSlice,
    lyricInfo: lyricInfoSlice,
    notification: notificationSlice,
    account: combineReducers({
        login: accountLoginSlice,
        logout: accountLogoutSlice,
        register: accountRegisterSlice,
        verify: accountVerifySlice,
        status: accountStatusSlice
    }),
    folder: combineReducers({
        list: folderListSlice,
        create: createFolderSlice,
        detail: folderDetailSlice
    }),
    image: combineReducers({
        folder: combineReducers({
            list: folderImageListSlice
        }),
        public: combineReducers({
            list: publicImageListSlice
        })
    }),
    admin: adminSlice
});

export default rootReducer;