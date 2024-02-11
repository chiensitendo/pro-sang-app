import { BankOutlined, FolderOpenOutlined, HomeOutlined, UploadOutlined, UserOutlined } from "@ant-design/icons";
import styles from "./ProHeader.module.scss";
import clx from 'classnames';
import { Avatar } from "antd";
import { useSessionAuth } from "@/components/use-session-auth";
import React from "react";
import ProLogo from "../logo/ProLogo";
import { Roles } from "@/types/account";
const ProHeader = () => {
    const {userInfo} = useSessionAuth();
    return <div className={styles.ProHeader}>
        <ProLogo />
        <nav className={clx(styles.navigation, styles.navigationInline)}>
            <ul>
                {userInfo && <React.Fragment>
                    <li>
                    <a href="/images">
                        <span className={styles.text}>Home</span>
                        <HomeOutlined className={styles.icon} />
                    </a>
                </li>
                <li>
                    <a href="/folder/upload">
                        <span className={styles.text}>Upload</span>
                        <UploadOutlined className={styles.icon} />
                    </a>
                </li>
                <li>
                    <a href="/folder">
                        <span className={styles.text}>Folders</span>
                        <FolderOpenOutlined className={styles.icon} />
                    </a>
                </li>
                {userInfo.role === Roles.ADMIN && <li>
                    <a href="/admin">
                        <span className={styles.text}>Admin</span>
                        <BankOutlined className={styles.icon} />
                    </a>
                </li>}
                </React.Fragment>}
                <li>
                    <a href={!userInfo ? "/login" : "/images"}>
                        {!userInfo && <UserOutlined />}
                        {userInfo && <Avatar src={`https://api.dicebear.com/7.x/miniavs/svg?seed=${1}`} />}
                    </a>
                </li>
            </ul>
        </nav>
    </div>
}

export default ProHeader;