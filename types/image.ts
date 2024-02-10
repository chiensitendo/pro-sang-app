import { ImageItem } from "./folder"

export enum Service {
    SYSTEM = "SYSTEM",
    AWS = "AWS"
}

export const getImageUrl = (i: ImageItem) => {
    if (!i.content_type) {
        return i.path;
    }
    if (i.service === Service.AWS && i.generated_link) {
        return i.generated_link;
    }
    return "/public/" + i.path;
}