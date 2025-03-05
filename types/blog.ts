export interface ListResponse<T> {
    count: number,
    items: T[]
}

export interface CreateBlogRequest {
    title: string;
    content: string;
    banner: string;
    thumbnail: string;
    tags: string[];
    words?: number; // Optional, defaulting to 0
    characters?: number; // Optional, defaulting to 0
    category_id: number;
}

export interface BlogResponse {
    id: number;
    slug: string;
    title: string;
    content: string;
    banner: string;
    thumbnail: string;
    tags: string[];
    words?: number; // Optional, defaulting to 0
    characters?: number; // Optional, defaulting to 0
    user: BlogUserItem;
    blogCategory: BlogCategoryItem;
}

export interface BlogUserItem {
    id: number;
    fullName: string;
    email: string;
    avatar: string;
}

export interface BlogCategoryItem {
    id: number;
    name: string;
}