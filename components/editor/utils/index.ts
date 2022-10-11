import {RichUtils, EditorState, EntityInstance, ContentBlock} from 'draft-js';
import {hexToColorResult} from "../../../utils/color_convert";
import punycode from 'punycode';

export type { Store } from './createStore';
export { createStore } from './createStore';
export type { StrategyCallback } from './findWithRegex';
export { findWithRegex } from './findWithRegex';

export interface DecodedOffset {
    blockKey: string;
    decoratorKey: number;
    leafKey: number;
}

export default {
    decodeOffsetKey(offsetKey: string): DecodedOffset {
        const [blockKey, decoratorKey, leafKey] = offsetKey.split('-');
        return {
            blockKey,
            decoratorKey: parseInt(decoratorKey, 10),
            leafKey: parseInt(leafKey, 10),
        };
    },

    createLinkAtSelection(editorState: EditorState, url: string): EditorState {
        const contentState = editorState
            .getCurrentContent()
            .createEntity('LINK', 'MUTABLE', { url });
        const entityKey = contentState.getLastCreatedEntityKey();
        const withLink = RichUtils.toggleLink(
            editorState,
            editorState.getSelection(),
            entityKey
        );
        return EditorState.forceSelection(withLink, editorState.getSelection());
    },

    removeLinkAtSelection(editorState: EditorState): EditorState {
        const selection = editorState.getSelection();
        return RichUtils.toggleLink(editorState, selection, null);
    },

    collapseToEnd(editorState: EditorState): EditorState {
        const selection = editorState.getSelection();

        return EditorState.forceSelection(
            editorState,
            selection.merge({
                anchorKey: selection.getEndKey(),
                focusKey: selection.getEndKey(),
                anchorOffset: selection.getEndOffset(),
                focusOffset: selection.getEndOffset(),
            })
        );
    },

    getCurrentEntityKey(editorState: EditorState): string {
        const selection = editorState.getSelection();
        const anchorKey = selection.getAnchorKey();
        const contentState = editorState.getCurrentContent();
        const anchorBlock = contentState.getBlockForKey(anchorKey);
        const offset = selection.getAnchorOffset();
        const index = selection.getIsBackward() ? offset - 1 : offset;
        return anchorBlock.getEntityAt(index);
    },

    getCurrentEntity(editorState: EditorState): EntityInstance | null {
        const contentState = editorState.getCurrentContent();
        const entityKey = this.getCurrentEntityKey(editorState);
        return entityKey ? contentState.getEntity(entityKey) : null;
    },

    hasEntity(editorState: EditorState, entityType: string): boolean {
        const entity = this.getCurrentEntity(editorState);
        return Boolean(entity && entity.getType() === entityType);
    },
};

/**
 * Function returns size at a offset.
 */
function getCurrentInlineStyle(editorState: EditorState, stylePrefix: string) {
    const styles = editorState.getCurrentInlineStyle().toList();
    const style = styles.filter(s => s !== undefined && s !== null && s.startsWith(stylePrefix.toLowerCase()));
    if (style && style.size > 0) {
        return style.get(0);
    }
    return undefined;
}

/**
 * Function returns collection of currently selected blocks.
 */
export function getSelectedBlocksMap(editorState: EditorState) {
    const selectionState = editorState.getSelection();
    const contentState = editorState.getCurrentContent();
    const startKey = selectionState.getStartKey();
    const endKey = selectionState.getEndKey();
    const blockMap = contentState.getBlockMap();
    return blockMap
        .toSeq()
        .skipUntil((_, k) => k === startKey)
        .takeUntil((_, k) => k === endKey)
        .concat([[endKey, blockMap.get(endKey)]]);
}


/**
 * Function returns collection of currently selected blocks.
 */
export function getSelectedBlocksList(editorState: EditorState) {
    return getSelectedBlocksMap(editorState).toList();
}


/**
 * Function returns size at a offset.
 */
function getStyleAtOffset(block: ContentBlock, stylePrefix: string, offset: number) {
    const styles = block.getInlineStyleAt(offset).toList();
    const style = styles.filter(s => s !== undefined && s !== null && s.startsWith(stylePrefix.toLowerCase()));
    if (style && style.size > 0) {
        return style.get(0);
    }
    return undefined;
}


export function getCurrentInlineStyleOfSelection(editorState: EditorState, prefix: string) {
    const styles: string[] = [];
    if (editorState) {
        const selectedBlocks = getSelectedBlocksList(editorState);
        const currentSelection = editorState.getSelection();
        const start = currentSelection.getStartOffset();
        const end = currentSelection.getEndOffset();
        if (selectedBlocks.size > 0) {
            for (let i = 0; i < selectedBlocks.size; i += 1) {
                let blockStart = i === 0 ? start : 0;
                let blockEnd =
                    i === selectedBlocks.size - 1
                        ? end
                        : selectedBlocks.get(i).getText().length;
                if (blockStart === blockEnd && blockStart === 0) {
                    blockStart = 1;
                    blockEnd = 2;
                } else if (blockStart === blockEnd) {
                    blockStart -= 1;
                }
                for (let j = blockStart; j < blockEnd; j += 1) {
                    const st = selectedBlocks.get(i).getInlineStyleAt(j).toList();
                    if (j === blockStart) {
                        st.forEach(s => {
                            if (s) {
                                styles.push(s);
                            }

                        });
                    } else {
                        st.forEach(s => {
                            if (s) {
                                if (!styles.includes(s)) {
                                    styles.push(s);
                                }
                            }
                        });
                    }
                }
            }
        }
    }
    return styles;
}

export const getCharCount = (editorState: EditorState): number => {
    const decodeUnicode = (str: string): number[] => punycode.ucs2.decode(str); // func to handle unicode characters
    const plainText = editorState.getCurrentContent().getPlainText('');
    const regex = /(?:\r\n|\r|\n)/g; // new line, carriage return, line feed
    const cleanString = plainText.replace(regex, '').trim(); // replace above characters w/ nothing
    return decodeUnicode(cleanString).length;
};

export const getLineCount = (editorState: EditorState): number | null => {
    const blockArray = editorState.getCurrentContent().getBlocksAsArray();
    return blockArray ? blockArray.length : null;
}

export const getImageCount = (editorState: EditorState): number => {
    if (!editorState || !editorState.getCurrentContent()) {
        return 0;
    }
    return  editorState.getCurrentContent().
            getBlockMap().filter(b => b?.getType() === "atomic" && b?.getText() === "pro-image").size;
}

export const getAtomicCount = (editorState: EditorState): number => {
    if (!editorState || !editorState.getCurrentContent()) {
        return 0;
    }
    return  editorState.getCurrentContent().
    getBlockMap().filter(b => b?.getType() === "atomic").size;
}



export const getVideoUrlCount = (editorState: EditorState): number => {
    if (!editorState || !editorState.getCurrentContent()) {
        return 0;
    }
    return  editorState.getCurrentContent().
    getBlockMap().filter(b => b?.getType() === "atomic" && b?.getText() === "pro-video").size;
}
