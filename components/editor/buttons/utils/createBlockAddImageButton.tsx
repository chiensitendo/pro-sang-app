/* eslint-disable react/no-children-prop */
import clsx from 'clsx';
import React, {ComponentType, MouseEvent, ReactNode, useMemo, useState} from 'react';
import {ToolbarChildrenProps} from "@draft-js-plugins/inline-toolbar/lib/components/Toolbar";
import {DraftJsStyleButtonProps, DraftJsStyleButtonType} from "@draft-js-plugins/buttons";
import ImageModal from "../../modals/ImageModal";
import {UploadFile} from "antd/lib/upload/interface";
import {getSelectedBlock} from "./blocks";

interface CreateBlockImageButtonProps extends ToolbarChildrenProps {
    editPopup: boolean;
    children: ReactNode;
}

type Props1 = {
    uploadImageFile?: (e: UploadFile) => Promise<string>;
    addImage?: (width: any, src: any) => void;
}

declare type Props  = ComponentType<DraftJsStyleButtonProps & Props1>;

export default function createBlockAddImageButton({
                                                       children,
                                                   }: CreateBlockImageButtonProps): Props {
    return function BlockAddImageButton(props) {
        const [editPopup, setShowEditPopup] = useState<boolean>(false);

        const activate = (event: MouseEvent): void => {
            event.preventDefault();
            setShowEditPopup(true);
        };

        const preventBubblingUp = (event: MouseEvent): void => {
            event.preventDefault();
        };

        const entity = useMemo<{data: any, type: string} | null>(() => {
            if (!(props && props.getEditorState)) {
                return null;
            }
            const blockKey = getSelectedBlock(props.getEditorState())?.getKey() as any;
            if (!blockKey) {
                return null;
            }
            const key = props.getEditorState().getCurrentContent().getBlockMap().get(blockKey).getEntityAt(0);
            if (!key) {
                return null;
            }
            return {
                data: props.getEditorState().getCurrentContent().getEntity(key).getData(),
                type: props.getEditorState().getCurrentContent().getEntity(key).getType()
            }
        },[props]);


        const isActive = (): boolean => entity !== null && entity.data !== null && entity.type === "IMAGE";

        const { theme, buttonProps = {} } = props;
        const className = isActive()
            ? clsx(theme.button, theme.active)
            : theme.button;

        const imageData = useMemo(() => {
            if (!entity || !entity.data) {
                return {src: '', width: '100%'};
            }

            return {src: entity.data.src, width: entity.data.width ? entity.data.width: '100%'}
        },[entity]);

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
                <ImageModal
                            title={!isActive() ? "Add Image": "Edit Image"}
                            formName={'add-image-form-name'}
                            isModalVisible={editPopup}
                            uploadImageFile={props.uploadImageFile}
                            getImageData={() => (imageData)}
                            onClose={() => {
                                setShowEditPopup(false);
                            }} onOk={res => {
                    props.addImage && props.addImage(res.width, res.src);
                    setShowEditPopup(false);
                }}/>
            </React.Fragment>

        );
    };
}
