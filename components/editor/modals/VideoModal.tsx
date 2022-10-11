import {Col, Form, Input, InputNumber, message, Modal, Row, Select} from "antd";
import React, {ReactNode, useEffect, useRef} from "react";
import {RuleObject, RuleRender} from "rc-field-form/lib/interface";
import {getVideoSrc} from "../video/components/DefaultVideoComponent";
const { Option } = Select;

interface VideoModalResult {
    width: number | string,
    height: number | string,
    src: string
}

interface VideoModalProps {
    title: string,
    formName: string,
    isModalVisible: boolean,
    onClose?: () => void;
    onOk?: (res: VideoModalResult) => void;
}


const ImageEditInput = (props:
                            {type: "number" | 'text',
                                label?: string,
                                addonAfter?: ReactNode,
                                value?: any,
                                name?: any,
                                min?: number,
                                max?: number,
                                rules?: Array<RuleObject | RuleRender>}) => {
    const {type, label, addonAfter,  value, name, min, max, rules} = props;
    if (type === "number") {
        return  <Form.Item label={label} name={name} rules={rules}>
            <InputNumber min={min} max={max} addonAfter ={addonAfter} value={value}/>
        </Form.Item>;
    } else {
        return  <Form.Item label={label} name={name} rules={rules}>
            <Input addonAfter ={addonAfter} value={value}/>
        </Form.Item>;
    }
}

const VideoModal = (props: VideoModalProps) => {

    const {isModalVisible, onClose, onOk, title, formName} = props;

    const [form] = Form.useForm();

    const submitBtnRef: React.LegacyRef<HTMLButtonElement> = useRef(null);

    const srcRules: Array<RuleObject | RuleRender> = ([{
        required: true,
        message: 'Please input video link'
    }]);

    const handleOk = () => {
        if (submitBtnRef.current) {
            submitBtnRef.current.click();
        }
    };

    const handleCancel = () => {
        form && form.isFieldsTouched(['width', 'height', 'src', 'widthSuffix', 'heightSuffix'], false);
        onClose && onClose();
    };


    const suffixSelector = (name: string) => <Form.Item name={name} noStyle initialValue={name === "widthSuffix" ?'%': 'px'}>
        <Select style={{ width: 70 }}>
            <Option value="px">PX</Option>
            {name === "widthSuffix" && <Option value="%">%</Option>}
        </Select>
    </Form.Item>;


    const handleFinish = (values: any) => {
        const {widthSuffix, height, heightSuffix, width, src} = values;
        if (src && widthSuffix && heightSuffix) {
            if (!getVideoSrc({src})) {
                error("This video link isn't correct or being supported").then();
                return;
            }
            onOk && onOk({
                width: !width ? "100%": width + widthSuffix,
                height: !height ? null: height + heightSuffix,
                src: src
            });
            form.setFieldsValue({
                widthSuffix: "%",
                heightSuffix: "px",
                src: '',
                width: '',
                height: ''
            });
            form.isFieldsTouched(['width', 'height', 'src', 'widthSuffix', 'heightSuffix'], false);
        }
    }

    useEffect(() => {
        form && form.setFieldsValue({
            widthSuffix: "%",
            heightSuffix: "px"
        })
    },[]);

    return (
        <>
            <Modal title={title} visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
                {<Form layout={"vertical"} form={form} name={formName} onFinish={handleFinish} onClick={event => event. stopPropagation()}>
                    <Row>
                        <Col span={24}>
                            <ImageEditInput type={'text'} label={"Video Url"} name={"src"} rules={srcRules}/>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={10}>
                            <ImageEditInput type={'number'} label={"Width"}  name={"width"} min = {10} max={100} addonAfter={suffixSelector("widthSuffix")}/>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={10}>
                            <ImageEditInput type={'number'} label={"Height"}  name={"height"} min ={100} addonAfter={suffixSelector("heightSuffix")}/>
                        </Col>
                    </Row>
                    <button ref={submitBtnRef} hidden type={"submit"}></button>
                </Form>}
            </Modal>
        </>
    );

}

const error = async (error: string) => {
    message.error(error);
};


export default VideoModal;