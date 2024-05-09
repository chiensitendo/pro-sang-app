export interface AdminFolderItem {
    id: number,
    count: number,
    storage_count: number,
    database_count: number,
    name: string,
    is_database_sync: boolean,
    is_storage_sync: boolean,
    created_date: string,
    updated_date: string,
}

export interface AdminResponse {
    folders: Array<AdminFolderItem>;
}

export interface JobResponse {
    count: number,
    jobs: Array<JobItem>
}

export enum JobType {
    SYNC_FOLDER_IMAGES = "SYNC_FOLDER_IMAGES",
    REFRESH_AWS_IMAGE_URL = "REFRESH_AWS_IMAGE_URL"
}

export enum JobStatus {
    INIT = 0,
    STARTED = 1,
    PROCESSING = 2,
    SUCCESS = 3,
    PENDING = 4,
    FAILED = 5,
    RESTART = 6
}

export interface JobItem {
   id: string,
   name: string,
   type: JobType,
   status: JobStatus,
   content: string,
   error: string,
   created_date: string,
   updated_date: string,
}