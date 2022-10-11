import React, {useCallback, useEffect, useMemo, useRef, useState} from "react";
import '@draft-js-plugins/alignment/lib/plugin.css';
import '@draft-js-plugins/image/lib/plugin.css';
import '@draft-js-plugins/linkify/lib/plugin.css';
import '@draft-js-plugins/focus/lib/plugin.css';
import '@draft-js-plugins/anchor/lib/plugin.css';
import '@draft-js-plugins/inline-toolbar/lib/plugin.css';
import '@draft-js-plugins/static-toolbar/lib/plugin.css';
import '@draft-js-plugins/emoji/lib/plugin.css';
import '@draft-js-plugins/hashtag/lib/plugin.css';
import {UploadFile} from "antd/lib/upload/interface";
import {getDownloadURL, ref, uploadBytes} from "@firebase/storage";
import {fireBaseDatabase, fireBaseStorage, LYRIC_TEMP_PICTURE_BUCK} from "../../firebaseConfig";
import {addDoc, collection} from "@firebase/firestore";
import {useLoading} from "./useLoading";
import {exportFullPlugin, fontFamilyStyleMap, fontSizeStyleMap, ProFullPlugin} from "./TextEditorUtils";
import styles from "./TextEditor.module.scss";
import Editor from "@draft-js-plugins/editor";
import {
    AlignTextCenterButton,
    AlignTextLeftButton, AlignTextRightButton, BlockquoteButton,
    BoldButton,
    ItalicButton, OrderedListButton,
    UnderlineButton, UnorderedListButton
} from "@draft-js-plugins/buttons";
import InlineColorPickerButton from "../editor/buttons/components/InlineColorPickerButton";
import InlineBackgroundPickerButton from "../editor/buttons/components/InlineBackgroundPickerButton";
import ProCodeBlockButton from "../editor/buttons/components/ProCodeBlockButton";
import AddImageButton from "../editor/buttons/components/AddImageButton";
import AddVideoButton from "../editor/buttons/components/AddVideoButton";
import ColorPickerButton from "../editor/buttons/components/ColorPickerButton";
import BackgroundPickerButton from "../editor/buttons/components/BackgroundPickerButton";
import {Separator} from "@draft-js-plugins/static-toolbar";
import {HeadlinesButton} from "../editor/buttons/components/HeadlinesButton";
import {convertFromRaw, convertToRaw, DraftStyleMap, EditorState} from "draft-js";
import {ColorResult} from "react-color";
import {getColorStorage, getRecentColorStorage} from "../../services/storage-services";
import FontSizeSelect from "../editor/buttons/components/FontSizeSelect";
import FontFamilySelect from "../editor/buttons/components/FontFamilySelect";
import classNames from "classnames";
import {getAtomicCount, getCharCount, getImageCount, getLineCount, getVideoUrlCount} from "../editor/utils";


const uploadFile = async (e: UploadFile) => {
    const {name, originFileObj} = e;
    const file = originFileObj as File;
    const lyricStorage = ref(fireBaseStorage, LYRIC_TEMP_PICTURE_BUCK + name);
    const lyricTempDb = collection(fireBaseDatabase, "/lyrics/temp/files/");
    const {setLoading} = useLoading();
    setLoading(true);
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
        setLoading(false);
        return err;
    });

}


const SeparatorComponent = (props: any) => <Separator {...props}/>;

const TextEditor: React.FC<TextEditorProps> = (props: TextEditorProps)=> {
    const [pluginSetting, setPluginSetting] = useState<ProFullPlugin>(exportFullPlugin(uploadFile));
    const {plugins, InlineToolbar, Toolbar, ProAlignmentTool, LinkButton, EmojiSelect, EmojiSuggestions, addImage, addVideo} = pluginSetting;
    const {size, charLimit, lineLimit, minChar, customKey, disableImage, disableVideo, onTextChange, onNewCustomStyleMap, customStyleMap, initialValue} = props;
    const [editorState, setEditorState] = useState<EditorState | null>(null);
    const [editor, setEditor] = useState(false);
    const [styleMap, setStyleMap] = useState<DraftStyleMap>({...fontFamilyStyleMap, ...fontSizeStyleMap});
    const [textColors, setTextColors] = useState<string[]>([]);
    const [recentColors, setRecentColors] = useState<ColorResult[]>([]);
    const [count, setCount] = useState(0);
    const [line, setLine] = useState(0);
    const colorPickerRef: React.LegacyRef<HTMLDivElement> = useRef(null);
    const filledColorPickerRef: React.LegacyRef<HTMLDivElement> = useRef(null);

    useMemo(() => {
        if (customStyleMap) {
            setStyleMap({...styleMap, ...customStyleMap});
        }
    },[customStyleMap]);

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
            editorRef.current.focus();
        }
    };
    const btnRef: React.LegacyRef<HTMLDivElement> = useRef(null);

    const addImageFromSrc = useCallback((width: any, src: any) => {
        if (editorState) {
            const state = addImage(editorState, src, {
                "width": width,
            });
            setEditor(false);
            setTimeout(() => {
                setEditorState(Object.assign(editorState, state));
                btnRef.current?.click();
                btnRef.current?.scrollIntoView();
            });
        }
    },[editorState]);

    const handleAddTextColor = (color: string) => {
        const colors = Array.from(textColors);
        colors.push(color);
        setTextColors(colors)
    }

    const handleBackgroundColorChange = (color: string) => {
        return new Promise<{color: string, styleMap: DraftStyleMap}>((res,_) => {
            const styleKey = `BACKGROUND_${color}`;
            if (!styleMap[styleKey]) {
                (!onNewCustomStyleMap || !customStyleMap) && setStyleMap({...styleMap, [styleKey]: {background: color}});
                onNewCustomStyleMap && onNewCustomStyleMap({[styleKey]: {background: color}});
            }

            res({
                color: color,
                styleMap: styleMap
            });
        });
    }

    const handleColorChange = (color: string) => {
        return new Promise<{color: string, styleMap: DraftStyleMap}>((res,_) => {
            if (!styleMap[color]) {
                (!onNewCustomStyleMap || !customStyleMap) && setStyleMap({...styleMap, [color]: {color: color}});
                onNewCustomStyleMap && onNewCustomStyleMap({[color]: {color: color}});
            }
            res({
                color: color,
                styleMap: styleMap
            });
        });
    }

    const sizeClass = !size ? "": styles[`editor_${size}`];

    useEffect(() => {
        if (!editor) {
            setEditor(true);
        }
    },[editor, editorRef]);

    useEffect(() => {
        setRecentColors(getRecentColorStorage());
        setTextColors(getColorStorage());
    },[]);

    useEffect(() => {
        if (editorState) {
            const c = getCharCount(editorState);
            const l = getLineCount(editorState);
            let imageCount = getImageCount(editorState);
            const videoUrlCount = getVideoUrlCount(editorState);
            const total = getAtomicCount(editorState);
            if (total > (imageCount + videoUrlCount)) {
                imageCount += total - (imageCount + videoUrlCount);
            }
            onTextChange && onTextChange(JSON.stringify(convertToRaw(editorState.getCurrentContent())),
                c,
                l ? l : 0, imageCount, videoUrlCount);
            setCount(c);
            setLine(l ? l : 0);
        }
    },[editorState]);

    useEffect(() => {
        if (initialValue) {
            try {
                const json = JSON.parse(initialValue);
                if (json['blocks']) {
                    const blocks = json['blocks'] as any[];
                    if (blocks.length) {
                        blocks.forEach(block => {
                            if (block['inlineStyleRanges']) {
                                const inlineStyleRanges = block['inlineStyleRanges'] as Array<{offset: number, length: number, style: string}>;
                                if (inlineStyleRanges.length) {
                                    inlineStyleRanges.forEach(style => {
                                        if (style.style && !styleMap[style.style] && /^#([A-Fa-f0-9]{3}){1,2}$/.test(style.style)) {
                                            onNewCustomStyleMap && onNewCustomStyleMap({[style.style]: {color: style.style}});
                                        }
                                        if (style.style && !styleMap[style.style] && style.style.startsWith("BACKGROUND_")) {
                                            const color = style.style.replace("BACKGROUND_","");
                                            if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(color)) {
                                                onNewCustomStyleMap && onNewCustomStyleMap({[style.style]: {background: color}});
                                            }
                                        }
                                    });
                                }
                            }

                        });
                    }
                }
                setEditorState(EditorState.createWithContent(convertFromRaw(json)));
            } catch (e) {
                setEditorState(EditorState.createEmpty());
            }
        }
        if (initialValue === null) {
            setEditorState(EditorState.createEmpty());
        }
    },[initialValue]);

    return  <div onClick={focus} className={classNames(styles.editor, sizeClass)}>
        {pluginSetting && editor && editorState && <React.Fragment>
             <Editor
                editorKey={!customKey ? "editor": customKey}
                editorState={editorState}
                customStyleMap={styleMap}
                textAlignment={'left'}
                onChange={onChange}
                plugins={plugins}
                ref={(element) => {
                    editorRef.current = element;
                }}
            />
            <InlineToolbar>
                {
                    // may be use React.Fragment instead of div to improve perfomance after React 16
                    (externalProps) => (
                        <div>
                            <BoldButton {...externalProps} />
                            <ItalicButton {...externalProps} />
                            <UnderlineButton {...externalProps} />
                            <LinkButton {...externalProps} />
                            <AlignTextLeftButton {...externalProps} />
                            <AlignTextCenterButton {...externalProps} />
                            <AlignTextRightButton {...externalProps} />
                            <InlineColorPickerButton
                                {...externalProps}
                                styleMap={styleMap}
                                textColors={textColors}
                                recentColors={recentColors}
                                onAddRecentColor={list => setRecentColors(list)}
                                onAddColor={handleAddTextColor}
                                onColorChange={handleColorChange}
                            />
                            <InlineBackgroundPickerButton
                                styleMap={styleMap}
                                textColors={textColors}
                                onAddColor={handleAddTextColor}
                                recentColors={recentColors}
                                onAddRecentColor={list => setRecentColors(list)}
                                onColorChange={handleBackgroundColorChange}
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
                                <FontFamilySelect {...externalProps}/>
                                <FontSizeSelect {...externalProps} onAfterSubmit={() => {
                                    setTimeout(() => {
                                        editorRef.current && editorRef.current.focus();
                                    });
                                }} />
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
                                {!disableImage && !disableVideo && <SeparatorComponent {...externalProps} />}
                                {!disableImage &&  <AddImageButton {...externalProps} uploadImageFile={uploadFile} addImage={addImageFromSrc} />}
                                {!disableVideo && <AddVideoButton {...externalProps} addVideo={(src, width, height) => {
                                    const state = addVideo(editorState, {src: src, width: width, height: height});
                                    setEditorState(Object.assign(editorState, state));
                                    setEditor(false);
                                    setTimeout(() => {
                                        btnRef.current?.click();
                                        btnRef.current?.scrollIntoView();
                                    });
                                }}/>}
                                <SeparatorComponent {...externalProps} />
                                <div className={styles.emoji}>
                                    <EmojiSelect />
                                </div>
                                <LinkButton {...externalProps} />
                                <ColorPickerButton
                                    styleMap={styleMap}
                                    textColors={textColors}
                                    onAddColor={handleAddTextColor}
                                    recentColors={recentColors}
                                    onAddRecentColor={list => setRecentColors(list)}
                                    onColorChange={handleColorChange}
                                    pickerRef={colorPickerRef} {...externalProps}/>
                                <BackgroundPickerButton
                                    styleMap={styleMap}
                                    textColors={textColors}
                                    onAddColor={handleAddTextColor}
                                    recentColors={recentColors}
                                    onAddRecentColor={list => setRecentColors(list)}
                                    onColorChange={handleBackgroundColorChange}
                                    pickerRef={filledColorPickerRef} {...externalProps}/>
                            </React.Fragment>
                        );
                    }
                }

            </Toolbar>
        </React.Fragment>}
    </div>
}

interface TextEditorProps {
    children?: any;
    size?: "sm" | "md" | "lg";
    onTextChange?: (stateString: string, count?: number, line?: number, imageCount?: number, videoUrlCount?: number) => void;
    disableImage?: boolean;
    disableVideo?: boolean;
    charLimit?: number;
    minChar?: number;
    lineLimit?: number;
    customKey?: string;
    initialValue?: string | null;
    customStyleMap?: DraftStyleMap;
    onNewCustomStyleMap?: (styleMap: DraftStyleMap) => void;
}

export default TextEditor;