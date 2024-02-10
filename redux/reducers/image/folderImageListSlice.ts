import { DeleteImageRequest, ImageItem, ImageResponse, PublicImageRequest } from "@/types/folder"
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import { CustomMap } from "../type";

export interface FolderImageListAction {
    limit: number,
    offset: number,
    folderName?: string,
    folderId: number
}

interface FolderImageListState {
    count: number,
    images?: Array<ImageItem>,
    loading: boolean,
    limit: number,
    offset: number,
    prevLimit: number,
    prevOffset: number,
    folderName?: string,
    selectedImages: CustomMap;
    isOpenDeleteModal: boolean;
    isOpenUploadImageModal: boolean;
    shouldScrollToBottom: boolean;
    isFetched: "INIT" | "LOADING" | "COMPLETED";
}
const initialState: FolderImageListState = {
    count: 0,
    loading: false,
    limit: 20,
    offset: 0,
    prevOffset: 0,
    prevLimit: 20,
    selectedImages: new CustomMap(),
    isOpenDeleteModal: false,
    isOpenUploadImageModal: false,
    shouldScrollToBottom: false,
    isFetched: "INIT"
}

const folderImageListSlice = createSlice({
    name: 'image/folder/list',
    initialState: initialState,
    reducers: {
        fetchFolderImageList(state, action: PayloadAction<FolderImageListAction>) {
            state.images = undefined;
            state.count = 0;
            state.loading = true;
            state.folderName = action.payload.folderName;
            state.isFetched = "LOADING";
        },
        fetchFolderImageListSuccess(state, action) {
            const {count, images} = action.payload.data as ImageResponse;
            state.images = images;
            state.count = count;
            state.loading = false;
            state.isFetched = "COMPLETED";
        },
        fetchFolderImageListFailed(state) {
            state.images = undefined;
            state.count = 0;
            state.loading = false;
            state.folderName = undefined;
            state.isFetched = "COMPLETED";
        },
        fetchNextFolderImageList(state, action: PayloadAction<FolderImageListAction>) {
            state.prevOffset = state.offset;
            state.offset = action.payload.offset;
            state.loading = true;
        },
        fetchNextFolderImageListSuccess(state, action) {
            const {count, images} = action.payload.data as ImageResponse;
            if (!state.images) {
                state.images = images;
            } else {
                state.images = state.images.concat(images);
            }
            state.count = count;
            state.loading = false;
            state.shouldScrollToBottom = true;
        },
        fetchNextFolderImageListFailed(state) {
            state.loading = false;
            state.offset = state.prevOffset;
        },
        changeFolderImageListLimit(state, action: PayloadAction<FolderImageListAction>) {
            state.prevLimit = state.limit;
            state.limit = action.payload.limit;

            state.prevOffset = state.offset;
            state.offset = 0;
            state.loading = true;
        },
        changeFolderImageListLimitSuccess(state, action) {
            const {count, images} = action.payload.data as ImageResponse;
            state.images = images;
            state.count = count;
            state.loading = false;
            state.shouldScrollToBottom = true;
        },
        changeFolderImageListLimitFailed(state) {
            state.loading = false;
            state.limit = state.prevLimit;
            state.offset = state.prevOffset;
        },
        selectImageItem(state, action: PayloadAction<{item: ImageItem, checked: boolean}>) {
            const {item, checked} = action.payload;
            if (checked) {
                state.selectedImages.remove(item.id);
            } else {
                state.selectedImages.put(item.id, item);
            }
            return {...state, selectedImages: Object.assign(new CustomMap(), state.selectedImages)}
        },
        changePublicOfImages(state, action: PayloadAction<PublicImageRequest>) {
            state.loading = true;

        },
        changePublicOfImagesSuccess(state, action: PayloadAction<PublicImageRequest>) {
            state.loading = false;
            const arr: ImageItem[] = [];
            if (state.images) {
                state.images.forEach(i => {
                    if (state.selectedImages.has(i.id)) {
                        const newI: ImageItem = state.selectedImages.getValue(i.id);
                        if (newI) {
                            arr.push({...newI, is_public: action.payload.is_public});
                        } else {
                            arr.push(i); 
                        }
                    } else {
                        arr.push(i);
                    }
                })
            }
            state.images = Array.from(arr);
            state.selectedImages = new CustomMap();
        },
        changePublicOfImagesFailed(state) {
            state.loading = false;
        },
        changeAllPublicOfImages(state, action: PayloadAction<{folderId: number, request: PublicImageRequest}>) {
            state.loading = true;

        },
        changeAllPublicOfImagesSuccess(state, action: PayloadAction<PublicImageRequest>) {
            state.loading = false;
            const arr: ImageItem[] = [];
            if (state.images) {
                state.images.forEach(i => {
                    arr.push({...i, is_public: action.payload.is_public});
                })
            }
            state.images = Array.from(arr);
            state.selectedImages = new CustomMap();
        },
        changeAllPublicOfImagesFailed(state) {
            state.loading = false;
        },
        openDeleteModal(state, action: PayloadAction<{open: boolean}>) {
            state.isOpenDeleteModal = action.payload.open;
        },
        openUploadImageModal(state, action: PayloadAction<{open: boolean}>) {
            state.isOpenUploadImageModal = action.payload.open;
        },
        deleteImages(state, action: PayloadAction<DeleteImageRequest>) {
            state.loading = true;
        },
        deleteImagesSuccess(state, action: PayloadAction<DeleteImageRequest>) {
            state.loading = false;
            const arr: ImageItem[] = [];
            let count = 0;
            if (state.images) {
                state.images.forEach(i => {
                    if (state.selectedImages.has(i.id)) {
                        const newI: ImageItem = state.selectedImages.getValue(i.id);
                        if (!newI) {
                            arr.push(i); 
                        } else {
                            count++;
                        }
                    } else {
                        arr.push(i);
                    }
                })
            }
            state.count = state.count - count;
            state.images = Array.from(arr);
            state.selectedImages = new CustomMap();
            state.isOpenDeleteModal = false;
        },
        deleteImagesFailed(state) {
            state.loading = false;
            state.isOpenDeleteModal = false;
        },
        addImageInFolder(state, action: PayloadAction<ImageItem>) {
            const item = Object.assign({}, action.payload);
            const arr = state.images ?? [];
            // const hasIt = arr.findIndex(i => i.id == -1 && i.name === action.payload.name) >=0;
            // if (!hasIt) {
            //     item.id = state.count + 1;
            //     arr.push(item);
            //     state.count = state.count + 1;
            //     state.images = Array.from(arr);
            // }
            
        },
        refreshFolderImageList(state, action: PayloadAction<FolderImageListAction>) {
            state.loading = true;
            state.isOpenDeleteModal = false;
            state.isOpenUploadImageModal = false;
        },
        refreshFolderImageListSuccess(state, action) {
            const {count, images} = action.payload.data as ImageResponse;
            state.images = images;
            state.count = count;
            state.loading = false;
            state.limit = 20;
            state.offset = 0;
            state.prevLimit = 20;
            state.prevOffset = 0;
            state.selectedImages = new CustomMap();
        },
        refreshFolderImageListFailed(state) {
            state.loading = false;
        },
        stopScrollToBottom(state) {
            state.shouldScrollToBottom = false;
        }
    }
});

export const {fetchFolderImageList, fetchFolderImageListSuccess, fetchFolderImageListFailed,
    fetchNextFolderImageList, fetchNextFolderImageListSuccess, fetchNextFolderImageListFailed,
    changeFolderImageListLimit, changeFolderImageListLimitSuccess, changeFolderImageListLimitFailed, selectImageItem, changePublicOfImages, 
    changePublicOfImagesSuccess, changePublicOfImagesFailed, openDeleteModal, openUploadImageModal,
    deleteImages, deleteImagesFailed, deleteImagesSuccess, addImageInFolder, refreshFolderImageList, refreshFolderImageListSuccess, refreshFolderImageListFailed,
    changeAllPublicOfImages, changeAllPublicOfImagesSuccess, changeAllPublicOfImagesFailed, stopScrollToBottom} = folderImageListSlice.actions;

export default folderImageListSlice.reducer;