import React, {useEffect, useMemo, useRef, useState} from "react";
import '@draft-js-plugins/alignment/lib/plugin.css';
import '@draft-js-plugins/image/lib/plugin.css';
import '@draft-js-plugins/linkify/lib/plugin.css';
import '@draft-js-plugins/focus/lib/plugin.css';
import '@draft-js-plugins/anchor/lib/plugin.css';
import '@draft-js-plugins/inline-toolbar/lib/plugin.css';
import '@draft-js-plugins/static-toolbar/lib/plugin.css';
import '@draft-js-plugins/emoji/lib/plugin.css';
import '@draft-js-plugins/hashtag/lib/plugin.css';
import '@draft-js-plugins/counter/lib/plugin.css';
import {exportPluginForChat, fontFamilyStyleMap} from "./TextEditorUtils";
import styles from "./ChatTextEditor.module.scss";
import Editor from "@draft-js-plugins/editor";
import {
     BlockquoteButton,
    BoldButton,
    ItalicButton,
    UnderlineButton,
} from "@draft-js-plugins/buttons";
import ProCodeBlockButton from "../editor/buttons/components/ProCodeBlockButton";
import {Separator} from "@draft-js-plugins/static-toolbar";
import {convertToRaw, DraftStyleMap, EditorState} from "draft-js";
import classNames from "classnames";
import {getCharCount, getLineCount} from "../editor/utils";
const pluginSetting = exportPluginForChat();
const {plugins, Toolbar, ProAlignmentTool, EmojiSelect, EmojiSuggestions} = pluginSetting;
const SeparatorComponent = (props: any) => <Separator {...props}/>;

const ChatTextEditor: React.FC<ChatTextEditorProps> = ((props) => {
    const {onTextChange, isClear, onAfterClear, height, charLimit, lineLimit, minChar} = props;
    const [editorState, setEditorState] = useState<EditorState>(EditorState.createEmpty());
    const [editor, setEditor] = useState(false);
    const [count, setCount] = useState(0);
    const [line, setLine] = useState(0);
    const styleMap = useState<DraftStyleMap>({...fontFamilyStyleMap});
    const onChange = (editorState: EditorState) => {
        setEditorState(editorState);
    };
    const editorRef = useRef<Editor | null>(null);
    const focus = (e: any): void => {
        if (editorRef.current) {
            editorRef.current.focus();
        }
    };

    useMemo(() => {
        if (onAfterClear && isClear) {
            setEditorState(EditorState.createEmpty());
            onAfterClear();
        }
    },[isClear, onAfterClear]);
    useEffect(() => {
        if (!editor) {
            setEditor(true);
        }
    },[editor, editorRef]);

    useEffect(() => {
        if (editorState) {
            const c = getCharCount(editorState);
            const l = getLineCount(editorState);
            onTextChange && onTextChange(JSON.stringify(convertToRaw(editorState.getCurrentContent())), c, l ? l : 0);
            setCount(c);
            setLine(l ? l : 0);
        }
    },[editorState]);


    return <div onClick={focus} className={classNames(styles.editor,styles[`editor-${!height ? "large": height}`])}>
        {editor && <Editor
            editorKey={"editor"}
            editorState={editorState}
            textAlignment={'left'}
            onChange={onChange}
            plugins={plugins}
            ref={(element) => {
                editorRef.current = element;
            }}
        />}
        <ProAlignmentTool />
        <EmojiSuggestions />
        {charLimit && count > charLimit && <p className={"error_color text_font_12"}>Reach maximum characters: {`>`} {charLimit}</p>}
        {minChar && count > 0 && count < minChar && <p className={"error_color text_font_12"}>Please write more! (at least: {minChar})</p>}
        {lineLimit && line > lineLimit && <p className={"error_color text_font_12"}>Reach maximum lines: {`>`} {lineLimit}</p>}
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
                            <BlockquoteButton {...externalProps}/>
                            <div className={styles.emoji}>
                                <EmojiSelect />
                            </div>
                        </React.Fragment>
                    );
                }
            }

        </Toolbar>
    </div>
});


interface ChatTextEditorProps {
    children?: any;
    onTextChange?: (stateString: string, count?: number, line?: number) => void;
    isClear?: boolean;
    onAfterClear?: () => void;
    charLimit?: number;
    minChar?: number;
    lineLimit?: number;
    height?: "large" | "medium" | "small"
}

export default ChatTextEditor;