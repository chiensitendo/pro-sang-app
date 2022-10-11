import React, {useState} from "react";
import {Alert, Modal} from "antd";
import getTranslation from "../../translations";

const ConfirmModal: React.FC<ConfirmModalProps> = (props) => {

    const {onOk, onCancel, visible, title, locale, description} = props;

    return (
        <>
            <Modal
                title={title}
                visible = {visible}
                onOk={onOk}
                onCancel={onCancel}
                cancelText={getTranslation("lyric.button.cancel", "Cancel", locale)}
            >
                <div style={{padding: '0 20px'}}>
                    <Alert
                        description={description ? description: 'Warning'}
                        type="warning"
                        showIcon
                        closable={false}
                    />
                </div>
            </Modal>
        </>
    );
};

interface ConfirmModalProps {
    title?: string;
    visible: boolean;
    description?: string;
    onOk?: ((e: React.MouseEvent<HTMLElement, MouseEvent>) => void);
    onCancel?:  ((e: React.MouseEvent<HTMLElement, MouseEvent>) => void);
    locale?: string | undefined;
}

export default ConfirmModal;