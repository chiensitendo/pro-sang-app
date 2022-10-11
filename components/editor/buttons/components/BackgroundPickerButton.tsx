import React from 'react';
import {BgColorsOutlined} from "@ant-design/icons";
import createBlockColorPickerButton from "../utils/createBlockColorPickerButton";

// @ts-ignore
export default createBlockColorPickerButton({
    prefix: "BACKGROUND_",
    children: (
        <BgColorsOutlined style={{fontSize: '24px'}} />
    ),
});