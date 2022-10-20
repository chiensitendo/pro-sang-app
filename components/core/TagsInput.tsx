import { PlusOutlined } from '@ant-design/icons';
import type { InputRef } from 'antd';
import { Input, Tag, Tooltip } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import styles from "./TagsInput.module.scss";
import getTranslation from "../translations";
import {SPECIAL_CHARS_REGEX} from "../../pages/lyric/add";

const TagsInput: React.FC<TagsInputProps> = (props: TagsInputProps) => {
    const {name, onChange, max, maxLength, placeholder, initialValue, locale} = props;
    const [tags, setTags] = useState<string[]>( []);
    const [error, setError] = useState<string[]>([]);
    const [inputVisible, setInputVisible] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const [editInputIndex, setEditInputIndex] = useState(-1);
    const [editInputValue, setEditInputValue] = useState('');
    const inputRef = useRef<InputRef>(null);
    const editInputRef = useRef<InputRef>(null);

    useEffect(() => {
        if (initialValue && initialValue.length > 0) {
            setTags(initialValue);
        }
    },[initialValue]);

    useEffect(() => {
        if (inputVisible) {
            inputRef.current?.focus();
        }
    }, [inputVisible]);

    useEffect(() => {
        editInputRef.current?.focus();
    }, [inputValue]);

    const handleClose = (removedTag: string) => {
        const newTags = tags.filter(tag => tag !== removedTag);
        setTags(newTags);
    };

    const showInput = () => {
        setInputVisible(true);
    };

    const checkInput = (value: any): string[] => {
        const err = [];
        if (maxLength && value.length > maxLength) {
            const nameMaxLength = getTranslation("lyric.validation.nameMaxLength", `${name} couldn't contain more than ${maxLength} characters.`, locale, name, maxLength);
            err.push(nameMaxLength);
        }
        if (SPECIAL_CHARS_REGEX.test(value)) {
            const nameNotSpecialCharacter = getTranslation("lyric.validation.nameNotSpecialCharacter",
                `${name} cannot contain special characters.`, locale, name);
            err.push(nameNotSpecialCharacter);
        }

        return err;
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
        setError(checkInput(e.target.value));
    };

    const handleInputConfirm = (e: any) => {
        if (inputValue && tags.indexOf(inputValue) === -1) {
            const errors = checkInput(inputValue);
            setError(errors);
            if (errors.length > 0) {
                e.preventDefault();
                return;
            }
            setTags([...tags, inputValue]);
        }
        setError([]);
        setInputVisible(false);
        setInputValue('');
    };

    const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEditInputValue(e.target.value);
    };

    const handleEditInputConfirm = () => {
        const newTags = [...tags];
        newTags[editInputIndex] = editInputValue;
        setTags(newTags);
        setEditInputIndex(-1);
        setInputValue('');
    };

    useEffect(() => {
        onChange && onChange(tags);
    },[tags, onChange]);

    return (
        <>
            {tags.map((tag, index) => {
                if (editInputIndex === index) {
                    return (
                        <Input
                            status={error.length > 0 ? 'error': undefined}
                            ref={editInputRef}
                            key={tag}
                            size="small"
                            className={styles.tagInput}
                            value={editInputValue}
                            onChange={handleEditInputChange}
                            onBlur={handleEditInputConfirm}
                            onPressEnter={handleEditInputConfirm}
                        />
                    );
                }

                const isLongTag = tag.length > 20;

                const tagElem = (
                    <Tag
                        className={styles.editTag}
                        key={tag}
                        closable={true}
                        onClose={() => handleClose(tag)}
                    >
            <span
                onDoubleClick={e => {
                    setEditInputIndex(index);
                    setEditInputValue(tag);
                    e.preventDefault();
                }}
            >
              {isLongTag ? `${tag.slice(0, 20)}...` : tag}
            </span>
                    </Tag>
                );
                return isLongTag ? (
                    <Tooltip title={tag} key={tag}>
                        {tagElem}
                    </Tooltip>
                ) : (
                    tagElem
                );
            })}
            {inputVisible && (
                <React.Fragment>
                    <Input
                        ref={inputRef}
                        type="text"
                        size="small"
                        status={error.length > 0 ? 'error': undefined}
                        className={styles.tagInput}
                        value={inputValue}
                        onChange={handleInputChange}
                        onBlur={handleInputConfirm}
                        onPressEnter={handleInputConfirm}
                    />
                    { error.length > 0 && <div>
                        {error.map((e, i) => {
                            return <p key={i} className={"error_color"}>{e}</p>
                        })}
                    </div>}
                </React.Fragment>
            )}
            {!inputVisible && (
                <Tag hidden={tags.length === max} className={styles.siteTagPlus} onClick={showInput}>
                    <PlusOutlined /> {placeholder ? placeholder: ''}
                </Tag>
            )}
        </>
    );
};

interface TagsInputProps {
    children?: any;
    name: string;
    onChange?: (tags: string[]) => void;
    max?: number;
    maxLength?: number;
    placeholder?: string;
    initialValue?: string[];
    locale: string | undefined;
}

export default TagsInput;