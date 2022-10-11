import vi from "../lang/vi.json";
import enUs from "../lang/en-US.json";
const getTranslation = (field: string, defaultMessage: string, locale?: string,...attrs: any[]) => {
    let translation;
    switch (locale) {
        case "vi":
            // @ts-ignore
            translation = vi;
            break;
        default:
            // @ts-ignore
            translation = enUs;
    }
    const val = getDescendantProp(translation, field);
    if (!attrs || attrs.length == 0)
        return val ? val: defaultMessage;
    if (val) {
        let result = val;
        attrs.forEach((value, index) => {
            result = result.replace('$s' + index, value);
        });
        return result;
    } else {
        return defaultMessage;
    }
}

function getDescendantProp(obj: any, desc: any) {
    var arr = desc.split(".");
    while(arr.length && (obj = obj[arr.shift()]));
    return obj;
}


export default getTranslation;