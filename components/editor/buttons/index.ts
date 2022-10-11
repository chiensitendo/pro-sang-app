import {ButtonHTMLAttributes, ComponentType} from "react";


export interface DraftJsButtonTheme {
    // CSS classes to apply
    active?: string;
    button?: string;
    buttonWrapper?: string;
}

export interface DraftJsButtonProps {
    theme: DraftJsButtonTheme;
    buttonProps?: ButtonHTMLAttributes<HTMLButtonElement>;
}
export interface DraftJsBlockAlignmentButtonProps extends DraftJsButtonProps {
    alignment: string | null;
    setAlignment(val: { alignment: string }): void;
}
// export interface DraftJsStyleButtonProps extends DraftJsButtonProps {
//     setEditorState(editorState: EditorState): void;
//     getEditorState(): EditorState;
// }
export type DraftJsBlockAlignmentButtonType =
    ComponentType<DraftJsBlockAlignmentButtonProps>;

export interface DraftJsBlockAlignmentButtonProps2 extends DraftJsButtonProps {
    editPopup: boolean;
    setShowEditPopup: {
        func(val: { editPopup: boolean }): void,
        setVal: (val: boolean) => void;
    }
}

export type DraftJsBlockAlignmentButtonType2 =
    ComponentType<DraftJsBlockAlignmentButtonProps2>;