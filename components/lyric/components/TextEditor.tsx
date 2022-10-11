import {useEffect, useRef, useState} from "react";
import dynamic from 'next/dynamic';
// const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
import Draft, {convertToRaw, EditorState, RichUtils, SelectionState} from "draft-js";
import "draft-js/dist/Draft.css";
import classNames from "classnames";
import FontTextEditor from "./FontTextEditor";
import FontDropdown from "./FontDropdown";

// import { Editor } from "react-draft-wysiwyg";
const Editor = dynamic<EditorProps>(
    () => import('react-draft-wysiwyg').then(mod => mod.Editor),
    { ssr: false }
);
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import {EditorProps} from "react-draft-wysiwyg";


const styleMap = {
    SOFIA: {
        fontFamily: '"Sofia", sans-serif'
    },
    ROBOTO: {
        fontFamily: '"Roboto", sans-serif'
    }
};

const TextEditor = (props: TextEditProps) => {
    const {className, width} = props;
    const [editorState, setEditorState] = useState(() =>
        EditorState.createEmpty()
    );
    const editor = useRef(null);

    const handleOnFontChange = (font: string) => {
        console.log(font);
        setEditorState(RichUtils.toggleInlineStyle(editorState, font));
    }
    // useEffect(() => {
    //     editor && editor.current && (editor.current as any).focus();
    // },[]);

    const onEditorStateChange = (editorState: any) => {
        setEditorState(editorState);
    };

    return <div className={classNames(className)} style={{width: width ? width: '100%'}}>
        <Editor
            editorState={editorState}
            onEditorStateChange={onEditorStateChange}
            placeholder={"Write something!"}
        />
    </div>
};

interface TextEditProps {
    children?: any;
    className?: string;
    width?: number | string;
}

export default TextEditor;