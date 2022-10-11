import React from 'react';
import dynamic from "next/dynamic";
import 'suneditor/dist/css/suneditor.min.css';
import {SunEditorReactProps} from "suneditor-react/dist/types/SunEditorReactProps";
import SetOptions from "suneditor-react/src/types/SetOptions";


const SunEditor = dynamic<SunEditorReactProps>(() => import("suneditor-react"), {
    ssr: false,
});

const options: SetOptions = {buttonList: [
        ["undo", "redo"],
        ["font", "fontSize", 'formatBlock'],
        ['paragraphStyle', 'blockquote'],
        [
            "bold",
            "underline",
            "italic",
            "strike",
            "subscript",
            "superscript"
        ],
        ["fontColor", "hiliteColor", 'textStyle'],
        ["align", "list", "lineHeight"],
        ["outdent", "indent"],
        ['table', 'horizontalRule', 'image', 'video', 'audio', 'link'],
        ["preview", "print", "removeFormat", 'fullScreen'],
        ['%480', [
            ["font", "fontSize", 'formatBlock', 'paragraphStyle', 'blockquote'],
            [
                "bold",
                "underline",
                "italic",
                "strike",
                "subscript",
                "superscript"
            ],
            ["fontColor", "hiliteColor", 'textStyle'],
            ["align", "list", "lineHeight", "outdent", "indent", 'fullScreen', 'table', 'horizontalRule'],
            ['image', 'video', 'audio', 'link'],
            ["preview", "print", "removeFormat", "undo", "redo"],
        ]]
    ],
    showPathLabel: false,
    mode: 'classic',
    minHeight: '500px'
};

const SunEditorProvider = (props: SunEditorProviderProps) => {

    const {onChange} = props;

    return <SunEditor setOptions={options} onChange = {onChange}/>
}

interface SunEditorProviderProps {
    onChange?: (content: string) => void
}

export default SunEditorProvider;