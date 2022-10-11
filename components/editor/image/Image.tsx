import React, {ImgHTMLAttributes, ReactElement, useMemo} from 'react';
import { ContentBlock, ContentState } from 'draft-js';
import clsx from 'clsx';
import { ImagePluginTheme } from '.';

export interface ImageProps extends ImgHTMLAttributes<HTMLImageElement> {
    block: ContentBlock;
    className?: string;
    theme?: ImagePluginTheme;
    contentState: ContentState;
    onClick?: () => void;

    //removed props
    blockStyleFn: unknown;
    blockProps: unknown;
    customStyleMap: unknown;
    customStyleFn: unknown;
    decorator: unknown;
    forceSelection: unknown;
    offsetKey: unknown;
    selection: unknown;
    tree: unknown;
    preventScroll: unknown;
}

export default React.forwardRef<HTMLImageElement, ImageProps>(
    // eslint-disable-next-line prefer-arrow-callback
    function Image(props, ref): ReactElement {
        const { block, className, theme = {}, onClick, ...otherProps } = props;


        // leveraging destructuring to omit certain properties from props
        const {
            blockProps, // eslint-disable-line @typescript-eslint/no-unused-vars
            customStyleMap, // eslint-disable-line @typescript-eslint/no-unused-vars
            customStyleFn, // eslint-disable-line @typescript-eslint/no-unused-vars
            decorator, // eslint-disable-line @typescript-eslint/no-unused-vars
            forceSelection, // eslint-disable-line @typescript-eslint/no-unused-vars
            offsetKey, // eslint-disable-line @typescript-eslint/no-unused-vars
            selection, // eslint-disable-line @typescript-eslint/no-unused-vars
            tree, // eslint-disable-line @typescript-eslint/no-unused-vars
            blockStyleFn, // eslint-disable-line @typescript-eslint/no-unused-vars
            preventScroll, // eslint-disable-line @typescript-eslint/no-unused-vars
            contentState,
            ...elementProps
        } = otherProps;
        // useMemo(() => {
        //     if (editPopup) {
        //         alert("OK");
        //     }
        // },[editPopup]);
        const combinedClassName = clsx(theme.image, className);
        const { src } = contentState.getEntity(block.getEntityAt(0)).getData();
        const finalElementProps = useMemo(() => {
            if (!elementProps || !elementProps.style || !elementProps.style.width) {
                return elementProps;
            }
            let props = elementProps;
            return props;
        },[elementProps]);
        return (
            <React.Fragment>
                <img
                    onClick={onClick}
                    {...finalElementProps}
                    ref={ref}
                    src={src}
                    role="presentation"
                    className={combinedClassName}
                />
                {/*{editPopup && <div>OKKK</div>}*/}
            </React.Fragment>
        );
    }
);