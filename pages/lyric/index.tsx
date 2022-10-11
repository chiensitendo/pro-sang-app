import {NextPage} from "next";
import {NotificationProps} from "../../types/page";
import withNotification from "../../components/with-notification";
import LyricLayout from "../../layouts/LyricLayout";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../redux/store";
import styles from "./styles/index.module.scss";
import ListActions from "../../components/lyric/components/ListActions";
import LyricListComponent from "../../components/lyric/components/LyricListComponent";
import {fetchList, loadMoreLyricList, searchLyricList} from "../../redux/reducers/lyric/lyricListSlice";
import {useEffect, useState} from "react";
import {useRouter} from "next/router";
import {getUserInfo, isAccountLogging} from "../../services/auth_services";

const LyricListPage: NextPage = (props: LyricListPageProps) => {
    const dispatch = useDispatch();
    const {locale, push, defaultLocale} = useRouter();
    const {list, initLoading, itemLoading, hasNext} = useSelector((state: RootState) => state.lyric.list);
    const [offset, setOffset] = useState(0);
    const [searchText, setSearchText] = useState('');
    const [isLogging, setIsLogging] = useState(false);
    const [accountId, setAccountId] = useState<number | undefined>(undefined);
    const handleEdit = (id: number) => {
        isLogging && push("/lyric/edit/" + id).then();
    }

    useEffect(() => {
        dispatch(fetchList({
            offset,
            locale,
            searchText
        }));
        setIsLogging(isAccountLogging());
        setAccountId(getUserInfo()?.id);
    },[]);
    return <LyricLayout>
        <div className={styles.wrapper}>
            <ListActions loading={initLoading} locale={locale} onSearch={(value) => {
                dispatch(searchLyricList({
                    offset: 0,
                    searchText: value,
                    locale
                }));
                setOffset(0);
                setSearchText(value);
            }
            }/>
            <LyricListComponent
                list={list}
                hasNext={hasNext}
                locale={locale}
                defaultLocale={defaultLocale}
                initLoading={initLoading}
                isLogging={isLogging}
                loading={itemLoading}
                accountId={accountId}
                onEdit={handleEdit}
                onLoadMore={() => {
                    dispatch(loadMoreLyricList({
                        offset: offset + 1,
                        locale,
                        searchText
                    }));
                    setOffset(offset + 1);
                }
                }
            />
        </div>
    </LyricLayout>
}

interface LyricListPageProps extends NotificationProps {
    children?: any;
}

export default withNotification(LyricListPage);