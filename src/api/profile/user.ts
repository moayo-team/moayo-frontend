import type { UserResponse } from "../../types/user";
import axiosInstance from "../axios";

export const getUserMe = async (): Promise<UserResponse> => {
    const response = await axiosInstance.get<UserResponse>('/users/me');

    return response.data;
}
    
    