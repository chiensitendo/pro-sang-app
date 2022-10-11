import { UploadOutlined } from '@ant-design/icons';
import { Button, Upload } from 'antd';
import type { UploadFile } from 'antd/es/upload/interface';
import React from 'react';
import styles from "./ImageUploadFile.module.scss";
import {RcFile} from "antd/lib/upload";

const fileList: UploadFile[] = [
    {
        uid: '-1',
        name: 'xxx.png',
        status: 'done',
        url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
        thumbUrl: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
    },
    {
        uid: '-2',
        name: 'yyy.png',
        status: 'error',
    },
];

const ImageUploadFile: React.FC<ImageUploadFileProps> = (props) => {
    const {fileList, onFileListChange} = props;

    const onPreview = async (file: UploadFile) => {
        let src = file.url as string;
        if (!src) {
            src = await new Promise(resolve => {
                const reader = new FileReader();
                reader.readAsDataURL(file.originFileObj as RcFile);
                reader.onload = () => resolve(reader.result as string);
            });
        }
        const image = new Image();
        image.src = src;
        const imgWindow = window.open(src);
        imgWindow?.document.write(image.outerHTML);
    };

    return <>
        {fileList.length > 0 && <label>Uploaded File:</label>}
        <Upload
            // action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
            listType="picture"
            fileList={[...fileList]}
            onChange={file => {
                onFileListChange(file.fileList);
            }}
            onPreview={onPreview}
            className={styles.uploadListInline}
        >
            {fileList.length === 0 && <Button icon={<UploadOutlined/>}>Upload</Button>}
        </Upload>
    </>
}

interface ImageUploadFileProps {
    fileList: UploadFile[],
    onFileListChange: (fileList: UploadFile[]) => void;
}

export default ImageUploadFile;