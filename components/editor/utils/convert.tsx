import {RawDraftContentBlockWithCustomType} from "draft-convert";
import * as React from "react";
import {extractHashtagsWithIndices} from "../hashtag/extractHashtags";
import {ContentState} from "draft-js";
import {CSSProperties} from "react";
import {FONT_FAMILY_STYLE_PREFIX, FONT_SIZE_STYLE_PREFIX, fontFamilyStyleMap} from "../../core/TextEditorUtils";

export const convertBlockToHTML = (block: RawDraftContentBlockWithCustomType<string>, entityMap: any = null, contentState: ContentState) => {

    const hashtags = extractHashtagsWithIndices(block.text);
    if (hashtags.length > 0) {
        hashtags.forEach(hashtag => {
            const {indices} = hashtag;
            if (!entityMap ) {
                entityMap = {};
                entityMap["0"] = {
                    type: "HASHTAG"
                };
                block.entityRanges.push({
                    key: 0,
                    offset: indices[0],
                    length: indices[1] - indices[0]
                });
            } else {
                let max = 0;
                Object.keys(entityMap).forEach(key => {
                    if (+key > max) {
                        max = +key;
                    }
                });
                entityMap[`${max + 1}`] = {
                    type: "HASHTAG"
                }
                block.entityRanges.push({
                    key: max + 1,
                    offset: indices[0],
                    length: indices[1] - indices[0]
                });
            }
        })
    }
    if (block.type === 'unstyled'
        || block.type === 'blockquote'
        || block.type === "ordered-list-item"
        || block.type === "unordered-list-item"
        || block.type === "header-two") {
        const childElement = convertTextField(block, entityMap);
        if (block.type === 'blockquote') {
            return <blockquote>{childElement}</blockquote>
        } else if (block.type === "ordered-list-item") {
            return <ol className="editor_ol"><li>{childElement}</li></ol>
        } else if (block.type === "unordered-list-item") {
            return <ul className="editor_ol"><li>{childElement}</li></ul>
        }
        else {
            if (block.text === '' && block.inlineStyleRanges.length === 0) {
                return <div><span><br/></span></div>
            } else {
                return <div>{childElement}</div>
            }

        }
    }
}

const convertTextField = (block: RawDraftContentBlockWithCustomType<string>, entityMap: any = null) => {
    const wrapperStyle: React.CSSProperties = {position: "relative", whiteSpace: "pre-wrap", textAlign: 'left'};
    const components: any[] = [];
        const componentStyles: string[][] = [];
        const componentText: string[] = [];
        let styleList = "-";
        for (let i = 0; i < block.text.length; i++) {
            const list = [];
            let s = "";
            if (block.inlineStyleRanges && block.inlineStyleRanges.length > 0) {
                for (let index = 0; index < block.inlineStyleRanges.length; index++) {
                    const style = block.inlineStyleRanges[index];
                    const start = style.offset;
                    const end = style.offset + style.length - 1;
                    if (i >= start && i <= end) {
                        s += (style.style) + "-";
                        list.push(style.style);
                    }
                }
            }
            if (entityMap) {
                block.entityRanges.forEach(entity => {
                    const {length, offset, key} = entity;
                    const start = offset;
                    const end = offset + length -1;
                    if (entityMap[key]) {
                        if (entityMap[key].type === "LINK") {
                            if (i >= start && i <= end) {
                                s += (key + '-LINK') + "-";
                                list.push(key + '-LINK');
                            }
                        } else if (entityMap[key].type === "HASHTAG") {
                            if (i >= start && i <= end) {
                                s += (key + '-HASHTAG') + "-";
                                list.push(key + '-HASHTAG');
                            }
                        }
                    }
                });

            }
            if (styleList !== s) {
                if (s === "") {
                    componentStyles.push(['EMPTY']);
                } else {
                    componentStyles.push(list);
                }
                componentText.push(block.text[i]);
                styleList = s;
            } else {
                componentText[componentText.length - 1] += block.text[i];
            }
        }
        componentStyles.forEach((styles, index) => {
            const textStyle: React.CSSProperties = {};
            let linkTag: any = null;
            let hashTag: boolean = false;
            styles.forEach(style => {
                switch (style) {
                    case 'CODE':
                        textStyle.overflowWrap = 'break-word';
                        textStyle.fontFamily = 'monospace';
                        break;
                    case "UNDERLINE":
                        textStyle.textDecoration = 'underline';
                        break;
                    case "ITALIC":
                        textStyle.fontStyle = 'italic';
                        break;
                    case "BOLD":
                        textStyle.fontWeight = 'bold';
                        break;
                    case "right":
                        wrapperStyle.textAlign = "right";
                        break;
                    case "center":
                        wrapperStyle.textAlign = "center";
                        break;
                    default:
                        if ((/^#([A-Fa-f0-9]{3}){1,2}$/.test(style))) {
                            textStyle.color = style;
                        }
                        if (style.startsWith("BACKGROUND_")) {
                            const c = style.replace("BACKGROUND_", "");
                            textStyle.background = c;
                        } else if (style.startsWith(FONT_SIZE_STYLE_PREFIX)) {

                            textStyle.fontSize = style.replace(FONT_SIZE_STYLE_PREFIX, "") + "px";
                        } else if (style.startsWith(FONT_FAMILY_STYLE_PREFIX)) {
                            textStyle.fontFamily = fontFamilyStyleMap[style].fontFamily;
                        }
                        if (entityMap && style.endsWith("-LINK")) {
                            const key = style.split("-")[0];
                            linkTag = entityMap[key].data.url;
                        } else if (entityMap && style.endsWith("-HASHTAG")) {
                            hashTag = true;
                        }
                        break;
                }
            });
            const textComponent = <span style={textStyle} key={components.length}>
            <span>{componentText[index]}</span>
        </span>;
            if (linkTag) {
                components.push(<a href={linkTag} key={components.length}
                                   style={{color: '#2996da', textDecoration: 'underline'}}>{textComponent}</a>);
            } else if (hashTag) {
                components.push(<span key={components.length}
                                   style={{color: '#5e93c5'}}>{textComponent}</span>);
            } else {
                components.push(textComponent);
            }
        });

    return <div style={wrapperStyle}>
        {components}
    </div>;
}

export const convertListItem = (htmlString: string, type: "ol" | "ul"): string => {
    let newString = htmlString;
    const olRegex = new RegExp(`<${type}[^>]*>(.*?)</${type}>`, 'gi');
    let result;
    let i = 0;
    let beforeValue = '';
    let l = 0;
    let incre = 0;
    let beforeIndex = 0;
    while((result = olRegex.exec(htmlString)) !== null) {
        const value = result[0];
        if (l > 0 && result.index === l) {
            const removedValue = value.replaceAll(new RegExp(`(<${type}[^>]*>|</${type}>)`, 'gi'),'');
            const newOl = beforeValue.replaceAll(`</${type}>`,'') + removedValue + `</${type}>`;
            let index = result.index - incre;
            let startString = newString.substring(0, index);
            let endString = newString.substring(index + value.length);
            newString = startString + endString;
            startString = newString.substring(0, beforeIndex);
            endString = newString.substring(beforeIndex + beforeValue.length);
            newString = startString + newOl + endString;

            incre += value.length + beforeValue.length - newOl.length;
            // newString = newString.replaceAll(value, '');
            // newString = newString.replaceAll(beforeValue, newOl);
            beforeValue = newOl;

        } else {
            beforeIndex = result.index -incre;

            l = result.index;
            beforeValue = value;

        }
        l += value.length;
        i++;
    }
    return newString;
}

export const convertCodeBlock = (htmlString: string): string => {
    const type = "pre";
    let newString = htmlString;
    const olRegex = new RegExp(`<${type}[^>]*>([^(?=.*)]*?)</${type}>`, 'gi');
    let result;
    let l = 0;
    const indexes: number[] = [];
    const values: string[] = [];
    while((result = olRegex.exec(htmlString)) !== null) {
        const value = result[0];
        indexes.push(result.index);
        values.push(value);
    }
    values.forEach((value, index) => {
        const newValue = `<${type}>` + value + `</${type}>`;
        newString = replaceAt(newString, indexes[index] , newValue, value);

        l = newValue.length - value.length;
        indexes.forEach((ii, ind) => {
            if (ind > index) {
                indexes[ind]+=l;
            }
        });
    });
    return newString;
}

const replaceAt = (str: string, index: number, replacement: string, value: string) => {
    return str.substring(0, index ) + replacement + str.substring(index + value.length );
}