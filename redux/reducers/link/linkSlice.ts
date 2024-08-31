import { LinkListResponse, LinkPreviewData, LinkRequest, LinkResponse } from "@/types/link";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";

interface CreateLinkState {
    response?: LinkResponse,
    error?: string
}

export interface LinkListAction {
    limit: number,
    offset: number
}

interface LinkState {
    loading: boolean,
    create?: CreateLinkState,
    error?: string;
    items: LinkResponse[];
    count: number,
    limit: number,
    offset: number,
    prevLimit: number,
    prevOffset: number,
    shownItems: LinkPreviewData[]
}
const initialState: LinkState = {
    loading: false,
    items: [],
    count: 0,
    limit: 50,
    offset: 0,
    prevOffset: 0,
    prevLimit: 50,
    shownItems: []
}

const linkSlice = createSlice({
    name: 'link',
    initialState: initialState,
    reducers: {
        createLinkAction(state, _: PayloadAction<LinkRequest>) {
            state.loading = true;
            state.error = undefined;
        },
        createLinkActionSuccess(state, action) {
            state.loading = false;
            const res = action.payload.data as LinkResponse;
            state.items.unshift(res);
            state.shownItems[0] = {
                title: res.title,
                description: res.description,
                image: res.image,
                url: res.url,
                is_edit: false,
                is_loading: false,
                is_new: false,
                is_url: res.is_url,
                id: res.id
            }
            state.count = state.count+1;
            
        },
        createLinkActionFailed(state, action: PayloadAction<string>) {
            state.loading = false;
            if (action.payload) {
                state.error = action.payload;
            }
            state.shownItems[0].is_loading = false;
        },
        addNewItem(state) {
            state.shownItems.unshift({
                title: "",
                description: "",
                image: "",
                url: "",
                is_edit: true,
                is_loading: false,
                is_new: true,
                is_url: false
              })
        },
        cancelLinkAction(state,  action: PayloadAction<number>) {
            if (state.shownItems[action.payload].is_new) {
                return {
                    ...state,
                    shownItems: state.shownItems.filter((_, index) => index !== action.payload)
                }
            }
            else {
                state.shownItems[action.payload] = {...state.shownItems[action.payload], is_edit: false};
            }
                
        },
        editLinkAction(state,  action: PayloadAction<number>) {
            state.shownItems[action.payload] = {...state.shownItems[action.payload], is_edit: true};
        },
        clearCreateFolderError(state) {
            if (state.error) {
                state.error = undefined;
            }
        },
        clearCreateLinkResponse(state) {
            state.loading = false;
            state.error = undefined;
        },
        fetchLinkList(state, action: PayloadAction<LinkListAction>) {
            state.items = [];
            state.count = 0;
            state.loading = true;
        },
        fetchLinkListSuccess(state, action) {
            const {count, items} = action.payload.data as LinkListResponse;
            state.items = items;
            state.count = count;
            state.loading = false;
            state.shownItems = items.map(item => ({
                title: item.title,
                description: item.description,
                image: item.image,
                url: item.url,
                is_edit: false,
                is_loading: false,
                is_new: false,
                is_url: item.is_url,
                id: item.id
            }));
        },
        fetchLinkListFailed(state) {
            state.items = [];
            state.count = 0;
            state.shownItems = [];
            state.loading = false;
        },
        fetchNextLinkList(state, action: PayloadAction<LinkListAction>) {
            state.prevOffset = state.offset;
            state.offset = action.payload.offset;
            state.loading = true;
        },
        fetchNextLinkListSuccess(state, action) {
            const {count, items} = action.payload.data as LinkListResponse;
            if (!state.items) {
                state.items = items;
                state.shownItems = state.items.map(item => ({
                    title: item.title,
                    description: item.description,
                    image: item.image,
                    url: item.url,
                    is_edit: false,
                    is_loading: false,
                    is_new: false,
                    is_url: item.is_url,
                    id: item.id
                }));
            } else {
                state.items = state.items.concat(items);
                state.shownItems = state.shownItems.concat(items.map(item => ({
                    title: item.title,
                    description: item.description,
                    image: item.image,
                    url: item.url,
                    is_edit: false,
                    is_loading: false,
                    is_new: false,
                    is_url: item.is_url,
                    id: item.id
                })));
            }
            state.count = count;
            state.loading = false;
            
        },
        fetchNextLinkListFailed(state) {
            state.loading = false;
            state.offset = state.prevOffset;
        },
        updateLinkAction(state, _: PayloadAction<{id: number, request: LinkRequest}>) {
            state.loading = true;
            state.error = undefined;
        },
        updateLinkActionSuccess(state, action) {
            state.loading = false;
            const {id, is_url, url, image, description, title} = action.payload.data as LinkResponse;
            const index = state.items.findIndex(item => item.id === id);
            if (index !== -1) {
                state.items[index] = action.payload.data as LinkResponse;
            }
            const shownIndex = state.shownItems.findIndex(item => item.id === id);
            if (shownIndex !== -1) {
                state.shownItems[shownIndex] = {
                    ...state.shownItems[shownIndex],
                    url: url,
                    is_edit: false,
                    is_url: is_url,
                    is_loading: false,
                    image,
                    description,
                    title
                };
            }
            
        },
        updateLinkActionFailed(state, action: PayloadAction<{error: string, id: number}>) {
            state.loading = false;
            if (action.payload) {
                state.error = action.payload.error;
            }
            const shownIndex = state.shownItems.findIndex(item => item.id === action.payload.id);
            if (shownIndex !== -1) {
                state.shownItems[shownIndex].is_loading = false;
            }
        },
        deleteLinkAction(state, _: PayloadAction<number>) {
            state.loading = true;
            state.error = undefined;
        },
        deleteLinkActionSuccess(state, action) {
            state.loading = false;
            const {id} = action.payload.data as LinkResponse;
            const index = state.items.findIndex(item => item.id === id);
            if (index !== -1) {
                state.items = state.items.filter((_, ind) => ind !== index);
            }
            const shownIndex = state.shownItems.findIndex(item => item.id === id);
            if (shownIndex !== -1) {
                state.shownItems = state.shownItems.filter((_, ind) => ind !== index);
            }
            state.count = state.count-1;
            
        },
        deleteLinkActionFailed(state, action: PayloadAction<string>) {
            state.loading = false;
            if (action.payload) {
                state.error = action.payload;
            }
        },
    }
});

export const {createLinkAction, createLinkActionSuccess, createLinkActionFailed, 
    clearCreateFolderError, clearCreateLinkResponse,
    fetchLinkList, fetchLinkListSuccess, fetchLinkListFailed,
    fetchNextLinkList,fetchNextLinkListSuccess,fetchNextLinkListFailed,
    updateLinkAction, updateLinkActionSuccess, updateLinkActionFailed,
    addNewItem, cancelLinkAction, editLinkAction,
    deleteLinkAction, deleteLinkActionSuccess, deleteLinkActionFailed} = linkSlice.actions;

export default linkSlice.reducer;