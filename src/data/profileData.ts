import profilePhoto from "../assets/profile_photo.svg";

export const DUMMY_PROFILE = {
  name: "김주연",
  jobTitle: "디자이너, 기획자",
  profileImage: profilePhoto,
  introduction: "자기소개를 해주세요. 자기소개를 해주세요. 자기소개를 해주세요. 자기소개를 해주세요.",
  contact: {
    email: "rwd4533@naver.com",
    phone: "010-9341-3333",
    kakaoId: "bladkfjfd",
  },
  education: [
    {
      id: 1,
      period: "22.3 ~",
      school: "이화여자대학교",
      major: "커뮤니케이션 미디어학부 재학중",
      subMajor: "융합 콘텐츠학과 복수전공",
      isVerified: true, // 학력인증 완료 표시용
    },
    {
      id: 2,
      period: "22.3 ~",
      school: "이화여자대학교",
      major: "커뮤니케이션 미디어학부 재학중",
      subMajor: null,
      isVerified: true, // 학력인증 완료 표시용
    }
  ],
  careers: [
    {
      id: 1,
      period: "2022.03.01 - 2022.04.07",
      role: "선임 디자이너",
      title: "UMC 9th 앱 개발 동아리",
      startDate: "2025-01-13",
      organizer: "한국 너디너리 해커톤..",
      participation: "전반적인 기획과 ui디자인 참여",
      fileName: ["UMC_기획서_최종.pdf"],
      link: ["https://www.figma.com/file/..."],
      intro: "저는참여햇어요햇어요햇어요햇엉햇햇햇어요",
      isPublic: true,

    },
    {
      id: 2,
      period: "2020.01.13 - 2022.02.13",
      role: "주니어 기획자",
      title: "UMC 9th 앱 개발 동아리",
      startDate: "2020-01-13",
      organizer: "한국 너디너리 해커톤..",
      participation: "전반적인 기획과 ui디자인 참여",
      fileName: ["UMC_기획서_최종.pdf"],
      link: ["https://www.figma.com/file/..."],
      intro: "저는참여햇어요햇어요햇어요햇엉햇햇햇어요",
      isPublic: true,
    },
    {
      id: 3,
      period: "2020.05.13 - 2022.07.13",
      role: "주니어 기획자",
      title: "UMC 9th 앱 개발 동아리",
      startDate: "2020-05-13",
      organizer: "한국 너디너리 해커톤..",
      participation: "전반적인 기획과 ui디자인 참여",
      fileName: ["UMC_기획서_최종.pdf"],
      intro: "저는참여햇어요햇어요햇어요햇엉햇햇햇어요",
      isPublic: false,
    },
    {
      id: 4,
      period: "2021.01.13 - 2021.02.13",
      role: "주니어 기획자",
      title: "UMC 9th 앱 개발 동아리",
      startDate: "2021-01-13",
      organizer: "한국 너디너리 해커톤..",
      participation: "전반적인 기획과 ui디자인 참여",
      intro: "저는참여햇어요햇어요햇어요햇엉햇햇햇어요",
      isPublic: true,
    },
    {
      id: 5,
      period: "2025.01.13 - 2025.02.13",
      role: "주니어 기획자",
      title: "UMC 9th 앱 개발 동아리",
      startDate: "2025-01-13",
      organizer: "한국 너디너리 해커톤..",
      participation: "전반적인 기획과 ui디자인 참여",
      intro: "저는참여햇어요햇어요햇어요햇엉햇햇햇어요",
      isPublic: false,
    }
  ],
  //careers: [],// 초기이력섹션확인용
  additionalInfo: [
    {
      id: 1,
      type: "file",
      title: "2025 포트폴리오",
      description: "프로덕트 디자이너",
      link: "#", 
    },
    {
      id: 2,
      type: "link",
      title: "Github",
      link: "https://github.com/...", 
    }
  ],
  tags: [{id:1, title:"디자인"}, {id:2, title: "기획"},{id:3, title: "기획"},{id:4, title: "기획"}]
};