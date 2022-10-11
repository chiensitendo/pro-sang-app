import {convertFromRaw, convertToRaw, EditorState} from "draft-js";
import {convertToHTML} from "draft-convert";
import {getVideoSrc} from "../components/editor/video/components/DefaultVideoComponent";
import {CSSProperties} from "react";
import {convertBlockToHTML, convertCodeBlock, convertListItem} from "../components/editor/utils/convert";
import * as React from "react";

const textHtml = (string: string) => {
    let newString = string;
    newString = convertListItem(newString, "ol");
    newString = convertListItem(newString, "ul");
    newString = convertCodeBlock(newString);
    return newString;
}

export const convertFromJSONStringToHTML = (jsonString: string): string => {
    try {
        const editorState = EditorState.createWithContent(convertFromRaw(JSON.parse(jsonString)));
        const toHtml = convertToHTML({
            entityToHTML: (entity, originalText) => {

                if (entity && entity.type === 'IMAGE') {
                    const data = entity.data;
                    let style = "position: relative; cursor: default;";
                    const {alignment, width} = data;
                    switch (alignment) {
                        case 'left':
                            style += " float: left;";
                            break;
                        case 'center':
                            style += " margin-left: auto; margin-right: auto; display: block;";
                            break;
                        case 'right':
                            style += " float: right;";
                            break;
                        default:
                            break;
                    }
                    if (width) {
                        style += ` width: ${width}`;
                    }
                    const imageProps = {
                        src: entity.data.src
                    }
                    return `<img src=${imageProps.src} style="${style}" />`;
                }
                if (entity && entity.type === "draft-js-video-plugin-video") {
                    const data = entity.data;
                    const {height, width, src} = data;
                    const videoSrc = getVideoSrc({src: src});
                    const containerStyle: CSSProperties = {
                        width: '100%',
                        height: 0,
                        position: 'relative',
                        paddingBottom: height? height: '56.25%'
                    }
                    const iframeStyle: CSSProperties = {
                        width: width ? width: '100%',
                        height: height ? height: '100%',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                    }
                    return <div>
                        <div style={containerStyle}>
                            <iframe
                                src={videoSrc}
                                style={iframeStyle}
                                frameBorder="0"
                                allowFullScreen
                            />
                        </div>
                    </div>;
                }
                return originalText;
            },
            blockToHTML: function (block) {
                let entityMap = null;
                if (editorState && editorState.getCurrentContent() && convertToRaw(editorState.getCurrentContent())?.entityMap && block && block.entityRanges && block.entityRanges.length > 0) {
                    entityMap = convertToRaw(editorState.getCurrentContent()).entityMap;
                }
                return convertBlockToHTML(block, entityMap, editorState.getCurrentContent());
            },
        })(editorState.getCurrentContent());
        return textHtml(toHtml);
    } catch (e) {
        return '';
    }
}