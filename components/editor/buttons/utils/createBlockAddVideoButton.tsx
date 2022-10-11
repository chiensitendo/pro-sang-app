/* eslint-disable react/no-children-prop */
import clsx from 'clsx';
import React, {ComponentType, MouseEvent, ReactNode, useMemo, useState} from 'react';
import {ToolbarChildrenProps} from "@draft-js-plugins/inline-toolbar/lib/components/Toolbar";
import {DraftJsStyleButtonProps, DraftJsStyleButtonType} from "@draft-js-plugins/buttons";
import ImageModal from "../../modals/ImageModal";
import {UploadFile} from "antd/lib/upload/interface";
import {getSelectedBlock} from "./blocks";
import VideoModal from "../../modals/VideoModal";

interface CreateBlockVideoButtonProps extends ToolbarChildrenProps {
    editPopup: boolean;
    children: ReactNode;
}

type Props1 = {
    addVideo?: (src: any, width?: any, height?: any) => void;
}

declare type Props = ComponentType<DraftJsStyleButtonProps & Props1>;

export default function createBlockAddVideoButton({
                                                      children,
                                                  }: CreateBlockVideoButtonProps): Props {
    return function BlockAddVideoButton(props) {

        const [editPopup, setShowEditPopup] = useState<boolean>(false);

        const activate = (event: MouseEvent): void => {
            event.preventDefault();
            setShowEditPopup(true);
        };

        const preventBubblingUp = (event: MouseEvent): void => {
            event.preventDefault();
        };
        const {theme, buttonProps = {}} = props;
        const className = theme.button;
        return (
            <React.Fragment>
                <div className={theme.buttonWrapper} onMouseDown={preventBubblingUp}>
                    <button
                        children={children}
                        {...buttonProps}
                        className={className}
                        onClick={activate}
                        type="button"
                    />
                </div>
                <VideoModal
                    title="Add Video"
                    formName={'add-video-form-name'}
                    isModalVisible={editPopup}
                    onClose={() => {
                        setShowEditPopup(false);
                    }} onOk={res => {
                    props.addVideo && props.addVideo(res.src, res.width, res.height);
                    setShowEditPopup(false);
                }}/>
            </React.Fragment>

        );
    };
}
