import {ColorResult, HSLColor, RGBColor} from "react-color";
import tinycolor from "tinycolor2";

export function hexToRgbA(hex: string): RGBColor {
    if(/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)){
        let arr= hex.substring(1).split('');
        if(arr.length== 3){
            arr= [arr[0], arr[0], arr[1], arr[1], arr[2], arr[2]];
        }
        let c: any= '0x'+arr.join('');
        return {
            a: 1,
            r: (c>>16)&255,
            g: (c>>8)&255,
            b: c&255
        }
    }
    throw new Error('Bad Hex');
}

export function hexToColorResult(hex: string): any {
    const color = tinycolor(hex);

    return {
        hex: hex,
        hsv: color.toHsv(),
        hsl: color.toHsl(),
        rgb: hexToRgbA(hex),
        oldHue: color.toHsl().h,
        source: "hsv"
    }
}