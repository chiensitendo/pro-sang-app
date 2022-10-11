import styles from "../../../pages/lyric/styles/ListActions.module.scss";
import Search from "antd/lib/input/Search";
import * as React from "react";
import getTranslation from "../../translations";

const ListActions = (props: ListActionsProps) => {
    const {onSearch, loading, locale} = props;
    const placeholder = getTranslation("lyric.list.actions.searchPlaceholder", "Search Lyrics", locale);
    const buttonText = getTranslation("lyric.list.actions.searchBtnText", "Search", locale);
    return <div className={styles.wrapper}>
        <Search placeholder={placeholder} onSearch={onSearch} enterButton={buttonText} size="large" loading={loading} />
    </div>
}

interface ListActionsProps {
    onSearch?: (value: string, event?: React.ChangeEvent<HTMLInputElement> | React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLInputElement>) => void;
    loading?: boolean;
    locale: string | undefined;
}

export default ListActions;