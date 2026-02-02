import type { UserResponse } from "../../types/user";
import axiosInstance from "../axios";

export const getUserMe = async (): Promise<UserResponse> => {
    const response = await axiosInstance.get<UserResponse>('/v1/users/me');

    return response.data;
}
    
    