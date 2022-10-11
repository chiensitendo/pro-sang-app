import {NextPage} from "next";
import withNotification from "../../../components/with-notification";
import withAuth from "../../../components/with-auth";
import AddingLyricPage from "../add";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../redux/store";
import {useEffect, useState} from "react";
import {fetchLyricInfo} from "../../../redux/reducers/lyric/lyricInfoSlice";
import {useRouter} from "next/router";
import LyricNotFoundPage from "../not-found";
import {getLyricDetailForEdit} from "../../../redux/reducers/lyric/lyricActionSlice";

const LyricEditPage: NextPage = () => {
    const dispatch = useDispatch();
    const {locale, query} = useRouter();
    const {id} = query;
    const {loading, lyricDetail} = useSelector((state: RootState) => state.lyricInfo);
    const {detail} = useSelector((state: RootState) => state.lyric.actions);
    const [isSuccess, setIsSuccess] = useState(false);

    useEffect(() => {
        id && dispatch(getLyricDetailForEdit({lyricId: +id, locale}));
    },[id, locale]);

    return detail && <AddingLyricPage />;
}


export default withNotification(withAuth(LyricEditPage));