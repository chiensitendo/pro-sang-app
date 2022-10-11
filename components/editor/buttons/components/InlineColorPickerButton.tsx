import React from 'react';
import {FontColorsOutlined} from "@ant-design/icons";
import createInlineBlockColorPickerButton from "../utils/createInlineBlockColorPickerButton";

// @ts-ignore
export default createInlineBlockColorPickerButton({
    prefix: '',
    children: (
        <FontColorsOutlined style={{fontSize: '24px'}} />
    ),
});