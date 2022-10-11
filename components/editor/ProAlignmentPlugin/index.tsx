import React, { ComponentType, ReactElement } from 'react';
import { ContentBlock, EditorState } from 'draft-js';
import { EditorPlugin } from '@draft-js-plugins/editor';
// import { createStore, Store } from '@draft-js-plugins/utils';
import { createStore, Store } from '../utils';
import createDecorator from './createDecorator';
import ProAlignmentTool from './ProAlignmentTool';
import { ProAlignmentPluginTheme } from './theme';

import buttonStyles from "./buttonStyles.module.scss";
import alignmentToolStyles from "./alignmentToolStyles.module.scss";
import {UploadFile} from "antd/lib/upload/interface";

const defaultTheme: ProAlignmentPluginTheme = {
    buttonStyles,
    alignmentToolStyles: {
        alignmentTool: alignmentToolStyles.alignmentTool
    }
};

const getImageData = (
    contentBlock: ContentBlock,
    {
        getEditorState,
    }: {
        getEditorState(): EditorState; // a function to get the current EditorState
    }
) => () => {

    const entityKey = contentBlock.getEntityAt(0);
    if (entityKey) {
        const editorState = getEditorState();
        const contentState = editorState.getCurrentContent();
        return contentState.getEntity(entityKey).getData();
    } else {
        return null;
    }
};

const createSetAlignment = (
    contentBlock: ContentBlock,
    {
        getEditorState,
        setEditorState,
    }: {
        setEditorState(editorState: EditorState): void; // a function to update the EditorState
        getEditorState(): EditorState; // a function to get the current EditorState
    }
) => (data: Record<string, unknown>) => {

    const entityKey = contentBlock.getEntityAt(0);
    if (entityKey) {
        const editorState = getEditorState();
        const contentState = editorState.getCurrentContent();
        contentState.mergeEntityData(entityKey, { ...data });
        setEditorState(
            EditorState.forceSelection(editorState, editorState.getSelection())
        );
    }
};

interface AlignmentPluginConfig {
    theme?: ProAlignmentPluginTheme;
    uploadImageFile?: (e: UploadFile) => Promise<string>;
}

interface StoreItemMap {
    isVisible?: boolean;
    getReadOnly?(): boolean;
    getEditorState?(): EditorState;
    setEditorState?(editorState: EditorState): void;
    visibleBlock?: null | string;
    setAlignment?(val: { alignment: string }): void;
    setShowEditPopup?(val: { editPopup: boolean }): void;
    setImageWidth?(val: { width: number | string }): void;
    setImageSrc?(val: { src: string }): void;
    alignment?: string;
    editPopup?: boolean;
    boundingRect?: DOMRect;
    imageData?: any;
}

export type ProAlignmentPluginStore = Store<StoreItemMap>;

export default (
    config: AlignmentPluginConfig = {}
): EditorPlugin & {
    decorator: ReturnType<typeof createDecorator>;
    ProAlignmentTool: ComponentType;
} => {
    const store = createStore<StoreItemMap>({
        isVisible: false,
        editPopup: false
    });

    const { theme = defaultTheme, uploadImageFile } = config;

    const DecoratedAlignmentTool = (): ReactElement => (
        <ProAlignmentTool store={store} theme={theme} uploadImageFile={uploadImageFile} />
    );

    return {
        initialize: ({ getReadOnly, getEditorState, setEditorState }) => {
            store.updateItem('getReadOnly', getReadOnly);
            store.updateItem('getEditorState', getEditorState);
            store.updateItem('setEditorState', setEditorState);
        },
        decorator: createDecorator({ store }),
        blockRendererFn: (contentBlock, { getEditorState, setEditorState }) => {

            const entityKey = contentBlock.getEntityAt(0);
            const contentState = getEditorState().getCurrentContent();
            const alignmentData = entityKey
                ? contentState.getEntity(entityKey).getData()
                : {};
            return {
                props: {
                    alignment: alignmentData.alignment || 'default',
                    editPopup: alignmentData.editPopup || false,
                    imgWitdh: alignmentData.width || 'auto',
                    videoHeight: alignmentData.height,
                    setAlignment: createSetAlignment(contentBlock, {
                        getEditorState,
                        setEditorState,
                    }),
                    setShowEditPopup: createSetAlignment(contentBlock, {
                        getEditorState,
                        setEditorState,
                    }),
                    setImageWidth: createSetAlignment(contentBlock, {
                        getEditorState,
                        setEditorState,
                    }),
                    imageData: getImageData(contentBlock ,{getEditorState}),
                    setImageSrc: createSetAlignment(contentBlock, {
                        getEditorState,
                        setEditorState,
                    }),
                },
            };
        },
        ProAlignmentTool: DecoratedAlignmentTool,
    };
};