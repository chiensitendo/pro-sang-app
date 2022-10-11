import {Button, Dropdown, Menu, Space} from "antd";
import {DownOutlined, UserOutlined} from "@ant-design/icons";
import {useState} from "react";
import * as React from "react";

interface MenuInfo {
    key: string;
    keyPath: string[];
    /** @deprecated This will not support in future. You should avoid to use this */
    item: React.ReactInstance;
    domEvent: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>;
}

const FontDropdown = () => {

    const [value, setValue] = useState('Select your font');

    const handleMenuClick = (info: MenuInfo) => {
        console.log(info.key);
        info.domEvent.preventDefault();
        setValue(info.key);
    }
    const handleMouseDown = (info: any) => {
        info.preventDefault();
    }

    const menu = (
        <Menu
            onMouseDown={handleMouseDown}
            items={[
                {
                    label: 'SOFIA',
                    key: 'SOFIA',
                },
                {
                    label: 'ROBOTO',
                    key: 'ROBOTO',
                },
            ]}
        />
    );

    return <Dropdown overlay={menu}>
        <Button>
            <Space>
                {value}
                <DownOutlined />
            </Space>
        </Button>
    </Dropdown>
}


export default FontDropdown;