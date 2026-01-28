import type { UserResponse } from "../../types/user";

export const getUserMe = async (): Promise<UserResponse> => {
    /*
    const response = await axiosInstance.get<UserResponse>('/api/v1/users/me');

    return response.data;
    */
    
    /**mocking */
    return new Promise((resolve) => {
        setTimeout(() => {
        resolve({
            isSuccess: true,
            code: "SUCCESS-200",
            message: "요청에 성공했습니다.",
            result: {
            id: 1,
            email: "test@example.com",
            name: "테스트",
            }
        });
        }, 300);
    });
};