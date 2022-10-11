import { combineReducers } from 'redux'
import lyricListSlice from "./lyric/lyricListSlice";
import lyricCommentSlice from "./lyric/lyricCommentSlice";
import shellUserSlice from "./shellUserSlice";
import lyricContentSlice from "./lyric/lyricContentSlice";
import lyricInfoSlice from "./lyric/lyricInfoSlice";
import notificationSlice from "./lyric/notificationSlice";
import lyricActionSlice from "./lyric/lyricActionSlice";

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
});

export default rootReducer;