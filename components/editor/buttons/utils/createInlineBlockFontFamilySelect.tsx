import {ComponentType, LegacyRef, MouseEvent, useEffect, useState} from "react";
import {DraftJsStyleButtonProps} from "@draft-js-plugins/buttons";
import {Button, Dropdown, Menu, MenuProps, Space} from "antd";
import {fontFamilyStyles, getFontFamilyCodeByName, getFontFamilyNameByCode} from "../../../core/TextEditorUtils";
import { RichUtils} from "draft-js";
import {DownOutlined} from "@ant-design/icons";
import styles from "../components/FontFamilySelect.module.scss";

type FontFamilySelectProps = {
}

declare type Props = ComponentType<DraftJsStyleButtonProps & FontFamilySelectProps>;

export default function createInlineBlockFontFamilySelect(): Props {
    return function InlineBlockFontFamilySelect(props) {

        const [fontName, setFontName] = useState('Default');

        const preventBubblingUp = (event: MouseEvent): void => {
            event.preventDefault();
        };

        const handleMenuClick: MenuProps['onClick'] = e => {
            e.domEvent.preventDefault();
            props.setEditorState(
                RichUtils.toggleInlineStyle(props.getEditorState(), e.key)
            );
            setFontName(getFontFamilyNameByCode(e.key));
        };

        const menu = (
            <Menu
                onClick={handleMenuClick}
                items={fontFamilyStyles.map(style => ({
                    key: style.value,
                    label: style.label
                }))}
            />
        );

        useEffect(() => {
            if (props.getEditorState && props.getEditorState()) {
                const styles = props.getEditorState().getCurrentInlineStyle();
                styles.forEach(style => {
                    if (style?.startsWith("FONT_FAMILY_")) {
                        setFontName(getFontFamilyNameByCode(style));
                    }
                })
            }
        },[props, fontName]);

        return <div className={styles.buttonWrapper} onMouseDown={preventBubblingUp}>
            <Dropdown overlay={menu} trigger = {['click']}>
                <Button className={styles.button}>
                    <Space>
                        {fontName}
                        <DownOutlined />
                    </Space>
                </Button>
            </Dropdown>
        </div>
    }
};