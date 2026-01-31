export interface UserResult {
    id: number;
    email: string;
    name: string;
    phoneNumber: string;
}

export interface UserResponse {
    isSuccess: boolean;
    code: string;
    message: string;
    result: UserResult;
}