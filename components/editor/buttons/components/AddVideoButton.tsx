import React from 'react';
import { VideoCameraFilled} from "@ant-design/icons";
import createBlockAddVideoButton from "../utils/createBlockAddVideoButton";

// @ts-ignore
export default createBlockAddVideoButton({
    children: (
        <VideoCameraFilled style={{fontSize: '24px'}} />
    ),
});