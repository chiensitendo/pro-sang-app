import { DraftJsButtonTheme } from '@draft-js-plugins/buttons';

//TODO: To be removed.
import { css } from '@linaria/core';

export interface ProAlignmentPluginTheme {
    buttonStyles: DraftJsButtonTheme;
    alignmentToolStyles: {
        alignmentTool: string;
    };
}
