import {Select} from "antd";
import {ProSelectItem} from "../../types/general";
import classNames from "classnames";

const ProSelect = (props: ProSelectProps) => {
    const {className, items, defaultValue, onChange} = props;

    return <div className={classNames(className)}>
        <Select defaultValue={defaultValue ? defaultValue: items[0]} onChange={onChange}>
            {items.map(item => (
                <Select.Option key={item.value}>{item.label}</Select.Option>
            ))}
        </Select>
    </div>

}

interface ProSelectProps {
    titleText?: string;
    className?: string;
    items: Array<ProSelectItem>;
    defaultValue?: any;
    onChange?: (value: any) => void;
}

export default ProSelect;