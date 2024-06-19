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
const ProHeader = ({className, logo}: {className?: string, logo?: React.ReactNode}) => {
  const { userInfo, avatar } = useSessionAuth();

  const items: MenuProps['items'] = [
    {
      key: '1',
      label: (
        <a rel="noopener noreferrer" href="/profile">
          Profile
        </a>
      ),
    },
    {
      key: '2',
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

  return <div className={clx(className,styles.ProHeader)}>
    {logo ? logo : <ProLogo />}
    <OutSessionComponent />
    <nav className={clx(styles.nav_pc, styles.navigation, styles.navigationInline)}>
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
            <Avatar src={avatar} />
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
    <div className={styles.nav_mobile}>
      <label htmlFor="menu-control" className={styles.hamburger}>
        <i className={styles.hamburger__icon}></i>
        <i className={styles.hamburger__icon}></i>
        <i className={styles.hamburger__icon}></i>
      </label>

      <input type="checkbox" id="menu-control" className={styles.menu_control}></input>
      <aside className={styles.sidebar}>
        <nav className={styles.sidebar__menu}>
          <a href="/images">
            <HomeOutlined className={styles.icon} />
          </a>
          {userInfo && <React.Fragment>
            <a href="/folder/upload">
              <UploadOutlined className={styles.icon} />
            </a>
            <a href="/folder">
              <FolderOpenOutlined className={styles.icon} />
            </a>
            {[Roles.ADMIN, Roles.SUPER_ADMIN].includes(userInfo.role) && <a href="/admin">
              <BankOutlined className={styles.icon} />
            </a>}
          </React.Fragment>}
          <a href="/contact">
            <ContactsOutlined className={styles.icon} />
          </a>
          {userInfo && <a><Dropdown menu={{ items }} arrow={{ pointAtCenter: true }}><div className={styles.a}>
            <Avatar src={avatar} />
          </div></Dropdown></a>}
          {!userInfo && <a><Dropdown menu={{ items: unAuthItems }}
            arrow={{ pointAtCenter: true }}>
            <div className={styles.a}>
              <UserOutlined style={{ cursor: 'pointer' }} />
            </div></Dropdown></a>}
        </nav>

        <label htmlFor="menu-control" className={styles.sidebar__close}></label>
      </aside>
    </div>
  </div>
}

export default ProHeader;