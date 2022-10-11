import React, {
    useState,
    useEffect,
    useRef,
    ReactElement,
    useCallback,
} from 'react';
import {
    AlignBlockDefaultButton,
    AlignBlockLeftButton,
    AlignBlockCenterButton,
    AlignBlockRightButton,
    DraftJsBlockAlignmentButtonType,
} from '@draft-js-plugins/buttons';
import { ProAlignmentPluginTheme } from './theme';
import { ProAlignmentPluginStore } from '.';
import EditImageButton from "../buttons/components/EditImageButton";
import {DraftJsBlockAlignmentButtonType2} from "../buttons";
import ImageModal from "../modals/ImageModal";
import {UploadFile} from "antd/lib/upload/interface";

function getRelativeParent(element: HTMLElement | null): HTMLElement | null {
    if (!element) {
        return null;
    }

    const position = window
        .getComputedStyle(element)
        .getPropertyValue('position');
    if (position !== 'static') {
        return element;
    }

    return getRelativeParent(element.parentElement);
}

interface ProAlignmentToolProps {
    theme: ProAlignmentPluginTheme;
    store: ProAlignmentPluginStore;
    uploadImageFile?: (e: UploadFile) => Promise<string>;
}

export default function ProAlignmentTool({
                                          store,
                                          theme,
                                             uploadImageFile
                                      }: ProAlignmentToolProps): ReactElement {

    const [position, setPosition] = useState({});
    const [alignment, setAlignment] = useState<string | null>(null);
    const [editPopup, setShowEditPopup] = useState<boolean>(false);
    const toolbar = useRef<HTMLDivElement>(null);
    const ref = useRef<any>();

    const onVisibilityChanged = useCallback(
        (visibleBlock?: null | string): void => {
            const clear = setTimeout(() => {
                let newPosition;
                const boundingRect = store.getItem('boundingRect');

                if (visibleBlock && boundingRect) {
                    const relativeParent = getRelativeParent(
                        toolbar.current!.parentElement
                    );
                    const toolbarHeight = toolbar.current!.clientHeight;
                    const relativeRect = relativeParent
                        ? relativeParent.getBoundingClientRect()
                        : document.body.getBoundingClientRect();
                    newPosition = {
                        top: boundingRect.top - relativeRect.top - toolbarHeight,
                        left:
                            boundingRect.left - relativeRect.left + boundingRect.width / 2,
                        transform: 'translate(-50%) scale(1)',
                        transition: 'transform 0.15s cubic-bezier(.3,1.2,.2,1)',
                    };
                } else {
                    newPosition = { transform: 'translate(-50%) scale(0)' };
                }
                const newAlignment = store.getItem('alignment') || 'default';
                setAlignment(newAlignment);
                setPosition(newPosition);
                ref.current = undefined;
            }, 0);
            ref.current = clear;
        },
        []
    );

    const onAlignmentChange = useCallback((value: string | undefined): void => {
        if (value) {
            setAlignment(value);
            let newPosition;
            const boundingRect = store.getItem('boundingRect');
            if (boundingRect) {
                const relativeParent = getRelativeParent(
                    toolbar.current!.parentElement
                );
                const toolbarHeight = toolbar.current!.clientHeight;
                const relativeRect = relativeParent
                    ? relativeParent.getBoundingClientRect()
                    : document.body.getBoundingClientRect();
                newPosition = {
                    top: boundingRect.top - relativeRect.top - toolbarHeight,
                    left:
                        boundingRect.left - relativeRect.left + boundingRect.width / 2,
                    transform: 'translate(-50%) scale(1)',
                    transition: 'transform 0.15s cubic-bezier(.3,1.2,.2,1)',
                };
                setPosition(newPosition);
            }
        }
    }, []);

    useEffect(
        () => () => {
            //clear timeout on unmount
            if (ref.current) {
                clearTimeout(ref.current);
            }
        },
        []
    );

    useEffect(() => {
        store.subscribeToItem('visibleBlock', onVisibilityChanged);
        store.subscribeToItem('alignment', onAlignmentChange);

        return () => {
            store.unsubscribeFromItem('visibleBlock', onVisibilityChanged);
            store.unsubscribeFromItem('alignment', onAlignmentChange);
        };
    }, [onVisibilityChanged, onAlignmentChange]);

    const defaultButtons: DraftJsBlockAlignmentButtonType[] = [
        AlignBlockDefaultButton,
        AlignBlockLeftButton,
        AlignBlockCenterButton,
        AlignBlockRightButton,
    ];

    const defaultButtons2: DraftJsBlockAlignmentButtonType2[] = [
        EditImageButton
    ]
    return (
        <React.Fragment>
            <div
                className={theme.alignmentToolStyles.alignmentTool}
                style={position}
                ref={toolbar}
            >
                {defaultButtons.map((Button, index) => (
                    <Button
                        /* the index can be used here as the buttons list won't change */
                        key={index}
                        alignment={alignment}
                        setAlignment={store.getItem('setAlignment')!}
                        theme={theme.buttonStyles}
                    />
                ))}
                {defaultButtons2.map((Button, index) => (
                    <Button
                        /* the index can be used here as the buttons list won't change */
                        key={defaultButtons.length + index}
                        editPopup = {editPopup}
                        setShowEditPopup={{
                            func: store.getItem('setShowEditPopup')!,
                            setVal: (val) => {
                                setShowEditPopup(val);
                            }
                        }}
                        theme={theme.buttonStyles}
                    />
                ))}
            </div>
            {<ImageModal
                        title={'Edit Image'}
                        formName={"edit-image-form-name"}
                        isModalVisible={editPopup}
                         uploadImageFile={uploadImageFile}
                         getImageData={store.getItem("imageData")!}
                         onClose={() => {
                store.getItem('setShowEditPopup')!({editPopup: false});
                setShowEditPopup(false);
            }} onOk={res => {
                store.getItem("setImageWidth")!({width: res.width});
                store.getItem("setImageSrc")!({src: res.src});
                store.getItem('setShowEditPopup')!({editPopup: false});
                setShowEditPopup(false);
            }}/>}
        </React.Fragment>
    );
}

