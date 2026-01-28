import { type CreateProfileRequest, type ProfileCreateResponse, type ProfileResponse, type UpdateProfileRequest, type UpdateProfileResponse } from "../types/profile";
import axiosInstance from "./axios";

/**프로필 생성 */
export const createProfile = async (profileData: CreateProfileRequest): Promise<ProfileCreateResponse> => {
    /*
    const response = await axiosInstance.post<ProfileCreateResponse>('/api/v1/profiles', profileData);
    return response.data;
    */

    /**mocking */
    console.log("⚠️ [TEST] 프로필 생성 요청을 보냅니다:", profileData);

    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                isSuccess: true,
                code: "SUCCESS-200",
                message: "프로필 생성에 성공했습니다.",
                result: {
                    id: Math.floor(Math.random() * 100) // 가짜 생성 ID
                }
            });
        }, 800); // 0.8초 후 응답
    });
}

/**프로필 조회 */
export const getProfile = async (): Promise<ProfileResponse> => {
    /*// 요청 보내기
    const response = await axiosInstance.get<ProfileResponse>('/api/v1/profiles/me');

    return response.data;*/

    /**mocking */
    console.log("⚠️ [TEST] 가짜 프로필 데이터를 불러옵니다.");


    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                isSuccess: true,
                code: "SUCCESS-200",
                message: "요청에 성공했습니다.",
                result: {
                    id: 10,
                    userId: 1,
                    imageUrl: "",
                    bio: "가짜 데이터로 코딩 중입니다!",
                    university: "모아요대학교",
                    major: "컴퓨터학과"
                }
            });
        }, 500); 
    });

}

/**프로필 수정 */
export const updateProfile = async (profileData: UpdateProfileRequest): Promise<UpdateProfileResponse> => {
    /*const reponse = await axiosInstance.patch<UpdateProfileResponse>('/api/v1/profiles/me', profileData);

    return reponse.data;*/
    /** Mocking */
    console.log("⚠️ [PATCH] 프로필 수정 요청:", profileData);
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                isSuccess: true,
                code: "SUCCESS-200",
                message: "프로필 수정에 성공했습니다.",
                result: {
                    id: 10
                }      
            });
        }, 500);
    });

}