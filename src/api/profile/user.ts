import type { UserResponse } from "../../types/user";
import { apiClient } from "../client";


export const getUserMe = async (): Promise<UserResponse> => {
    const response = await apiClient.get<UserResponse>('/api/v1/users/me');

    return response.data;
}
    
    