import {Form, Input} from "antd";
import styles from "../../../pages/lyric/styles/LyricTextArea.module.scss";
import classNames from "classnames";
import {ChangeEvent} from "react";
import {RuleObject, RuleRender} from "rc-field-form/es/interface";
import TextArea from "antd/lib/input/TextArea";

const LyricTextArea = (props: LyricTextAreaProps) => {
    const {label, name, className, maxLength, ref, rules, rows} = props;
    const onChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        props.onChange && props.onChange(e);
    };

    return <Form.Item
        label={label}
        name={name}
        rules={rules}
        className={classNames(styles.formWrapper, className)}
    >
        <TextArea
            showCount = {maxLength !== undefined && maxLength !== null && maxLength > 0}
            maxLength={maxLength}
            rows={rows}
            onChange={onChange} ref={ref}/>
    </Form.Item>
}

interface LyricTextAreaProps {
    label?: string;
    name: string;
    className?: string;
    maxLength?: number;
    ref?: any;
    rows?: number;
    rules?: Array<RuleObject | RuleRender>;
    onChange?: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

export default LyricTextArea;