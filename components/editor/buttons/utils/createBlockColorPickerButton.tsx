/* eslint-disable react/no-children-prop */

import {ToolbarChildrenProps} from "@draft-js-plugins/inline-toolbar/lib/components/Toolbar";
import React, {ComponentType, LegacyRef, MouseEvent, ReactNode, useEffect, useRef, useState} from "react";
import {DraftJsStyleButtonProps} from "@draft-js-plugins/buttons";
import {ChromePicker, ColorResult, TwitterPicker} from "react-color";
import clsx from "clsx";
import styles from "../components/ColorPickerButton.module.scss";
import {DraftStyleMap, EditorState, Modifier, RichUtils} from "draft-js";
import {hexToColorResult} from "../../../../utils/color_convert";
import {Button, Modal} from "antd";
import {CloseOutlined, PlusOutlined, RedoOutlined} from "@ant-design/icons";
import {
    addColorStorage,
    addRecentColor,
    getColorStorage,
    getRecentColorStorage
} from "../../../../services/storage-services";
import {getCurrentInlineStyleOfSelection} from "../../utils";

const defaultColors = ['#FF6900', '#FCB900', '#7BDCB5', '#00D084', '#8ED1FC', '#0693E3',
    '#ABB8C3', '#EB144C', '#F78DA7', '#9900EF'];

const MAX_RECENTLY_COLORS = 5;

interface CreateBlockColorPickerButtonProps extends ToolbarChildrenProps {
    prefix: string;
    children: ReactNode;
}

type ColorPickerButtonProps = {
    pickerRef:  React.LegacyRef<HTMLDivElement>;
    styleMap: DraftStyleMap;
    textColors?: string[];
    onColorChange: (hex: string) => Promise<{color: string, styleMap: DraftStyleMap}>;
    onAddColor: (hex: string) => void;
    onAddRecentColor: (list: ColorResult[]) => void;
    recentColors?: ColorResult[];
}

declare type Props = ComponentType<DraftJsStyleButtonProps & ColorPickerButtonProps>;

export default function createBlockColorPickerButton({
                                                      children, prefix,
                                                  }: CreateBlockColorPickerButtonProps): Props {
    return function BlockColorPickerButton(props) {
        const [showColorPicker, setShowColorPicker] = useState<boolean>(false);
        const [color, setColor] = useState<ColorResult | undefined>();
        const [addColor, setAddColor] = useState<ColorResult>();
        const [isAddColor, setIsAddColor] = useState<boolean>(false);
        const [recentlyColors, setRecentlyColors] = useState<ColorResult[]>([]);
        const [colors, setColors] = useState(defaultColors);
        const {theme, buttonProps = {}} = props;
        const className = theme.button;
        const btnRef: LegacyRef<HTMLButtonElement> = useRef(null);
        const addRef: LegacyRef<HTMLDivElement> = useRef(null);
        const activate = (event: MouseEvent): void => {
            event.preventDefault();
            setShowColorPicker(!showColorPicker);
        };

        const preventBubblingUp = (event: MouseEvent): void => {
            event.preventDefault();
        };
        const handleSubmitColor = (params: {color: string, styleMap: DraftStyleMap}) => {
            const {color, styleMap} = params;
            setNewColor(props, styleMap, prefix + color);
            setShowColorPicker(false);
            setColor(undefined);
        }
        const setNewColor = (props: DraftJsStyleButtonProps & ColorPickerButtonProps, styleMap: DraftStyleMap, color: string) => {
            const {getEditorState, setEditorState} = props;
            const editorState = getEditorState();
            const selection = editorState.getSelection();
            const nextContentState = Object.keys(styleMap)
                .reduce((contentState, c) => {
                    if ((!prefix && (/^#([A-Fa-f0-9]{3}){1,2}$/.test(c))) || (prefix && c.startsWith(prefix))) {
                        return Modifier.removeInlineStyle(contentState, selection, c);
                    }
                    return contentState;
                }, editorState.getCurrentContent());
            let nextEditorState = EditorState.push(
                editorState,
                nextContentState,
                'change-inline-style'
            );
            const currentStyle = editorState.getCurrentInlineStyle();
            // Unset style override for current color.
            if (selection.isCollapsed()) {
                nextEditorState = currentStyle.reduce((state, color) => {
                    return RichUtils.toggleInlineStyle(state as any, color as any);
                }, nextEditorState);
            }
            // If the color is being toggled on, apply it.
            if (!currentStyle.has(color)) {
                nextEditorState = RichUtils.toggleInlineStyle(
                    nextEditorState,
                    color
                );
            }
            setEditorState(nextEditorState);
        }

        const handleAddColor = () => {
            if (addColor && (/^#([A-Fa-f0-9]{3}){1,2}$/.test(addColor.hex)) && !colors.includes(addColor.hex)) {
                props.onAddColor(addColor.hex);
                addColorStorage(addColor.hex);
            }
            setIsAddColor(false);
            setShowColorPicker(true);
        };

        const submitColor = (colorResult: ColorResult) => {
            setColor(colorResult);
            const rColors = Array.from(recentlyColors);
            if (!rColors.includes(colorResult)) {
                if (rColors.length < MAX_RECENTLY_COLORS) {
                    rColors.push(colorResult);
                } else {
                    rColors.push(colorResult);
                    rColors.shift();
                }
                props.onAddRecentColor(rColors);
                addRecentColor(rColors);
            }
            colorResult && props.onColorChange(colorResult.hex).then(handleSubmitColor);
        }

        useEffect(() => {
            if (showColorPicker) {
                const {getEditorState} = props;
                const editorState = getEditorState();
                const styleList = getCurrentInlineStyleOfSelection(editorState, prefix);
                let color = "";
                styleList.forEach(style => {
                   if (prefix === "" && (/^#([A-Fa-f0-9]{3}){1,2}$/.test(style))){
                       setColor(hexToColorResult(style));
                       color = style;
                   } else if (prefix !== "" && style.startsWith(prefix)) {
                       color = style.replace(prefix, "");
                       setColor(hexToColorResult(color));
                   }
                });
                const twitterPicker = document.getElementsByClassName("twitter-picker-tww");
                if (twitterPicker && twitterPicker.length === 1) {
                    const children = twitterPicker[0].children;
                    if (children && children.length === 3) {
                        const spanWrapper = children[2];
                        if (spanWrapper) {
                            spanWrapper.classList.toggle(styles.color_selection, true);
                            const span = spanWrapper.children;
                            if (span) {
                                for (let i = 0; i < span.length; i++) {
                                    const item = span[i];
                                    if (item.tagName === "SPAN" && item.children && item.children.length === 1 && item.children[0].hasAttribute("title")) {
                                        const com = item.children[0];
                                        if (color) {
                                            const title = item.children[0].getAttribute("title") as string;
                                            if (title && title.toLowerCase() === color.toLowerCase()) {
                                                com.classList.add("color-highlight-1");
                                            } else {
                                                if (com.classList.contains("color-highlight-1")) {
                                                    com.classList.toggle("color-highlight-1", false);
                                                }
                                            }
                                        }
                                    }
                                    if (item.tagName === "DIV" && item.getAttribute("hidden") !== undefined) {
                                        if (item.innerHTML === "#" || (item.children && item.children.length > 0)) {
                                            item.setAttribute("hidden", "");
                                        }
                                    }

                                }
                            }
                            if (recentlyColors.length > 0) {
                                const recentUsedColors = document.createElement("div");
                                recentUsedColors.style.padding = "6px 9px 0px 15px";
                                recentUsedColors.style.borderTop = "1px solid";
                                recentUsedColors.style.display = 'flex';
                                for(let i = 0; i < recentlyColors.length; i++) {
                                    const c = recentlyColors[i];
                                    const colorWrapper = document.createElement("span");
                                    const colorItem = document.createElement("div");
                                    colorItem.addEventListener("click", e => {
                                        submitColor(c);
                                    })
                                    colorItem.style.background = c.hex;
                                    colorItem.style.width = "30px";
                                    colorItem.style.height = "30px";
                                    colorItem.style.cursor = "pointer";
                                    colorItem.style.position = "relative";
                                    colorItem.style.outline = "none";
                                    colorItem.style.float = "left";
                                    colorItem.style.borderRadius = "4px";
                                    colorItem.style.margin = "0px 6px 6px 0px";
                                    colorItem.setAttribute("title", c.hex);
                                    colorItem.tabIndex = 0;
                                    colorWrapper.append(colorItem);
                                    recentUsedColors.append(colorWrapper);
                                }

                                twitterPicker[0].append(recentUsedColors);
                            }
                        }
                    }
                }
            }
        },[showColorPicker, props]);

        useEffect(() => {
            if (props) {
                const {getEditorState} = props;
                const editorState = getEditorState && getEditorState();
                if (editorState) {
                    const styleList = getCurrentInlineStyleOfSelection(editorState, prefix);
                    let color = "";
                    styleList.forEach(style => {
                        if (prefix === "" && (/^#([A-Fa-f0-9]{3}){1,2}$/.test(style))) {
                            setColor(hexToColorResult(style));
                            color = style;
                        } else if (prefix !== "" && style.startsWith(prefix)) {
                            color = style.replace(prefix, "");
                            setColor(hexToColorResult(color));
                        }
                    });
                    if (btnRef && btnRef.current) {
                        const fill = color ? color : '#ddd';
                        const icons = btnRef.current.getElementsByTagName("path");
                        if (icons && icons.length > 0) {
                            const icon = icons[0];
                            icon.style.fill = fill;
                        }
                    }
                }

            }
        },[props]);

        useEffect(() => {
            const listener = (e: any) => {
                const modalWrapper = document.getElementsByClassName('ant-modal-wrap');
                if (modalWrapper && modalWrapper.length > 0) {
                    if (addRef.current && !addRef.current.contains(e.target as any) && !modalWrapper[0].contains(e.target as any)) {
                        setShowColorPicker(false);
                    }
                } else {
                    if (addRef.current && !addRef.current.contains(e.target as any)) {
                        setShowColorPicker(false);
                    }
                }
            };
            window.addEventListener("mousedown", listener);
            return () => {
                window.removeEventListener("mousedown", listener);
            }
        },[]);

        useEffect(() => {
            // setColors(getColorStorage());
            setRecentlyColors(getRecentColorStorage());
        },[]);

        useEffect(() => {
            setColors(props.textColors ? props.textColors: []);
        },[props.textColors]);

        useEffect(() => {
            setRecentlyColors(props.recentColors ? props.recentColors: []);
        },[props.recentColors]);

        return (
            <React.Fragment>
                <div ref={addRef} className={clsx(theme.buttonWrapper, styles.wrapper)}>
                    <button
                        ref={btnRef}
                        children={children}
                        {...buttonProps}
                        className={className}
                        onClick={activate}
                        type="button"
                    />
                    {showColorPicker && <div ref={props.pickerRef} className={styles.picker} onMouseDown={preventBubblingUp}>
                        <TwitterPicker   color={color ? color.hsl: undefined}
                                         colors={colors}
                                         className={"twitter-picker-tww"}
                                         onChange={submitColor}/>
                        <div className={styles.color_buttons}>
                            <Button type="primary" icon={<PlusOutlined />} onClick={() => {
                                setIsAddColor(true);
                                setShowColorPicker(false);
                            }} >Add Color</Button>
                            <Button type="default" icon={<RedoOutlined />} onClick={() => {
                                const {getEditorState, setEditorState} = props;
                                const editorState = getEditorState();
                                const selection = editorState.getSelection();
                                const nextContentState = Object.keys(props.styleMap)
                                    .reduce((contentState, c) => {
                                        if ((!prefix && (/^#([A-Fa-f0-9]{3}){1,2}$/.test(c))) || (prefix && c.startsWith(prefix))) {
                                            return Modifier.removeInlineStyle(contentState, selection, c);
                                        }
                                        return contentState;
                                    }, editorState.getCurrentContent());
                                let nextEditorState = EditorState.push(
                                    editorState,
                                    nextContentState,
                                    'change-inline-style'
                                );
                                setEditorState(nextEditorState);
                                setShowColorPicker(false);
                            }} >Reset Color</Button>
                            <Button type="primary" onClick={() => setShowColorPicker(false)} danger icon={<CloseOutlined />} /></div>
                    </div>}
                    <Modal visible={isAddColor} className={styles.add_color_modal} onCancel={(e) => {
                        setIsAddColor(false);
                        setShowColorPicker(true);
                    }} onOk={handleAddColor}>
                        <div onClick={e => e.stopPropagation()} style={{borderBottom: `10px solid ${addColor}`}}>
                            <ChromePicker className={styles.chrome_picker} color={addColor?.rgb} onChange={e => setAddColor(e )} />
                        </div>
                    </Modal>
                </div>
            </React.Fragment>

        );
    };
}