import {
    DraftJsStyleButtonProps,
    HeadlineOneButton,
    HeadlineThreeButton,
    HeadlineTwoButton
} from "@draft-js-plugins/buttons";
import {OverrideContentProps} from "@draft-js-plugins/anchor/lib/components/AddLinkForm";
import {Component} from "react";
import HeadlineFourButton from "./HeadlineFourButton";
import {ToolbarChildrenProps} from "@draft-js-plugins/inline-toolbar/lib/components/Toolbar";
import styles from "./HeadlinesButton.module.scss";
import * as React from "react";

interface HeadlinesPickerProps extends DraftJsStyleButtonProps {
    overrideContentProps: OverrideContentProps
}
class HeadlinesPicker extends Component<HeadlinesPickerProps> {
    componentDidMount() {
        setTimeout(() => {
            window.addEventListener('click', this.onWindowClick);
        });
    }

    componentWillUnmount() {
        window.removeEventListener('click', this.onWindowClick);
    }

    onWindowClick = () =>
        // Call `onOverrideContent` again with `undefined`
        // so the toolbar can show its regular content again.
        this.props.overrideContentProps.onOverrideContent(undefined);

    render() {
        const buttons = [HeadlineOneButton, HeadlineTwoButton, HeadlineThreeButton, HeadlineFourButton];
        return (
            <div>
                {buttons.map((Button, i) => (
                    // eslint-disable-next-line
                    <Button key={i} {...this.props} />
                ))}
            </div>
        );
    }
}

export class HeadlinesButton extends Component<ToolbarChildrenProps> {
    onClick = () =>
        // A button can call `onOverrideContent` to replace the content
        // of the toolbar. This can be useful for displaying sub
        // menus or requesting additional information from the user.
        this.props.onOverrideContent(p => {
            return <HeadlinesPicker {...this.props} overrideContentProps={p}/>});

    render() {
        const {theme} = this.props;
        return (
            <div className={!theme ? styles.headlineButtonWrapper: theme.buttonWrapper}>
                <button onClick={this.onClick} className={!theme ? styles.headlineButton: theme.button}>
                    H
                </button>
            </div>
        );
    }
}