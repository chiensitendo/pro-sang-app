import {Col, Form, Input, InputNumber, message, Modal, Row, Select} from "antd";
import React, {ReactNode, useEffect, useMemo, useRef, useState} from "react";
import {RuleObject, RuleRender} from "rc-field-form/lib/interface";
import {UploadFile} from "antd/lib/upload/interface";
import ImageUploadFile from "./ImageUploadFile";
const { Option } = Select;

interface ImageModalResult {
    width: number | string,
    src: string
}

interface ImageModalProps {
    title: string,
    formName: string,
    isModalVisible: boolean,
    onClose?: () => void;
    onOk?: (res: ImageModalResult) => void;
    getImageData?: () => any;
    uploadImageFile?: (e: UploadFile) => Promise<string>;
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

const ImageModal = (props: ImageModalProps) => {

    const {isModalVisible, onClose, onOk, getImageData, uploadImageFile, title, formName} = props;

    const [form] = Form.useForm();

    const submitBtnRef: React.LegacyRef<HTMLButtonElement> = useRef(null);

    const [loading, setLoading] = useState(false);

    const [fileList, setFileList] = useState<UploadFile[]>([]);

    const [srcRules, setSrcRules] = useState<Array<RuleObject | RuleRender>>([{
        required: true,
        message: 'Please input image link'
    }]);

    const widthRules: Array<RuleObject | RuleRender> = [{
        required: true,
        message: 'Please input width of image'
    }];

    const handleOk = () => {
        if (submitBtnRef.current) {
            submitBtnRef.current.click();
        }
    };

    const handleCancel = () => {
        form && form.isFieldsTouched(['width', 'src', 'suffix'], false);
        setFileList([]);
        onClose && onClose();
    };

    const data = useMemo(() => {
        if (!getImageData) {
            return null;
        }
        const _data = getImageData();
        if (_data) {
            return _data;
        } else {
            return {};
        }
    },[getImageData]);

    const suffixSelector = (
        <Form.Item name="suffix" initialValue={"%"} noStyle>
            <Select style={{ width: 70 }}>
                <Option value="px">PX</Option>
                <Option value="%">%</Option>
            </Select>
        </Form.Item>
    );

    const handleFileChange =  (list: UploadFile[]) => {
        if (list.length === 0) {
            srcRules.length === 0 && setSrcRules([...[{
                    required: true,
                    message: 'Please input image link'
            }]]);
        } else {
            setSrcRules([]);
            form.setFieldsValue({
                src: ''
            });
        }
        form.validateFields(['src']).then();
        setFileList([...list]);
    }

    const resetFields = () => {
        setFileList([]);
        form.setFieldsValue({
            suffix: '%',
            width:  '',
            src: ''
        });
        form.isFieldsTouched(['suffix', 'width', 'src'], false);
    }

    const handleFinish = (values: any) => {
        const {suffix, width, src} = values;
        if (width && suffix && (src || fileList.length > 0)) {
            setLoading(true);
            if (fileList.length === 0) {
                imageExists(src).then((_) => {
                    onOk && onOk({
                        width: width + suffix,
                        src: src
                    });
                    resetFields();
                    setLoading(false);
                }).catch(err => {
                    error("Cannot load the image link").then();
                    setLoading(false);
                });
            } else {
                if (uploadImageFile ) {
                    uploadImageFile(fileList[0]).then(url => {
                        onOk && onOk({
                            width: width + suffix,
                            src: url
                        });
                        resetFields();
                        setLoading(false);
                    }).catch(err => {
                        message.error('Cannot upload the file').then();
                        setLoading(false);
                    });
                }
            }

        }
    }

    useEffect(() => {
        if (form && data) {
            const {src, width} = data;
            const suffix = !width ? '%': width.endsWith('%') ? '%': 'px';
            form.setFieldsValue({
                suffix: suffix,
                width: width ? width.replace('%', '').replace('px', ''): '',
                src: src ? src: ''
            });

        }
    },[data, form]);

    return (
        <>
            <Modal title={title} visible={isModalVisible} onOk={handleOk} onCancel={handleCancel} closable={!loading} confirmLoading={loading}>
                {data && <Form layout={"vertical"} form={form} name={formName} onFinish={handleFinish} onClick={event => event. stopPropagation()}>
                    <Row>
                        <Col span={24}>
                            <ImageEditInput type={'text'} label={"Image Url"} name={"src"} rules={srcRules}/>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={24}>
                            <ImageUploadFile fileList={fileList} onFileListChange={handleFileChange}/>
                        </Col>

                    </Row>
                    <Row>
                        <Col span={10}>
                            <ImageEditInput type={'number'} min={10} label={"Width"}  name={"width"} addonAfter={suffixSelector} rules={widthRules}/>
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

const imageExists = async (src: string) => {

    return new Promise((res, rej) => {
        let image = new Image();

        image.onload = (e) => {
           res(true);
        }
        image.onerror = (er) => {
            rej(false);
        }
        image.src = src;
    });

}

export default ImageModal;