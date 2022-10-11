import * as React from "react";

import {composeDecorators, EditorPlugin} from "@draft-js-plugins/editor";
import createInlineToolbarPlugin, {ToolbarProps} from "../editor/inline-toolbar";
import staticToolbarButtonStyles from "../../pages/lyric/styles/components/staticToolbarButton.module.scss";
import inlineToolbar from "../../pages/lyric/styles/components/inlineToolbar.module.scss";
import {ToolbarPubProps} from "@draft-js-plugins/static-toolbar/lib/components/Toolbar";
import createToolbarPlugin from "@draft-js-plugins/static-toolbar";
import toolBarStyles from "../../pages/lyric/styles/components/staticToolbar.module.scss";
import createTextAlignmentPlugin from "@draft-js-plugins/text-alignment";
import alignmentStyles from "../../pages/lyric/styles/components/alignmentStyles.module.scss";
import createFocusPlugin from "@draft-js-plugins/focus";
import createResizeablePlugin from "../editor/resizeable";
import createBlockDndPlugin from "@draft-js-plugins/drag-n-drop";
import createVideoPlugin from "../editor/video";
import createAlignmentPlugin from "../editor/ProAlignmentPlugin";
import alignmentToolStyles from "../../pages/lyric/styles/components/alignmentToolStyles.module.scss";
import createImagePlugin from "../editor/image";
import createHashtagPlugin from "@draft-js-plugins/hashtag";
import createLinkPlugin from "@draft-js-plugins/anchor";
import linkStyles from "../../pages/lyric/styles/components/linkStyles.module.scss";
import createEmojiPlugin from "@draft-js-plugins/emoji";
import createCounterPlugin from '@draft-js-plugins/counter';
import {UploadFile} from "antd/es/upload/interface";
import {LinkButtonPubParams} from "@draft-js-plugins/anchor/lib/components/LinkButton";
import {ComponentClass, ComponentType, FunctionComponent} from "react";
import {EmojiSuggestionsPubParams} from "@draft-js-plugins/emoji/lib/components/EmojiSuggestions";
import {EmojiSelectPubParams} from "@draft-js-plugins/emoji/lib/components/EmojiSelect";
import {DraftStyleMap, EditorState} from "draft-js";
import {ProSelectItem} from "../../types/general";
import fontsJson from "../../resources/fonts.json";
import {CharCounterPubProps} from "@draft-js-plugins/counter/lib/CharCounter";

interface FontItem {
    name: string;
    font: string;
}

interface FontResource {
    fonts: FontItem[];
}

export interface ProFullPlugin {
    plugins: EditorPlugin[],
    InlineToolbar:  React.ComponentType<ToolbarProps>;
    Toolbar:  React.ComponentType<ToolbarPubProps>;
    ProAlignmentTool:  React.ComponentType;
    LinkButton: ComponentClass<LinkButtonPubParams> | FunctionComponent<LinkButtonPubParams>;
    EmojiSuggestions: React.ComponentType<EmojiSuggestionsPubParams>;
    EmojiSelect: React.ComponentType<EmojiSelectPubParams>;
    addImage: (editorState: EditorState, url: string, extraData: Record<string, unknown>) => EditorState;
    addVideo: (     editorState: EditorState,     {src, width, height}: {src: string, width?: string, height?: string}) => EditorState;
}

interface ProChatPlugin {
    plugins: EditorPlugin[],
    Toolbar:  React.ComponentType<ToolbarPubProps>;
    ProAlignmentTool:  React.ComponentType;
    EmojiSuggestions: React.ComponentType<EmojiSuggestionsPubParams>;
    EmojiSelect: React.ComponentType<EmojiSelectPubParams>;
    CharCounter: ComponentType<CharCounterPubProps>;
}

export const exportFullPlugin = (uploadFileCallback:  ((e: UploadFile) => Promise<string>)): ProFullPlugin => {

    const inlineToolbarPlugin = createInlineToolbarPlugin(
        {
            theme: {
                buttonStyles: {
                    button: staticToolbarButtonStyles.button,
                    buttonWrapper: staticToolbarButtonStyles.buttonWrapper,
                    active: staticToolbarButtonStyles.active
                },
                toolbarStyles: {
                    toolbar: inlineToolbar.toolbar
                }
            }
        });

    const staticToolbarPlugin = createToolbarPlugin({
        theme: {
            buttonStyles: staticToolbarButtonStyles,
            toolbarStyles: {
                toolbar: toolBarStyles.toolbar
            }
        }
    });

    const textAlignmentPlugin = createTextAlignmentPlugin({
        theme: {
            alignmentStyles: {
                draftCenter: alignmentStyles.draftCenter,
                draftLeft: alignmentStyles.draftLeft,
                draftRight: alignmentStyles.draftRight
            }
        }
    });

    const focusPlugin = createFocusPlugin();
    const resizeablePlugin = createResizeablePlugin();
    const blockDndPlugin = createBlockDndPlugin();
    const videoPlugin = createVideoPlugin();
    const alignmentPlugin = createAlignmentPlugin({
        uploadImageFile: uploadFileCallback,
        theme: {
            buttonStyles: staticToolbarButtonStyles,
            alignmentToolStyles: {
                alignmentTool: alignmentToolStyles.alignmentTool
            }
        }
    });

    const decorator = composeDecorators(
        resizeablePlugin.decorator,
        alignmentPlugin.decorator,
        focusPlugin.decorator,
        blockDndPlugin.decorator
    );

    const imagePlugin = createImagePlugin({decorator});

    const linkPlugin = createLinkPlugin({
        theme: {
            link: linkStyles.link,
            input: linkStyles.input,
            inputInvalid: linkStyles.inputInvalid
        },
        placeholder: 'http://…',
    });
    const hashtagPlugin = createHashtagPlugin();

    const emojiPlugin = createEmojiPlugin({
        useNativeArt: true
    });

    return {
        plugins: [
            inlineToolbarPlugin,
            staticToolbarPlugin,
            textAlignmentPlugin,
            focusPlugin,
            alignmentPlugin,
            blockDndPlugin,
            resizeablePlugin,
            imagePlugin,
            emojiPlugin,
            linkPlugin,
            hashtagPlugin,
            videoPlugin],
        InlineToolbar: inlineToolbarPlugin.InlineToolbar,
        Toolbar: staticToolbarPlugin.Toolbar,
        ProAlignmentTool: alignmentPlugin.ProAlignmentTool,
        LinkButton: linkPlugin.LinkButton,
        EmojiSuggestions: emojiPlugin.EmojiSuggestions,
        EmojiSelect: emojiPlugin.EmojiSelect,
        addImage: imagePlugin.addImage,
        addVideo: videoPlugin.addVideo
    }
}

export const exportPluginForChat = (): ProChatPlugin => {

    const staticToolbarPlugin = createToolbarPlugin({
        theme: {
            buttonStyles: staticToolbarButtonStyles,
            toolbarStyles: {
                toolbar: toolBarStyles.toolbar
            }
        }
    });

    const blockDndPlugin = createBlockDndPlugin();
    const alignmentPlugin = createAlignmentPlugin({
        uploadImageFile:  (e: UploadFile<any>) => new Promise(res => res("")),
        theme: {
            buttonStyles: staticToolbarButtonStyles,
            alignmentToolStyles: {
                alignmentTool: alignmentToolStyles.alignmentTool
            }
        }
    });

    const linkPlugin = createLinkPlugin({
        theme: {
            link: linkStyles.link,
            input: linkStyles.input,
            inputInvalid: linkStyles.inputInvalid
        },
        placeholder: 'http://…',
    });
    const hashtagPlugin = createHashtagPlugin();

    const emojiPlugin = createEmojiPlugin({
        useNativeArt: true
    });
    const counterPlugin = createCounterPlugin();

    const { CharCounter } = counterPlugin;

    return {
        plugins: [
            staticToolbarPlugin,
            alignmentPlugin,
            blockDndPlugin,
            emojiPlugin,
            linkPlugin,
            hashtagPlugin,
            counterPlugin],
        Toolbar: staticToolbarPlugin.Toolbar,
        ProAlignmentTool: alignmentPlugin.ProAlignmentTool,
        EmojiSuggestions: emojiPlugin.EmojiSuggestions,
        EmojiSelect: emojiPlugin.EmojiSelect,
        CharCounter: CharCounter
    }
}


const {fonts} = fontsJson as FontResource;
export const FONT_FAMILY_STYLE_PREFIX = "FONT_FAMILY_";

const retrieveFontSelectionItems = (): ProSelectItem[] => fonts.map((font, index) => {
  const {name} =font;
  return {
      label: name,
      value: `${FONT_FAMILY_STYLE_PREFIX}${name.toUpperCase()}`,
      id: index
  }
});

const createFontFamilyStyleMap = (): DraftStyleMap => {
    const style: DraftStyleMap = {};
    fonts.forEach(font => {
       const key = FONT_FAMILY_STYLE_PREFIX + font.name.toUpperCase();
       style[key] = {fontFamily: font.font};
    });
    return style;
}

export const fontFamilyStyles = retrieveFontSelectionItems();

export const getFontFamilyNameByCode = (key: string) => {
    if (!key) {
        return "";
    }
    const font = fontFamilyStyles.find(font => font.value === key);
    if (!font) {
        return "";
    }
    return font.label;
}

export const getFontFamilyCodeByName = (name: string) => {
    if (!name) {
        return "";
    }
    const font = fontFamilyStyles.find(font => font.label === name);
    if (!font) {
        return "";
    }
    return font.value;
}

export const fontFamilyStyleMap: DraftStyleMap = createFontFamilyStyleMap();

export const createFontSizeOptions = (): Array<{value: string}> => {
    const options: Array<{value: string}> = [];
    for (let i = 1; i <= 254; i++) {
        options.push({value: i.toString()});
    }
    return options;
}
export const FONT_SIZE_STYLE_PREFIX = "FONT_SIZE_";
const createFontSizeStyleMap = (): DraftStyleMap => {
    const styles: DraftStyleMap = {};
    createFontSizeOptions().forEach(size => {
        styles[`${FONT_SIZE_STYLE_PREFIX}${size.value}`] = {
            fontSize: size.value + "px"
        }
    });
    return styles;
}

export const fontSizeStyleMap: DraftStyleMap = createFontSizeStyleMap();