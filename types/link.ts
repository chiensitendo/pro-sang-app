export interface LinkRequest {
    url: string;
    is_url: boolean;
    keywords?: string;
    title?: string;
    description?: string;
    image?: string;
}

export interface LinkResponse extends LinkRequest {
    id: number;
}

export interface LinkListResponse {
    count: number,
    items: Array<LinkResponse>
}

export interface LinkPreviewData extends LinkRequest {
    is_edit: boolean;
    is_loading: boolean;
    is_new: boolean;
    is_url: boolean;
    id?: number;
  }