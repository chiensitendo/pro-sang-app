/* eslint-disable react/no-children-prop */
import clsx from 'clsx';
import React, { MouseEvent, ReactNode } from 'react';
import {DraftJsBlockAlignmentButtonType2} from '..';

interface CreateBlockImageButtonProps {
    editPopup: boolean;
    children: ReactNode;
}

export default function createBlockEditImageButton({
                                                       editPopup,
                                                       children,
                                                   }: CreateBlockImageButtonProps): DraftJsBlockAlignmentButtonType2 {
    return function BlockAlignmentButton(props) {
        const activate = (event: MouseEvent): void => {
            event.preventDefault();
            const {editPopup} = props;
            const edit = !editPopup;
            props.setShowEditPopup.setVal(edit);
            props.setShowEditPopup.func({editPopup: edit});
        };

        const preventBubblingUp = (event: MouseEvent): void => {
            event.preventDefault();
        };

        const isActive = (): boolean => props.editPopup === editPopup;

        const { theme, buttonProps = {} } = props;
        const className = isActive()
            ? clsx(theme.button, theme.active)
            : theme.button;

        return (
            <div className={theme.buttonWrapper} onMouseDown={preventBubblingUp}>
                <button
                    children={children}
                    {...buttonProps}
                    className={className}
                    onClick={activate}
                    type="button"
                />
            </div>
        );
    };
}