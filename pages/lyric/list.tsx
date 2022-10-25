import { NextPage } from "next";
import withNotification from "../../components/with-notification";
import { NotificationProps } from "../../types/page";
import {useCallback, useEffect, useState, FC, useMemo} from "react";
import {
    AccountLyricItemResponse,
    getOwnLyricList,
    LyricListAccountResponse,
    LyricStatuses
} from "../../apis/lyric-apis";
import {AxiosResponse} from "axios";
import withAuth from "../../components/with-auth";
import LyricLayout from "../../layouts/LyricLayout";
import styles from "./styles/list.module.scss";
import {List, Tag, Button, Rate} from "antd";
import {getFullDatetimeString} from "../../utils/utils";
import getTranslation from "../../components/translations";
import {useRouter} from "next/router";
import Head from "next/head";
import * as React from "react";

export const PublicTag: FC<{locale: string | undefined}> = (props) => {
    return <Tag style={{margin: 0}} color="#87d068">{getTranslation("lyric.public", "Public", props.locale)}</Tag>;
}

export const PrivateTag: FC<{locale: string | undefined}> = (props) => {
    return <Tag style={{margin: 0}} color="#108ee9">{getTranslation("lyric.private", "Private", props.locale)}</Tag>;
}



const LyricListPage: NextPage = (props: LyricListPageProps) => {
    const {onErrors} = props;
    const {locale, defaultLocale, push} = useRouter();
    const [lyricList, setLyricList] = useState<AccountLyricItemResponse[] | null>(null);
    const [total, setTotal] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const handleLyricResponse = useCallback((res: AxiosResponse) => {
        if (res && res.data && res.data.body) {
            const lyricListResponse = (res.data.body as LyricListAccountResponse);
            setLyricList(lyricListResponse.lyrics);
            setTotal(lyricListResponse.total);

        }
    },[lyricList]);

    const handleEdit = (id: number) => {
        push(`/lyric/edit/` + id).then();
    }

    const title = useMemo(() => {
        return [getTranslation( "lyric.layout.header.listBtn", "Your Lyrics", locale),
            getTranslation("lyric.slogan", "Save your lyric for free", locale)]
            .join(" | ")
    },[locale]);

    useEffect(() => {
        getOwnLyricList(locale,0).then(res => {
            handleLyricResponse(res);
        }).catch(err => onErrors && onErrors(err)).finally(() => setIsLoading(false));
    },[]);
    return <LyricLayout>
        <div className={styles.wrapper}>
            <Head>
                <title>{title}</title>
                <meta name="description" content={getTranslation( "lyric.layout.header.listBtn", "Your Lyrics", locale)} />
            </Head>
            <List
                loading={isLoading}
                dataSource={lyricList === null ? []: lyricList}
                pagination={{
                    onChange: page => {
                        setIsLoading(true);
                        getOwnLyricList(locale, page - 1).then(res => {
                            handleLyricResponse(res);
                        }).catch(err => onErrors && onErrors(err))
                            .finally(() => setIsLoading(false));
                    },
                    pageSize: 20,
                    total: total,
                }}
                renderItem={item => (
                    <List.Item
                        key={item.id}
                        actions={[
                            <div key={0}><Button  onClick={() => handleEdit(item.id)}>{getTranslation("lyric.button.edit", "Edit", locale)}</Button></div>
                        ]}
                    >
                        <List.Item.Meta
                            title={
                            <div className={styles.title}>
                                <a href={`${locale && locale !== defaultLocale ? '/' + locale : ''}/lyric/${item.id}`}><b>{item.title}</b></a>
                                {item.status === LyricStatuses.PUBLISH ? <PublicTag locale = {locale}/>: <PrivateTag locale = {locale} />}
                            </div>
                            }
                            description={
                            <>
                                {<div><Rate disabled allowHalf value = {item.rate ? item.rate: undefined}/></div>}
                                <div className={styles.description}>
                                    <p><b>{getTranslation("lyric.created", "Created", locale)}</b>: {getFullDatetimeString(item.createdDate)}</p>
                                    <p><b>{getTranslation("lyric.updated", "Updated", locale)}</b>: {getFullDatetimeString(item.updatedDate)}</p>
                                </div>
                            </>
                            }
                        />
                        <div className={styles.tagPc}>{item.status === LyricStatuses.PUBLISH ? <PublicTag locale = {locale}/>: <PrivateTag locale = {locale} />}</div>
                    </List.Item>
                )}
            />
        </div>
    </LyricLayout>
}

interface LyricListPageProps extends NotificationProps {
    children?: any;
 }

export default withNotification(withAuth(LyricListPage));