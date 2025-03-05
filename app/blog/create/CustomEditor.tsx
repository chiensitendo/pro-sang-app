'use client' // only in App Router

import { CKEditor } from '@ckeditor/ckeditor5-react';
import {
    ClassicEditor, Bold, Essentials, Italic, Mention, Paragraph, Undo, Image, ImageResize,
    ImageStyle,
    ImageToolbar,
    ImageUpload,
    ImageCaption,
    Base64UploadAdapter,
    ImageInsert,
    List, CodeBlock, FindAndReplace,
    MediaEmbed,
    Heading,
    Highlight,
    Font,
    HorizontalLine,
    Indent,
    IndentBlock,
    SpecialCharacters,
    SpecialCharactersEssentials,
    Alignment,
    Link,
    Code,
    Strikethrough,
    Subscript,
    Superscript,
    BlockQuote,
    TodoList,
    WordCount,
    Table,
    TableToolbar,
    FileRepository
} from 'ckeditor5';

import 'ckeditor5/ckeditor5.css';
import React, { forwardRef, useEffect, useImperativeHandle , useState } from 'react';
import uploadImage from '../../../services/firebase/uploadImage';

// import 'ckeditor5-premium-features/ckeditor5-premium-features.css';

import deleteImage from '../../../services/firebase/deleteImage';
import createTempImageRecord from '../../../services/firebase/createTempImageRecord';
import deleteImageRecord from '../../../services/firebase/deleteImageRecord';
import { addTempImageKey } from '@/services/storage-services';


function SpecialCharactersEmoji( editor: any ) {
    editor.plugins.get( 'SpecialCharacters' ).addItems( 'Emoji', [
        { title: 'smiley face', character: '😊' },
        { title: 'rocket', character: '🚀' },
        { title: 'wind blowing face', character: '🌬️' },
        { title: 'floppy disk', character: '💾' },
        { title: 'heart', character: '❤️' }
    ], { label: 'Emoticons' } );
}

const CustomEditor= forwardRef(({onChange, editorData}: {onChange: (value: string, character: number, words: number) => void, editorData: string}, ref) => {

    const [temporaryImages, setTemporaryImages] = useState<string[]>([]);
    const [temporaryImageKeys, setTemporaryImageKeys] = useState<any[]>([]);
    const handleUploadImage = async (file: File) => {
        const imageUrl = await uploadImage(file);
        setTemporaryImages((prev) => [...prev, imageUrl]);
        return { default: imageUrl }
    };

    const handleDiscardChanges = async () => {
        // Cleanup: Delete all temporary images from Firebase
        await Promise.all(temporaryImages.map(deleteImage));
        await Promise.all(temporaryImageKeys.map(key => deleteImageRecord(key, "temp")));
        setTemporaryImages([]);
        setTemporaryImageKeys([]);
    };

    useImperativeHandle(ref, () => ({
        handleDiscardChanges,
      }));

    return (
        <div ref={ref as any}>
            <CKEditor
            editor={ClassicEditor}
            data={editorData}
            onChange={(event, editor) => {
                const wordCountPlugin = editor.plugins.get( 'WordCount' );
                onChange(editor.getData(), wordCountPlugin.characters, wordCountPlugin.words);
            }}
            onReady={(editor) => {
                // Customizing the editor to handle image uploads
                editor.plugins.get('FileRepository').createUploadAdapter = (loader: any) => {
                  return {
                    upload: () => {
                      return new Promise((resolve, reject) => {
                        loader.file.then((file: File) => {
                          handleUploadImage(file)
                            .then((imageUrl) => {
                                createTempImageRecord(imageUrl.default, "temp").then(res => {
                                setTemporaryImageKeys((prev) => [...prev, res.key]);
                                addTempImageKey(res.key);
                                resolve({default: res.default});
                              }).catch(reject);
                            })
                            .catch(reject);
                        });
                      });
                    },
                  };
                };
              }}
            config={{
                toolbar: {
                    items: [
                        'undo', 'redo',
                        '|',
                        'heading', 
                        '|',
                        'fontfamily', 'fontsize', 'fontColor', 'fontBackgroundColor',
                        '|',
                        'bold', 'italic', 'strikethrough', 'subscript', 'superscript', 'code',
                        '|',
                        'horizontalLine', 'link', 'insertImage', 'blockQuote', 'codeBlock', 'mediaEmbed', 'insertTable', 'specialCharacters',
                        '|',
                        'bulletedList', 'numberedList', 'todoList', 'outdent', 'indent', 'alignment',
                        'highlight:yellowMarker', 'highlight:greenMarker', 'highlight:pinkMarker',
                        'highlight:greenPen', 'highlight:redPen', 'removeHighlight',
                        '|', 'findAndReplace',
                    ],
                },
                plugins: [
                    Bold, Essentials, Italic, Mention, Paragraph, Undo, Image,
                    ImageCaption,
                    ImageResize,
                    ImageStyle,
                    ImageToolbar,
                    ImageUpload,
                    Base64UploadAdapter,
                    ImageInsert, List, CodeBlock, FindAndReplace,
                    MediaEmbed, Heading, Highlight, Font, HorizontalLine,
                    Indent, IndentBlock, SpecialCharacters, SpecialCharactersEssentials, SpecialCharactersEmoji,
                    Alignment,
                    Link, Code, Strikethrough, Subscript, Superscript, 
                    BlockQuote, TodoList,
                    WordCount,
                    Table, TableToolbar,
                    FileRepository
                ],
                image: {
                    resizeUnit: '%',
                    toolbar: [
                        'resizeImage',
                        'imageStyle:inline',
                        'imageStyle:wrapText',
                        'imageStyle:breakText',
                        '|',
                        'toggleImageCaption',
                        'imageTextAlternative',
                    ],
                    resizeOptions: [
                        {
                            name: 'resizeImage:original',
                            value: null,
                            label: 'Original'
                        },
                        {
                            name: 'resizeImage:custom',
                            label: 'Custom',
                            value: 'custom'
                        },
                        {
                            name: 'resizeImage:40',
                            value: '40',
                            label: '40%'
                        },
                        {
                            name: 'resizeImage:60',
                            value: '60',
                            label: '60%'
                        }
                    ],
                },
                table: {
                    defaultHeadings: { rows: 1, columns: 1 },
                    contentToolbar: [ 'tableColumn', 'tableRow', 'mergeTableCells' ]
                },
                list: {
                    properties: {
                        styles: true,
                        startIndex: true,
                        reversed: true
                    }
                },
                // licenseKey: '<YOUR_LICENSE_KEY>',
                mention: {
                    feeds: [
                        {
                            marker: '@',
                            feed: [ '@Barney', '@Lily', '@Marry Ann', '@Marshall', '@Robin', '@Ted' ],
                            minimumCharacters: 1
                        }
                    ]
                },
                codeBlock: {
                    languages: [
                        { language: 'plaintext', label: 'Plain text' }, // The default language.
                        { language: 'c', label: 'C' },
                        { language: 'cs', label: 'C#' },
                        { language: 'cpp', label: 'C++' },
                        { language: 'css', label: 'CSS' },
                        { language: 'diff', label: 'Diff' },
                        { language: 'html', label: 'HTML' },
                        { language: 'java', label: 'Java' },
                        { language: 'javascript', label: 'JavaScript' },
                        { language: 'php', label: 'PHP' },
                        { language: 'python', label: 'Python' },
                        { language: 'ruby', label: 'Ruby' },
                        { language: 'typescript', label: 'TypeScript' },
                        { language: 'xml', label: 'XML' }
                    ]
                },
                placeholder: "Type your content here!",
                ckfinder: {
                //     // Upload the images to the server using the CKFinder QuickUpload command
                //     // You have to change this address to your server that has the ckfinder php connector
                //     uploadUrl: 'https://example.com/ckfinder/core/connector/php/connector.php?command=QuickUpload&type=Images&responseType=json'
                }
            }}
        />
        </div>
    );
});

export default CustomEditor;