export interface LinkRequest {
    url: string;
    is_url: boolean;
    keywords?: string;
}

export interface LinkResponse extends LinkRequest {
    id: number;
}

export interface LinkListResponse {
    count: number,
    items: Array<LinkResponse>
}