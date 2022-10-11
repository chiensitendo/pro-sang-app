import React from 'react';
import {EditOutlined} from "@ant-design/icons";
import createBlockEditImageButton from "../utils/createBlockEditImageButton";

export default createBlockEditImageButton({
    editPopup: true,
    children: (
        <EditOutlined style={{fontSize: "22px"}} />
    ),
});