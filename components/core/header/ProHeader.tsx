import { BankOutlined, ContactsOutlined, FolderOpenOutlined, HomeOutlined, UploadOutlined, UserOutlined } from "@ant-design/icons";
import styles from "./ProHeader.module.scss";
import clx from 'classnames';
import { Avatar, Dropdown } from "antd";
import { useSessionAuth } from "@/components/use-session-auth";
import React, { useEffect } from "react";
import ProLogo from "../logo/ProLogo";
import { Roles } from "@/types/account";
import { MenuProps } from "antd/lib";
import OutSessionComponent from "@/components/out-session";
const ProHeader = () => {
  const { userInfo } = useSessionAuth();

  const items: MenuProps['items'] = [
    {
      key: '1',
      label: (
        <a rel="noopener noreferrer" href="/logout">
          Logout
        </a>
      ),
    },
  ];

  const unAuthItems: MenuProps['items'] = [
    {
      key: '1',
      label: (
        <a rel="noopener noreferrer" href="/login">
          Login
        </a>
      ),
    },
    {
      key: '2',
      label: (
        <a rel="noopener noreferrer" href="/register">
          Register
        </a>
      ),
    },
  ];

  return <div className={styles.ProHeader}>
    <ProLogo />
    <OutSessionComponent />
    <nav className={clx(styles.navigation, styles.navigationInline)}>
      <ul>
        <li>
          <a href="/images">
            <span className={styles.text}>Home</span>
            <HomeOutlined className={styles.icon} />
          </a>
        </li>
        {userInfo && <React.Fragment>
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
          {[Roles.ADMIN, Roles.SUPER_ADMIN].includes(userInfo.role) && <li>
            <a href="/admin">
              <span className={styles.text}>Admin</span>
              <BankOutlined className={styles.icon} />
            </a>
          </li>}
        </React.Fragment>}
        <li>
          <a href="/contact">
            <span className={styles.text}>Contact</span>
            <ContactsOutlined className={styles.icon} />
          </a>
        </li>
        {userInfo && <Dropdown menu={{ items }} arrow={{ pointAtCenter: true }}><li>
          <div className={styles.a}>
            <Avatar src={`https://api.dicebear.com/7.x/miniavs/svg?seed=${1}`} />
          </div>
        </li></Dropdown>}
        {!userInfo && <Dropdown menu={{ items: unAuthItems }} arrow={{ pointAtCenter: true }}><li>
          <div className={styles.a}>
            <UserOutlined />
          </div>
        </li></Dropdown>}
        {/* {!userInfo && <li><a href="/login"><UserOutlined /></a></li>} */}
      </ul>
    </nav>
  </div>
}

export default ProHeader;