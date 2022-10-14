import { combineReducers } from 'redux'
import lyricListSlice from "./lyric/lyricListSlice";
import lyricCommentSlice from "./lyric/lyricCommentSlice";
import shellUserSlice from "./shellUserSlice";
import lyricContentSlice from "./lyric/lyricContentSlice";
import lyricInfoSlice from "./lyric/lyricInfoSlice";
import notificationSlice from "./lyric/notificationSlice";
import lyricActionSlice from "./lyric/lyricActionSlice";
import accountLoginSlice from "./account/accountLoginSlice";
import accountRegisterSlice from "./account/accountRegisterSlice";

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
        register: accountRegisterSlice
    })
});

export default rootReducer;