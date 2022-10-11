import React, {CSSProperties, ReactElement} from 'react';
import PropTypes from 'prop-types';
import { ContentBlock, ContentState, SelectionState } from 'draft-js';
import { isYoutube, getYoutubeSrc, isVimeo, getVimeoSrc } from '../utils';
import {VideoPluginTheme} from "../constants";


const YOUTUBE_PREFIX = 'https://www.youtube.com/embed/';
const VIMEO_PREFIX = 'https://player.vimeo.com/video/';

export const getVideoSrc = ({ src }: { src: string }): string | undefined => {
    if (isYoutube(src)) {
        const { srcID } = getYoutubeSrc(src);
        return `${YOUTUBE_PREFIX}${srcID}`;
    }
    if (isVimeo(src)) {
        const { srcID } = getVimeoSrc(src);
        return `${VIMEO_PREFIX}${srcID}`;
    }
    return undefined;
};

export interface DefaultVideoComponentProps {
    blockProps: { src: string, imgWitdh?: any, videoHeight?: any };
    className?: string;
    style?: CSSProperties;
    theme: VideoPluginTheme;

    //removed props
    block: ContentBlock;
    customStyleMap: unknown;
    customStyleFn: unknown;
    decorator: unknown;
    forceSelection: unknown;
    offsetKey: string;
    selection: SelectionState;
    tree: unknown;
    contentState: ContentState;
    blockStyleFn: unknown;
}

const DefaultVideoComponent = ({
                                   blockProps,
                                   className = '',
                                   style,
                                   theme,
                                   ...otherProps
                               }: DefaultVideoComponentProps): ReactElement => {
    const src = getVideoSrc(blockProps);
    const imgWitdh = blockProps.imgWitdh;
    const videoHeight = blockProps.videoHeight;
    if (src) {
        return (
            <div style={style}>
                <div className={`${theme.iframeContainer} ${className}`} style={{paddingBottom: videoHeight}}>
                    <iframe
                        className={theme.iframe}
                        src={src}
                        style={{width: imgWitdh, height: videoHeight}}
                        frameBorder="0"
                        allowFullScreen
                    />
                </div>
            </div>
        );
    }

    const {
        block, // eslint-disable-line @typescript-eslint/no-unused-vars
        customStyleMap, // eslint-disable-line @typescript-eslint/no-unused-vars
        customStyleFn, // eslint-disable-line @typescript-eslint/no-unused-vars
        decorator, // eslint-disable-line @typescript-eslint/no-unused-vars
        forceSelection, // eslint-disable-line @typescript-eslint/no-unused-vars
        offsetKey, // eslint-disable-line @typescript-eslint/no-unused-vars
        selection, // eslint-disable-line @typescript-eslint/no-unused-vars
        tree, // eslint-disable-line @typescript-eslint/no-unused-vars
        contentState, // eslint-disable-line @typescript-eslint/no-unused-vars
        blockStyleFn, // eslint-disable-line @typescript-eslint/no-unused-vars
        ...elementProps
    } = otherProps;
    return (
        <video
            src={blockProps.src}
            className={theme.video}
            style={style}
            {...elementProps}
            controls
        />
    );
};

DefaultVideoComponent.propTypes = {
    blockProps: PropTypes.object.isRequired,
    className: PropTypes.string,
    style: PropTypes.object,
    theme: PropTypes.object.isRequired,
};
export default DefaultVideoComponent;