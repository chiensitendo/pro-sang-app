import React from 'react';
import {BgColorsOutlined} from "@ant-design/icons";
import createInlineBlockColorPickerButton from "../utils/createInlineBlockColorPickerButton";

// @ts-ignore
export default createInlineBlockColorPickerButton({
    prefix: "BACKGROUND_",
    children: (
        <BgColorsOutlined style={{fontSize: '24px'}} />
    ),
});