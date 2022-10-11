import ProSelect from "../../core/ProSelect";
import {ProSelectItem} from "../../../types/general";


const FONTS: Array<ProSelectItem> = [
    // {
    //     id: 1,
    //     value: "Arial",
    //     label: "Arial"
    // },
    {
        id: 2,
        value: "ROBOTO",
        label: "Roboto"
    },
    {
        id: 3,
        value: "SOFIA",
        label: "Sofia"
    },
]

const FontTextEditor = (props: FontTextEditorProps) => {

    const {onFontChange} = props;

    return <ProSelect items={FONTS} onChange={onFontChange}/>
}

interface FontTextEditorProps {
    onFontChange: (font: string) => void;
}


export default FontTextEditor;