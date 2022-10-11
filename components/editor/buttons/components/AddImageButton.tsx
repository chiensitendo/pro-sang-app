import React from 'react';
import {PictureFilled} from "@ant-design/icons";
import createBlockAddImageButton from "../utils/createBlockAddImageButton";

// @ts-ignore
export default createBlockAddImageButton({
    children: (
        <PictureFilled style={{fontSize: '24px'}} />
    ),
});