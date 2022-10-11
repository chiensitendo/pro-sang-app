import {ComponentType, LegacyRef, MouseEvent, useEffect, useState} from "react";
import {DraftJsStyleButtonProps} from "@draft-js-plugins/buttons";
import {Select} from "antd";
import {
    createFontSizeOptions, FONT_SIZE_STYLE_PREFIX,
} from "../../../core/TextEditorUtils";
import styles from "../components/FontSizeSelect.module.scss";
import {RichUtils} from "draft-js";
const { Option } = Select;

type FontSizeSelectProps = {
    onAfterSubmit: () => void;
}

declare type Props = ComponentType<DraftJsStyleButtonProps & FontSizeSelectProps>;

const defaultOptions = createFontSizeOptions();

export default function createInlineBlockFontSizeSelect(): Props {
    return function InlineBlockFontSizeSelect(props) {
        const [value, setValue] = useState('14');
        const [isFocus, setIsFocus] = useState(false);
        const handleOnChange = (value: string) => {
            props.onAfterSubmit();
            const key = FONT_SIZE_STYLE_PREFIX + value;
            props.setEditorState(
                RichUtils.toggleInlineStyle(props.getEditorState(), key)
            );
            setValue(value);
            setIsFocus(false);
        }


        useEffect(() => {
            if (!isFocus && props.getEditorState && props.getEditorState()) {
                const styles = props.getEditorState().getCurrentInlineStyle();
                let isHas = false;
                styles.forEach(style => {
                    if (style?.startsWith(FONT_SIZE_STYLE_PREFIX)) {
                        setValue(style?.replace(FONT_SIZE_STYLE_PREFIX, ""));
                        isHas = true;
                    }
                });
                if (!isHas) {
                    const key = FONT_SIZE_STYLE_PREFIX + value;
                    props.setEditorState(
                        RichUtils.toggleInlineStyle(props.getEditorState(), key)
                    );
                }
            }
        },[props, isFocus]);

        return <div className={styles.buttonWrapper} style={{verticalAlign: "top"}} onClick={e => e.stopPropagation()}>
            <Select
                showSearch
                value={value}
                onChange={handleOnChange}
                onFocus={e => setIsFocus(true)}
                style={{ width: 70, height: 34 }}
                placeholder="Search to Select"
                optionFilterProp="children"
                filterOption={(input, option) => (option!.children as unknown as string).includes(input)}
                filterSort={(optionA, optionB) =>
                    (optionA!.children as unknown as number) - (optionB!.children as unknown as number)
                }
            >
                {defaultOptions.map((opt, index) => {
                    return <Option key ={index} value = {opt.value}>{opt.value}</Option>
                })}
            </Select>

        </div>
    }
};