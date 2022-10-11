import {NextPage} from "next";
import * as React from "react";
import LyricLayout from "../../layouts/LyricLayout";
import Editor, {composeDecorators} from '@draft-js-plugins/editor';
import createInlineToolbarPlugin from '../editor/inline-toolbar';
import {Component, CSSProperties, LegacyRef, useCallback, useEffect, useRef, useState} from "react";
import Draft, {
    EditorState,
    convertToRaw, DraftStyleMap, convertFromRaw,
} from "draft-js";
import createToolbarPlugin, {
    Separator
} from '@draft-js-plugins/static-toolbar';
import {
    AlignTextCenterButton,
    AlignTextLeftButton, AlignTextRightButton,
    BlockquoteButton,
    BoldButton,
    CodeBlockButton,
    CodeButton,
    DraftJsStyleButtonProps,
    HeadlineOneButton,
    HeadlineThreeButton,
    HeadlineTwoButton,
    ItalicButton,
    OrderedListButton,
    UnderlineButton,
    UnorderedListButton,
} from '@draft-js-plugins/buttons';
import createTextAlignmentPlugin from '@draft-js-plugins/text-alignment';
import createImagePlugin from "../editor/image";
import createBlockDndPlugin from '@draft-js-plugins/drag-n-drop';
import createAlignmentPlugin from '../editor/ProAlignmentPlugin';
import createFocusPlugin from '@draft-js-plugins/focus';
import createResizeablePlugin from '../editor/resizeable';
import createHashtagPlugin from '@draft-js-plugins/hashtag';
import createVideoPlugin from '../editor/video';

import '@draft-js-plugins/alignment/lib/plugin.css';
import '@draft-js-plugins/image/lib/plugin.css';
import '@draft-js-plugins/linkify/lib/plugin.css';
import '@draft-js-plugins/focus/lib/plugin.css';
import '@draft-js-plugins/anchor/lib/plugin.css';
import '@draft-js-plugins/inline-toolbar/lib/plugin.css';
import '@draft-js-plugins/static-toolbar/lib/plugin.css';
import '@draft-js-plugins/emoji/lib/plugin.css';
import '@draft-js-plugins/hashtag/lib/plugin.css';


import styles from "../../pages/lyric/styles/test.module.scss";
import toolBarStyles from "../../pages/lyric/styles/components/staticToolbar.module.scss";
import inlineToolbar from "../../pages/lyric/styles/components/inlineToolbar.module.scss";
import staticToolbarButtonStyles from "../../pages/lyric/styles/components/staticToolbarButton.module.scss";
import alignmentStyles from "../../pages/lyric/styles/components/alignmentStyles.module.scss";
import alignmentToolStyles from "../../pages/lyric/styles/components/alignmentToolStyles.module.scss";
import linkStyles from "../../pages/lyric/styles/components/linkStyles.module.scss";
import { convertToHTML, convertFromHTML } from 'draft-convert';
import {addDoc, collection, } from "@firebase/firestore";
import {ref, uploadBytes, getDownloadURL } from "@firebase/storage";
import {fireBaseDatabase, fireBaseStorage, LYRIC_TEMP_PICTURE_BUCK} from "../../firebaseConfig";
import {UploadFile} from "antd/lib/upload/interface";
import {useLoading} from "../core/useLoading";
import AddImageButton from "../editor/buttons/components/AddImageButton";
import {convertBlockToHTML, convertCodeBlock, convertListItem} from "../editor/utils/convert";
import createEmojiPlugin from "@draft-js-plugins/emoji";
import createLinkPlugin from "@draft-js-plugins/anchor";
import AddVideoButton from "../editor/buttons/components/AddVideoButton";
import {getVideoSrc} from "../editor/video/components/DefaultVideoComponent";
import ColorPickerButton from "../editor/buttons/components/ColorPickerButton";
import BackgroundPickerButton from "../editor/buttons/components/BackgroundPickerButton";
import {ToolbarChildrenProps} from "@draft-js-plugins/inline-toolbar/lib/components/Toolbar";
import {OverrideContentProps} from "@draft-js-plugins/anchor/lib/components/AddLinkForm";
import HeadlineFourButton from "../editor/buttons/components/HeadlineFourButton";
import ProCodeBlockButton from "../editor/buttons/components/ProCodeBlockButton";
import * as Immutable from "immutable";
import InlineColorPickerButton from "../editor/buttons/components/InlineColorPickerButton";
import {getColorStorage, getRecentColorStorage} from "../../services/storage-services";
import {ColorResult} from "react-color";
import InlineBackgroundPickerButton from "../editor/buttons/components/InlineBackgroundPickerButton";
import {fontFamilyStyleMap, fontSizeStyleMap} from "../core/TextEditorUtils";
import FontFamilySelect from "../editor/buttons/components/FontFamilySelect";
import FontSizeSelect from "../editor/buttons/components/FontSizeSelect";
import axios from "axios";


const emojiPlugin = createEmojiPlugin({
    useNativeArt: true
});
const { EmojiSuggestions, EmojiSelect } = emojiPlugin;

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
const linkPlugin = createLinkPlugin({
    theme: {
        link: linkStyles.link,
        input: linkStyles.input,
        inputInvalid: linkStyles.inputInvalid
    },
    placeholder: 'http://…',
});

const staticToolbarPlugin = createToolbarPlugin({
    theme: {
        buttonStyles: staticToolbarButtonStyles,
        toolbarStyles: {
            toolbar: toolBarStyles.toolbar
        }
    }
});

const hashtagPlugin = createHashtagPlugin();


const textAlignmentPlugin = createTextAlignmentPlugin({
    theme: {
        alignmentStyles: {
            draftCenter: alignmentStyles.draftCenter,
            draftLeft: alignmentStyles.draftLeft,
            draftRight: alignmentStyles.draftRight
        }
    }
});

const uploadFile = async (e: UploadFile, setLoading: any) => {
    const {name, originFileObj} = e;
    const file = originFileObj as File;
    const lyricStorage = ref(fireBaseStorage, LYRIC_TEMP_PICTURE_BUCK + name);
    const lyricTempDb = collection(fireBaseDatabase, "/lyrics/temp/files/");
    setLoading && setLoading(true);
    return addDoc(lyricTempDb, {
        file: file.name,
        isSaved: false,
        createdDate: new Date(),
        updatedDate: new Date()
    }).then(snap => {
        return uploadBytes(lyricStorage, file).then((snapshot) => {
            return getDownloadURL(snapshot.ref).then(url => {
                setLoading(false);
                return url;
            }).catch(err => {
                setLoading(false);
                return err;
            });
        });
    }).catch(err => {
        setLoading && setLoading(false);
        return err;
    });

}

const focusPlugin = createFocusPlugin();
const resizeablePlugin = createResizeablePlugin();
const blockDndPlugin = createBlockDndPlugin();
const videoPlugin = createVideoPlugin();
const alignmentPlugin = createAlignmentPlugin({
    uploadImageFile: e => uploadFile(e, null),
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

const { Toolbar } = staticToolbarPlugin;

const { InlineToolbar } = inlineToolbarPlugin;


const { ProAlignmentTool } = alignmentPlugin;



const plugins = [
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
    videoPlugin];


const fromHtml = (html: any) =>  convertFromHTML({
    htmlToEntity: (nodeName, node, createEntity) => {
        if (nodeName === 'img') {
            let data: any = {src: node.src};
            if (node.style) {
                const {float, marginLeft, marginRight, display} = node.style;
                if (float) {
                    if (float === "left") {
                        data['alignment'] = 'left';
                    } else if (float === "right") {
                        data['alignment'] = 'right';
                    } else {
                        data['alignment'] = 'default';
                    }
                } else {
                    // margin-left: auto; margin-right: auto; display: block;
                    if (marginLeft === "auto" && marginRight === "auto" && display === "block") {
                        data['alignment'] = 'center';
                    } else {
                        data['alignment'] = 'default';
                    }
                }
            }
            const key =  createEntity(
                'IMAGE',
                'IMMUTABLE',
                data,
            )
            return key;
        }
    },
    htmlToBlock: (nodeName, node) => {
        if (nodeName === 'img') {
            return {
                type: 'atomic',
                data: {}
            }
        }
    },
    htmlToStyle: (nodeName, node, currentStyle) => {
        if (nodeName === 'img' && node.style) {
            const {position, cursor, float} = node.style;
            let curr = currentStyle;
            if (position) {
                curr = curr.add('POSITION-'+ position);
            }
            return curr;
        } else {
            return currentStyle;
        }
    },

})(html);

interface HeadlinesPickerProps extends DraftJsStyleButtonProps {
    overrideContentProps: OverrideContentProps
}
class HeadlinesPicker extends Component<HeadlinesPickerProps> {
    componentDidMount() {
        setTimeout(() => {
            window.addEventListener('click', this.onWindowClick);
        });
    }

    componentWillUnmount() {
        window.removeEventListener('click', this.onWindowClick);
    }

    onWindowClick = () =>
        // Call `onOverrideContent` again with `undefined`
        // so the toolbar can show its regular content again.
        this.props.overrideContentProps.onOverrideContent(undefined);

    render() {
        const buttons = [HeadlineOneButton, HeadlineTwoButton, HeadlineThreeButton, HeadlineFourButton];
        return (
            <div>
                {buttons.map((Button, i) => (
                    // eslint-disable-next-line
                    <Button key={i} {...this.props} />
                ))}
            </div>
        );
    }
}

class HeadlinesButton extends Component<ToolbarChildrenProps> {
    onClick = () =>
        // A button can call `onOverrideContent` to replace the content
        // of the toolbar. This can be useful for displaying sub
        // menus or requesting additional information from the user.
        this.props.onOverrideContent(p => {
            return <HeadlinesPicker {...this.props} overrideContentProps={p}/>});

    render() {
        const {theme} = this.props;
        return (
            <div className={!theme ? styles.headlineButtonWrapper: theme.buttonWrapper}>
                <button onClick={this.onClick} className={!theme ? styles.headlineButton: theme.button}>
                    H
                </button>
            </div>
        );
    }
}

const blockRenderMap = Immutable.Map({
    'pro-code-block': {
        // element is used during paste or html conversion to auto match your component;
        // it is also retained as part of this.props.children and not stripped out
        element: 'pre',
        wrapper: <pre />,
    }
});

// keep support for other draft default block types and add our myCustomBlock type
const extendedBlockRenderMap = Draft.DefaultDraftBlockRenderMap.merge(blockRenderMap);


const TestPage2: NextPage = () => {

    const [editorState, setEditorState] = useState<EditorState>(EditorState.createEmpty());
    const [editor, setEditor] = useState(false);
    const [text, setText] = useState(false);
    const {setLoading} = useLoading();
    const [styleMap, setStyleMap] = useState<DraftStyleMap>({...fontFamilyStyleMap, ...fontSizeStyleMap});
    const [textColors, setTextColors] = useState<string[]>([]);
    const [recentColors, setRecentColors] = useState<ColorResult[]>([]);
    const colorPickerRef: React.LegacyRef<HTMLDivElement> = useRef(null);
    const filledColorPickerRef: React.LegacyRef<HTMLDivElement> = useRef(null);
    const fontFamilyRef: LegacyRef<HTMLDivElement> = useRef(null);
    const onChange = (editorState: EditorState) => {
        setEditorState(editorState);
    };
    const editorRef = useRef<Editor | null>(null);
    const focus = (e: any): void => {
        if (editorRef.current) {
            if (colorPickerRef?.current) {
                const ele = colorPickerRef?.current as any;
                if (ele.contains(e.target)) {
                    return;
                }
            }
            if (filledColorPickerRef?.current) {
                const ele = filledColorPickerRef.current as any;
                if (ele.contains(e.target)) {
                    return;
                }

            }
            // if (fontFamilyRef?.current) {
            //     const ele = fontFamilyRef.current as any;
            //     if (ele.contains(e.target)) {
            //         return;
            //     }
            //
            // }
            editorRef.current.focus();
        }
    };
    const btnRef: React.LegacyRef<HTMLDivElement> = useRef(null);

    const addImageFromSrc = useCallback((width: any, src: any) => {
        const state = imagePlugin.addImage(editorState, src, {
            "width": width,
        });
        setEditor(false);
        setTimeout(() => {
            setEditorState(Object.assign(editorState, state));
            btnRef.current?.click();
            btnRef.current?.scrollIntoView();
        });
    },[editorState]);

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

    const textHtml = (string: string) => {
        let newString = string;
        newString = convertListItem(newString, "ol");
        newString = convertListItem(newString, "ul");
        newString = convertCodeBlock(newString);
        return newString;
    }

    const SeparatorComponent = (props: any) => <Separator {...props}/>;

    useEffect(() => {
        if (!editor) {
            // btnRef.current?.scrollIntoView();
            // btnRef.current?.click();

            setEditor(true);
        }
        // setEditorState(EditorState.createEmpty());'
        // addImage();
    },[editor, editorRef]);

    useEffect(() => {
        // setEditorState(EditorState.createWithContent(fromHtml(s)));
        // axios.get("/api/lyric/save").then(res => {
        //     if (res?.data) {
        //         setEditorState(EditorState.createWithContent(convertFromRaw(JSON.parse(res.data.data))));
        //     }
        // });
        // setEditorState(EditorState.createWithContent(convertFromRaw(JSON.parse(string))));
        // const str = `{"blocks":[{"key":"9jakp","text":"Hey! This is a good lyric!","type":"header-two","depth":0,"inlineStyleRanges":[{"offset":0,"length":26,"style":"FONT_SIZE_14"},{"offset":0,"length":26,"style":"FONT_SIZE_12"}],"entityRanges":[],"data":{}}],"entityMap":{}}`;
        // setEditorState(EditorState.createWithContent(convertFromRaw(JSON.parse(str))));
        // const str = ' {"blocks":[{"key":"6j9ch","text":"sssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssss","type":"unstyled","depth":0,"inlineStyleRanges":[{"offset":0,"length":113,"style":"FONT_SIZE_14"},{"offset":0,"length":113,"style":"#00d084"}],"entityRanges":[],"data":{}}],"entityMap":{}}';
         const str = `{"blocks":[{"key":"datmb","text":"Em từng là duy nhất\\nLà cả khoảng trời trong anh\\nNhưng đến bây giờ anh vẫn như vậy\\nChỉ là cần một khoảng trống","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}},{"key":"f23ih","text":"Yêu chậm lại một chút\\nĐể biết ta cần nhau hơn\\nAnh cũng rất sợ ta phải xa nhau\\nNhưng tình yêu không như lúc trước","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}},{"key":"2qgit","text":"Đừng để thời gian bên nhau là thói quen\\nLà ở cạnh bên nhưng rất xa xôi\\nTừng ngày cảm giác trong tim cứ thế phai đi\\nLạc nhau ta đâu có hay","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}},{"key":"7r9in","text":"Đừng để yêu thương kia giờ là nỗi đau\\nCô đơn về nơi căn phòng ấy\\nDành tất cả thanh xuân để thương một người\\nGiờ chỉ còn là giấc mơ","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}},{"key":"egs73","text":"Anh từng là thế giới\\nLà cả khoảng trời trong em\\nNhưng đến bây giờ lúc em cần\\nAnh như không quan tâm","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}},{"key":"9fqhe","text":"Chỉ cần dành một phút\\nĐể hỏi em về ngày hôm nay\\nSao đến bây giờ em phải mong chờ\\nMột điều giản đơn đến thế","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}},{"key":"eaq81","text":"Đừng để thời gian bên nhau là thói quen\\nLà ở cạnh bên nhưng rất xa xôi\\nTừng ngày cảm giác trong tim cứ thế phai đi\\nLạc nhau ta đâu có hay","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}},{"key":"cmto7","text":"Đừng để yêu thương kia giờ là nỗi đau\\nCô đơn về nơi căn phòng ấy\\nDành tất cả thanh xuân để thương một người\\nGiờ chỉ còn trong giấc mơ","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}},{"key":"ddkqd","text":"Nếu như một ngày có quay trở lại\\nLiệu vẫn còn đâu lời yêu lúc xưa\\nEm dành tất cả thanh xuân chỉ để yêu anh thôi\\nSao giờ chẳng thể nào chạm tới","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}},{"key":"99cpp","text":"Sao ta chẳng thể hiểu cho nhau\\nAnh vẫn mong bên em\\nChỉ là phút giây có khi mỏi mệt\\nBiết nỗi nhớ chẳng thể kéo ký ức quay về\\nNên tập quên dù biết sẽ đau","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}},{"key":"141e","text":"Đừng để thời gian bên nhau là thói quen\\nLà ở cạnh bên nhưng rất xa xôi\\nTừng ngày cảm giác trong tim cứ thế phai đi\\nLạc nhau ta đâu có hay\\nTa đâu có hay hah","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}},{"key":"7b2tv","text":"Đừng để yêu thương kia giờ là nỗi đau\\nCô đơn về nơi căn phòng ấy\\nDành tất cả thanh xuân để thương một người\\nGiờ chỉ còn là giấc mơ\\nCòn là giấc mơ","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}}],"entityMap":{}}`;
        setEditorState(EditorState.createWithContent(convertFromRaw(JSON.parse(str))));
    },[]);

    useEffect(() => {
        // console.log(JSON.stringify(convertToRaw(editorState.getCurrentContent())));
        // console.log("json: ",convertToRaw(editorState.getCurrentContent()));
        // console.log(editorState);
    },[editorState]);

    console.log("style", styleMap);

    useEffect(() => {
        setRecentColors(getRecentColorStorage());
       setTextColors(getColorStorage());
    },[]);
    return <LyricLayout>
        <div className={styles.wrapper}>

            <div onClick={focus} id = "aaa" className={styles.editor}>
                {editor && <Editor
                    editorKey={"editor"}
                    editorState={editorState}
                    customStyleMap={styleMap}
                    textAlignment={'left'}
                    onChange={onChange}
                    plugins={plugins}
                    ref={(element) => {
                        editorRef.current = element;
                    }}
                />}
                <InlineToolbar>
                    {
                        // may be use React.Fragment instead of div to improve perfomance after React 16
                        (externalProps) => (
                            <div>
                                <BoldButton {...externalProps} />
                                <ItalicButton {...externalProps} />
                                <UnderlineButton {...externalProps} />
                                <linkPlugin.LinkButton {...externalProps} />
                                <AlignTextLeftButton {...externalProps} />
                                <AlignTextCenterButton {...externalProps} />
                                <AlignTextRightButton {...externalProps} />
                                <InlineColorPickerButton
                                    {...externalProps}
                                    styleMap={styleMap}
                                    textColors={textColors}
                                    recentColors={recentColors}
                                    onAddRecentColor={list => setRecentColors(list)}
                                    onAddColor={hex => {
                                        const colors = Array.from(textColors);
                                        colors.push(hex);
                                        setTextColors(colors);
                                    }}
                                    onColorChange={hex => {
                                        return new Promise((res, _) => {
                                            if (!styleMap[hex]) {
                                                setStyleMap({
                                                    ...styleMap,
                                                    [`${hex}`]: {color: hex}
                                                });
                                            }

                                            res({
                                                color: hex,
                                                styleMap: styleMap
                                            });
                                        });
                                    }}
                                />
                                <InlineBackgroundPickerButton
                                    styleMap={styleMap}
                                    textColors={textColors}
                                    onAddColor={hex => {
                                        const colors = Array.from(textColors);
                                        colors.push(hex);
                                        setTextColors(colors);
                                    }}
                                    recentColors={recentColors}
                                    onAddRecentColor={list => setRecentColors(list)}
                                    onColorChange={hex => {
                                        return new Promise((res,_) => {
                                            if (!styleMap[`BACKGROUND_${hex}`])
                                                setStyleMap({...styleMap, [`BACKGROUND_${hex}`]: {background: hex}});
                                            res({
                                                color: hex,
                                                styleMap: styleMap
                                            });
                                        });
                                    }}
                                    {...externalProps}/>
                            </div>
                        )
                    }
                </InlineToolbar>
                <ProAlignmentTool />
                <EmojiSuggestions />
                <Toolbar>
                    {
                        // may be use React.Fragment instead of div to improve perfomance after React 16
                        (externalProps) => {
                            return (
                                <React.Fragment>
                                    <BoldButton {...externalProps} />
                                    <ItalicButton {...externalProps} />
                                    <UnderlineButton {...externalProps} />
                                    <ProCodeBlockButton {...externalProps}/>
                                    <SeparatorComponent {...externalProps} />
                                    <HeadlinesButton {...externalProps} />
                                    <UnorderedListButton {...externalProps} />
                                    <OrderedListButton {...externalProps} />
                                    <AlignTextLeftButton {...externalProps} />
                                    <AlignTextCenterButton {...externalProps} />
                                    <AlignTextRightButton {...externalProps} />
                                    <BlockquoteButton {...externalProps}/>
                                    <FontFamilySelect {...externalProps}/>
                                    <FontSizeSelect {...externalProps} onAfterSubmit={() => {
                                        setTimeout(() => {
                                            editorRef.current && editorRef.current.focus();
                                        });
                                    }} />
                                    <SeparatorComponent {...externalProps} />
                                    <AddImageButton {...externalProps} uploadImageFile={e => uploadFile(e, setLoading)} addImage={addImageFromSrc} />
                                    <AddVideoButton {...externalProps} addVideo={(src, width, height) => {
                                        const state = videoPlugin.addVideo(editorState, {src: src, width: width, height: height});
                                        setEditorState(Object.assign(editorState, state));
                                        setEditor(false);
                                        setTimeout(() => {
                                            btnRef.current?.click();
                                            btnRef.current?.scrollIntoView();
                                        });
                                    }}/>
                                    <SeparatorComponent {...externalProps} />
                                    <div className={styles.emoji}>
                                        <EmojiSelect />
                                    </div>
                                    <linkPlugin.LinkButton {...externalProps} />
                                    <ColorPickerButton
                                        styleMap={styleMap}
                                        textColors={textColors}
                                        onAddColor={hex => {
                                            const colors = Array.from(textColors);
                                            colors.push(hex);
                                            setTextColors(colors);
                                        }}
                                        recentColors={recentColors}
                                        onAddRecentColor={list => setRecentColors(list)}
                                        onColorChange={hex => {
                                            return new Promise((res,_) => {
                                                if (!styleMap[hex]) {
                                                    setStyleMap({...styleMap, [hex]: {color: hex}});
                                                }
                                                res({
                                                    color: hex,
                                                    styleMap: styleMap
                                                });
                                            });
                                        }}
                                        pickerRef={colorPickerRef} {...externalProps}/>
                                    <BackgroundPickerButton
                                        styleMap={styleMap}
                                        textColors={textColors}
                                        onAddColor={hex => {
                                            const colors = Array.from(textColors);
                                            colors.push(hex);
                                            setTextColors(colors);
                                        }}
                                        recentColors={recentColors}
                                        onAddRecentColor={list => setRecentColors(list)}
                                        onColorChange={hex => {
                                            return new Promise((res,_) => {
                                                if (!styleMap[`BACKGROUND_${hex}`])
                                                    setStyleMap({...styleMap, [`BACKGROUND_${hex}`]: {background: hex}});
                                                res({
                                                    color: hex,
                                                    styleMap: styleMap
                                                });
                                            });
                                        }}
                                        pickerRef={filledColorPickerRef} {...externalProps}/>
                                </React.Fragment>
                            );
                        }
                    }

                </Toolbar>
            </div>
        <div>
            {/*{toHtml}*/}
            <div className={styles.editor}>
                <div dangerouslySetInnerHTML={{__html: textHtml(toHtml)}}/>
            </div>
        </div>

        </div>
    </LyricLayout>
}


export default TestPage2;