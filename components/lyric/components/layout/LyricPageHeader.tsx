import React, {useCallback, useEffect, useMemo, useRef, useState} from "react";
import {useRouter} from "next/router";
import getTranslation from "../../../translations";
import styles from "../../../../pages/lyric/styles/layout/LyricPageHeader.module.scss";
import {Avatar, Dropdown, Menu, Space} from "antd";
import type { MenuProps } from 'antd';

import Icon, {
    CaretDownOutlined, HomeFilled, HomeOutlined, LogoutOutlined, PlusCircleFilled,
    PlusCircleOutlined, ProfileOutlined, SearchOutlined,
    UserOutlined
} from "@ant-design/icons";
import MusicIcon from "../../../../public/icons/music_note_1.svg";
import Search from "antd/lib/input/Search";
import classNames from "classnames";
import {clearAuthLocalStorage, isAccountLogging} from "../../../../services/auth_services";
import {logoutAccount} from "../../../../apis/auth-apis";
import {useDispatch} from "react-redux";
import {showErrorNotification} from "../../../../redux/reducers/lyric/notificationSlice";
import {useLoading} from "../../../core/useLoading";


const handleLogout = (locale: string | undefined, push: any, dispatch: any, setLoading: any) => {
    setLoading(true);
    logoutAccount(locale).then(res => {
        clearAuthLocalStorage();
        push("/login").then();
    }).catch(err => {
        dispatch(showErrorNotification(err));
    }).finally(() => {
        setLoading(false);
    });
}

const generateMenu = (locale: string | undefined, push: any, dispatch: any, setLoading: any) => {
    const handleMenuClick: MenuProps['onClick'] = e => {
        const {key} = e;
        if (key === "/logout") {
            handleLogout(locale,push,dispatch, setLoading);
        } else {
            push(key, key, {locale: locale ? locale: 'en-US'});
        }

    };
    return <Menu
        onClick={handleMenuClick}
        items={[
            // {
            //     label: getTranslation( "lyric.layout.header.profile", "Profile", locale),
            //     key: '/lyric/profile',
            //     icon: <ProfileOutlined />,
            // },
            {
                label: getTranslation( "lyric.layout.header.logout", "Logout", locale),
                key: '/logout',
                icon: <LogoutOutlined/>,
            }
        ]}
    />
}

const MenuList = (props: MenuListProps) => <React.Fragment>
    {props.isLogging && <div className={styles.menuItem} onClick={() => props.onMenuClick("/lyric/add")}><PlusCircleOutlined />
        <span>{getTranslation( "lyric.layout.header.newBtn", "Create New Lyric", props.locale)}</span></div>}
    {props.isLogging && <div className={styles.menuItem} onClick={() => props.onMenuClick("/lyric/list")}><Icon component={MusicIcon} />
        <span>{getTranslation( "lyric.layout.header.listBtn", "Your Lyrics", props.locale)}</span></div>}
    {props.isLogging ?
        <div className={styles.menuItemWithAvatar}>
            {props.menu && <Dropdown overlay={props.menu} placement="bottomLeft" arrow trigger={["click"]}>
                <Space>
                    <Avatar size={32} style={{ backgroundColor: '#87d068' }} icon={<UserOutlined />} />
                    <CaretDownOutlined />
                </Space>
            </Dropdown>}
        </div> :
        <div className={styles.menuItem} onClick={() => props.onMenuClick("/login")}><UserOutlined /><span>Login</span></div>}
</React.Fragment>

const IconMenuList = (props: IconMenuListProps) => <React.Fragment>
    <div className={styles.menuIconItem} onClick={() => props.onMenuClick("/lyric")}><HomeOutlined /></div>
    <div className={styles.menuIconItem} ref={props.iconSearchRef} onClick={() => props.onClickSearchBox()}><SearchOutlined /></div>
    <div className={styles.menuIconItem} onClick={() => props.onMenuClick("/lyric/add")}><PlusCircleFilled /></div>
    <div className={styles.menuIconItem} onClick={() => props.onMenuClick("/lyric/list")}><Icon component={MusicIcon} /></div>
    {!props.isLogging ? <div className={styles.menuIconItem} onClick={() => props.onMenuClick("/login")}><UserOutlined /></div> :
        <div className={styles.menuIconItem} onClick={() => {
            props.onLogout();
        }}><LogoutOutlined /></div>}
</React.Fragment>

const LyricPageHeader = (props: LyricHeaderPageProps) => {
    const {locale, push, pathname} = useRouter();
    const dispatch = useDispatch();
    const {setLoading} = useLoading();
    const [showSearchBox, setShowSearchBox] = useState(false);
    const [isLogging, setIsLogging] = useState(false);
    useEffect(() => {
        setIsLogging(isAccountLogging());
    },[]);
    const searchRef = useRef(null);
    const iconSearchRef = useRef(null);
    const handleWhenClickOutsite = useCallback(() => {
       setShowSearchBox(false);
    },[setShowSearchBox]);
    useOutsideAlerter(searchRef, iconSearchRef, handleWhenClickOutsite);
    const handleMenuClick = useCallback((path: string) => {
        push(path, path, {locale: locale}).then();
    },[locale]);
    const menu = generateMenu(locale, push, dispatch, setLoading);
    const onSearch = (value: string) => console.log(value);
    const headerText = useMemo(() => {
        if (!pathname) {
            return "";
        }
        if (pathname === "/lyric") {
            return getTranslation( "lyric.list.header", "Lyric List", locale);
        }
        if (pathname === "/lyric/list") {
            return getTranslation( "lyric.layout.header.listBtn", "Your Lyrics", locale);
        }
        if (pathname === "/lyric/add") {
            return getTranslation( "lyric.layout.header.newBtn", "Create New Lyric", locale);
        }
        return "";
    },[pathname, locale]);

    return <div className={styles.wrapper}>
            <div className={styles.container}>
                <div className={styles.title}>
                    <HomeFilled onClick={() => push("/lyric").then()} />
                    <h1>
                        {headerText}
                    </h1>
                </div>
                <div className={classNames(styles.searchContainer, {[styles.showSearchBox]: showSearchBox})} ref={searchRef}>
                    <Search
                    placeholder={getTranslation( "lyric.layout.header.searchPlaceholder", "Find lyrics", locale)}
                    allowClear
                    enterButton
                    size="large"
                    className={styles.searchBox}
                    onSearch={onSearch}
                />
                </div>
                <div className={styles.menuList}>
                    <MenuList
                        onMenuClick={handleMenuClick}
                        isLogging={isLogging}
                        menu={menu}
                        locale={locale}
                        />
                </div>
                <div className={styles.iconMenuList}>
                    <IconMenuList
                        onLogout={() =>  handleLogout(locale,push,dispatch, setLoading)}
                        onMenuClick={handleMenuClick}
                        isLogging={isLogging}
                        onClickSearchBox={() => setShowSearchBox(!showSearchBox)}
                        iconSearchRef={iconSearchRef}
                    />
                </div>
            </div>
    </div>
}

interface MenuListProps {
    onMenuClick: (path: string) => void;
    isLogging: boolean;
    menu: any;
    locale: string | undefined;
}
interface IconMenuListProps {
    onClickSearchBox: () => void;
    onMenuClick: (path: string) => void;
    isLogging: boolean;
    iconSearchRef?: any;
    onLogout: () => void;
};

interface LyricHeaderPageProps {
    children?: any;
}

/**
 * Hook that alerts clicks outside of the passed ref
 */
function useOutsideAlerter(ref: any, iconSearchRef: any, callback: any) {
    useEffect(() => {
        /**
         * Alert if clicked on outside of element
         */
        function handleClickOutside(event: any) {
            if (ref.current && !ref.current.contains(event.target)) {
                if (iconSearchRef.current && !iconSearchRef.current.contains(event.target)) {
                    callback();
                }
            }
        }
        // Bind the event listener
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            // Unbind the event listener on clean up
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [ref]);
}

export default LyricPageHeader;