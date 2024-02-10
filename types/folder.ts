import { Service } from "./image";

export interface FolderItem {
    id: number,
    image_count: number,
    name: string,
    is_sync: boolean,
    created_date: string,
    updated_date: string,
    description: string
}


export interface FolderResponse {
    count: number,
    folders: Array<FolderItem>
}

export interface ImageItem {
    id: number,
    folder_id: number,
    content_type: string,
    name: string,
    path: string,
    is_public: boolean,
    generate_expired_time?: string,
    generated_link?: string,
    service: Service
}

export interface ImageResponse {
    count: number,
    images: Array<ImageItem>,
}

export interface FolderRequest {
    folder_name: string;
    description: string;
}


export interface UpdateFolderRequest {
    description: string
}

export interface PublicImageRequest {
    is_public: boolean,
    images: number[]
}

export interface DeleteImageRequest {
    images: number[]
}