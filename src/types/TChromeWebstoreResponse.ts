export enum UploadState {
    FAILURE = "FAILURE",
    IN_PROGRESS = "IN_PROGRESS",
    NOT_FOUND = "NOT_FOUND",
    SUCCESS = "SUCCESS"
}

type TChromeWebStoreErrorDetail = {
    error_code: string;
    error_detail: string
}

type TChromeWebStoreResponse = {
    id: string;
    itemError: Array<TChromeWebStoreErrorDetail>;
    kind: string;
    publicKey: string;
    uploadState: UploadState
}

export default TChromeWebStoreResponse