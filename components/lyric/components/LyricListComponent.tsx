import {Avatar, Button, List, Rate, Skeleton, Space} from 'antd';
import React from 'react';
import styles from "../../../pages/lyric/styles/accountLyricList.module.scss";
import {EditFilled, MessageOutlined, StarOutlined} from "@ant-design/icons";
import getTranslation from "../../translations";
import {LyricListItem} from "../../../types/lyric";
import moment from "moment";
import {FULL_DATETIME_FORMAT} from "../../../constants";
moment.updateLocale("vi", {
    calendar: {
        lastDay: "Hôm qua, HH:mm:ss",
        lastWeek: "Tuần trước, HH:mm:ss",
        nextDay: "Ngày mai",
        sameDay: "Hôm nay, HH:mm:ss",
        nextWeek: "Tuần tới",
        sameElse: FULL_DATETIME_FORMAT
    }
});

const IconText = ({ icon, text }: { icon: React.FC; text: string }) => (
    <Space>
        {React.createElement(icon)}
        {text}
    </Space>
);

const LyricListComponent: React.FC<LyricListComponentProps> = (props: LyricListComponentProps) => {
    const {initLoading, onEdit, list, onLoadMore, locale, hasNext, isLogging, accountId, defaultLocale} = props;
    const editBtnText = getTranslation("lyric.list.items.editBtnText", "Edit", locale);
    const deleteBtnText = getTranslation("lyric.list.items.deleteBtnText", "Delete", locale);
    const createdAtText = getTranslation("lyric.list.items.createdAt", "Created At", locale);
    const updatedAtText = getTranslation("lyric.list.items.updatedAt", "Updated At", locale);
    const loadMore =
        hasNext ? (
            <div
                style={{
                    textAlign: 'center',
                    marginTop: 12,
                    height: 32,
                    lineHeight: '32px',
                }}
            >
                <Button onClick={onLoadMore}>loading more</Button>
            </div>
        ) : null;
    return (
        <List
            className="demo-loadmore-list"
            loading={initLoading}
            itemLayout="horizontal"
            loadMore={loadMore}
            dataSource={list}
            renderItem={item => (
                <List.Item
                    className={styles.item}
                    actions={isLogging && item.account_info.id === accountId ? [
                        <Button key={0} icon={<EditFilled />} onClick={() => onEdit && onEdit(item.id)}>{getTranslation("lyric.button.edit", "Edit", locale)}</Button>
                    ]: []}
                >
                    <Skeleton avatar title={false}
                              loading={false}
                              active>
                        <List.Item.Meta
                            className={styles.itemMeta}
                            avatar={<Avatar src={item.account_info.photo_url} />}
                            title={<a href={`${locale && locale !== defaultLocale ? '/' + locale : ''}/lyric/` + item.id}><span className={styles.itemTitle}>{item.title}</span></a>}
                            description= {<div>
                                <p className={styles.itemContent} style={{margin: "0 0 5px 0"}}>{item.account_info.name}</p>
                                <p className={styles.itemDateTime}><span>{moment(item.updated_date, FULL_DATETIME_FORMAT).locale(locale ? locale: 'en').calendar()}</span></p>
                                <div className={styles.itemFooter}>
                                    <Space className={styles.icons}>
                                        {item.rate && <Rate className={styles.rate} disabled allowHalf value={item.rate ? item.rate: undefined}/>}
                                        <IconText icon={MessageOutlined} text={item.comments + ''} key="list-vertical-message" />
                                    </Space>
                                </div>
                            </div>}
                        />
                    </Skeleton>
                </List.Item>
            )}
        />
    );
};

interface LyricListComponentProps {
    list: LyricListItem[],
    hasNext: boolean,
    initLoading: boolean,
    loading: boolean,
    onLoadMore: () => void,
    locale: string | undefined;
    defaultLocale: string | undefined;
    isLogging: boolean;
    accountId: number | undefined;
    onEdit?: (id: number) => void;
}

export default LyricListComponent;