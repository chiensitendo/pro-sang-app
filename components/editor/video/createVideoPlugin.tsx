import React, { ComponentType, ReactElement } from 'react';
import { EditorPlugin } from '@draft-js-plugins/editor';
import addVideo from './modifiers/addVideo';
import DefaultVideoComponent, {
    DefaultVideoComponentProps,
} from './components/DefaultVideoComponent';
import * as types from './constants';
import {VideoPluginTheme} from "./constants";
import style from "./video.module.scss";

const defaultTheme: VideoPluginTheme = {
    iframe: style.iframe,
    video: style.video,
    invalidVideoSrc: style.invalidVideoSrc,
    iframeContainer: style.iframeContainer
};


export interface VideoPluginConfig {
    theme?: VideoPluginTheme;
    videoComponent?: ComponentType<DefaultVideoComponentProps>;
    decorator?(
        component: ComponentType<DefaultVideoComponentProps>
    ): ComponentType<DefaultVideoComponentProps>;
}

export interface VideoPlugin extends EditorPlugin {
    addVideo: typeof addVideo;
    types: typeof types;
}

export default function videoPlugin(
    config: VideoPluginConfig = {}
): VideoPlugin {
    const theme = config.theme ? config.theme : defaultTheme;
    let Video =
        config.videoComponent ||
        (DefaultVideoComponent as ComponentType<DefaultVideoComponentProps>);
    if (config.decorator) {
        Video = config.decorator(Video);
    }
    const ThemedVideo = (props: DefaultVideoComponentProps): ReactElement => (
        <Video {...props} theme={theme} />
    );
    return {
        blockRendererFn: (block, { getEditorState }) => {
            if (block.getType() === types.ATOMIC) {
                // TODO subject to change for draft-js next release
                const contentState = getEditorState().getCurrentContent();
                const entityKey = block.getEntityAt(0);
                if (!entityKey) return null;
                const entity = contentState.getEntity(entityKey);
                const type = entity.getType();
                const { src } = entity.getData();
                if (type === types.VIDEOTYPE) {
                    return {
                        component: ThemedVideo,
                        editable: false,
                        props: {
                            src,
                        },
                    };
                }
            }

            return null;
        },
        addVideo,
        types,
    };
}