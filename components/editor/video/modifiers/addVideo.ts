import { AtomicBlockUtils, EditorState, RichUtils } from 'draft-js';

import * as types from '../constants';

export default function addVideo(
    editorState: EditorState,
    { src, width, height }: { src: string, width?: string, height?: string }
): EditorState {
    if (RichUtils.getCurrentBlockType(editorState) === types.ATOMIC) {
        return editorState;
    }
    const contentState = editorState.getCurrentContent();
    const contentStateWithEntity = contentState.createEntity(
        types.VIDEOTYPE,
        'IMMUTABLE',
        { src, width, height },
    );
    const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
    return AtomicBlockUtils.insertAtomicBlock(editorState, entityKey, 'pro-video');
}