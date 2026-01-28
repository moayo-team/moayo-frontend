export interface UserResult {
    id: number;
    email: string;
    name: string;
}

export interface UserResponse {
    isSuccess: boolean;
    code: string;
    message: string;
    result: UserResult;
}