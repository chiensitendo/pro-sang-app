import React from 'react';
import {FontColorsOutlined} from "@ant-design/icons";
import createBlockColorPickerButton from "../utils/createBlockColorPickerButton";

// @ts-ignore
export default createBlockColorPickerButton({
    prefix: "",
    children: (
        <FontColorsOutlined style={{fontSize: '24px'}} />
    ),
});