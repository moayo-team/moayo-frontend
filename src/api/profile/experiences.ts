import type { CareerResponse } from "../../types/career";



export const getExperiences = async(
    sort: 'LATEST' | 'OLDEST' = 'LATEST',
    cursor?: string,
    size: number =12
): Promise<CareerResponse> => {
    /*
    const params ={
        sort,
        size,
        ...(cursor && {cursor}), 
    };

    const response = await axiosInstance.get<CareerResponse>('/api/v1/experiences',{
        params, 
        headers: {
           Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
    });
    return response.data;
    */

    /**mocking */
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                items: [
                    {
                        resumeId: 101,
                        title: "UMC 9th 앱 개발 동아리",
                        organization: "한국 너디너리 해커톤",
                        startDate: "2024-08-13",
                        endDate: "2024-10-02",
                        summary: "전반적인 기획과 UI 디자인 참여",
                        role: "디자이너",
                        updatedAt: "2026-01-06T10:35:00"
                    },
                    {
                        resumeId: 102,
                        title: "프론트엔드 스터디 10주 과정",
                        organization: "교내 학술 소모임",
                        startDate: "2025-12-17",
                        endDate: "2026-01-19",
                        summary: "React 및 TypeScript를 활용한 프로젝트 진행",
                        role: "프론트엔드 개발자",
                        updatedAt: "2026-01-05T09:20:00"
                    }
                ],
                pageInfo: {
                    hasNext: false,
                    nextCursor: ""
                }
            });
        }, 500); // 0.5초 로딩 효과
    });
};