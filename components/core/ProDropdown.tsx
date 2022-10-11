import {Button, Dropdown, Menu, Space} from "antd";
import {DownOutlined} from "@ant-design/icons";
import {ItemType} from "antd/es/menu/hooks/useItems";
import {FormEventHandler} from "react";
import classNames from "classnames";

const ProDropdown = (props: ProDropdownProps) => {
    const {items, onMenuChange, placeholder, className} = props;
    const menu = (
        <Menu
            onChange={onMenuChange}
            items={items}
        />
    );

    return <Dropdown overlay={menu} className={classNames(className)}>
        <Button>
            <Space>
                {placeholder}
                <DownOutlined />
            </Space>
        </Button>
    </Dropdown>
}

interface ProDropdownProps {
    items: Array<ItemType>;
    onMenuChange?: FormEventHandler<HTMLUListElement>;
    placeholder?: string;
    className?: string;
}
export default ProDropdown;