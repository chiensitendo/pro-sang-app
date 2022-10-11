import {Breadcrumb} from "antd";
import Icon, {HomeOutlined, ProfileOutlined, UserOutlined} from "@ant-design/icons";
import styles from "../../../../pages/lyric/styles/layout/LyricBreadcrumb.module.scss";
import MusicIcon from "../../../../public/icons/music_note_1.svg";
import React from "react";
import getTranslation from "../../../translations";
import {ParsedUrlQuery} from "querystring";

const generateBreadcrumb = (path: string, query: ParsedUrlQuery | undefined, locale: string | undefined) => {
    let items = [];
    if (path.startsWith("/lyric")) {
        items.push(<Breadcrumb.Item key={0} href="/lyric">
            <HomeOutlined />
        </Breadcrumb.Item>);
        if (path === "/lyric/list") {
            items.push(<Breadcrumb.Item key={"1"} href="">
                <Icon component={MusicIcon} />
                <span>{getTranslation( "lyric.list.header", "Lyric List", locale)}</span>
            </Breadcrumb.Item>);
        } else if (path === "/lyric/profile") {
            items.push(<Breadcrumb.Item key={"1"} href="">
                <ProfileOutlined />
                <span>{getTranslation( "lyric.layout.header.profile", "Profile", locale)}</span>
            </Breadcrumb.Item>);
        } else if (query && query.ref) {
            items.push(<Breadcrumb.Item key={"1"} href={"/lyric/" + query.ref}>
                <span>{query.ref}</span>
            </Breadcrumb.Item>);
        } else if (query && query.id) {
            items.push(<Breadcrumb.Item key={"1"} href={"/lyric/" + query.id}>
                <span>{query.id}</span>
            </Breadcrumb.Item>);
        }
    }
    return items;
}

const LyricBreadcrumb = (props: LyricBreadcrumbProps) => {
    const {pathname, locale, query} = props;
    const items = generateBreadcrumb(pathname, query, locale);
    return items.length > 0 ? <div className={styles.wrapper}>
        <Breadcrumb>
            {items}
        </Breadcrumb>
    </div>: <React.Fragment></React.Fragment>;
}

interface LyricBreadcrumbProps {
    pathname: string;
    locale: string | undefined;
    query?: ParsedUrlQuery;
}

export default LyricBreadcrumb;