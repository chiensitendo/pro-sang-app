import {ColorResult} from "react-color";

const PREFIX = "PRO_SANG_STORAGE_";

const COLOR_KEY = PREFIX + "COLORS";

const RECENT_COLOR_KEY = PREFIX + "RECENT_COLORS";

const defaultColors = ['#FF6900', '#FCB900', '#7BDCB5', '#00D084', '#8ED1FC', '#0693E3',
    '#ABB8C3', '#EB144C', '#F78DA7', '#9900EF'];

export const getColors = () => {
    let colorsContent = localStorage.getItem(COLOR_KEY);
    let colors = [];
    if (colorsContent) {
        colors = JSON.parse(colorsContent);
    }
    return colors;
}

export const addColorStorage = (color: string) => {
    const colors = getColors();
    colors.push(color);
    localStorage.setItem(COLOR_KEY, JSON.stringify(colors));
}

export const getColorStorage = (): string[] => {
    let colorsContent = localStorage.getItem(COLOR_KEY);
    if (!colorsContent) {
        localStorage.setItem(COLOR_KEY, JSON.stringify(defaultColors));
        return defaultColors;
    } else {
        return JSON.parse(colorsContent) as string[];
    }
}

export const addRecentColor = (colors: ColorResult[]) => {
    localStorage.setItem(RECENT_COLOR_KEY, JSON.stringify(colors));
}
export const getRecentColorStorage = (): ColorResult[] => {
    let colorsContent = localStorage.getItem(RECENT_COLOR_KEY);
    if (!colorsContent) {
        return [];
    } else {
        return JSON.parse(colorsContent) as ColorResult[];
    }
}

