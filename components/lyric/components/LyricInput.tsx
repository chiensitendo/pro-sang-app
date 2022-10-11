import {Form, Input} from "antd";
import styles from "../../../pages/lyric/styles/LyricInput.module.scss";
import classNames from "classnames";
import {ChangeEvent} from "react";
import {RuleObject, RuleRender} from "rc-field-form/es/interface";

const LyricInput = (props: LyricInputProps) => {
    const {label, name, className, maxLength, ref, rules, defaultValue, value} = props;
    const onChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        props.onChange && props.onChange(e);
    };

    return <Form.Item
        label={label}
        name={name}
        rules={rules}
        className={classNames(styles.formWrapper, className)}
    >
        <Input showCount = {maxLength !== undefined && maxLength !== null && maxLength > 0} maxLength={maxLength}
               onChange={onChange}
               ref={ref}
               value={value}
               defaultValue={defaultValue}
        />
    </Form.Item>
}

interface LyricInputProps {
    label?: string;
    name: string;
    className?: string;
    maxLength?: number;
    ref?: any;
    defaultValue?: string;
    rules?: Array<RuleObject | RuleRender>;
    onChange?: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    value?: any;
}

export default LyricInput;