
export const DUMMY_PROFILE = {
  name: "김주연",
  profileImage: null,
  introduction: null,
  details:[
    { id: "birth", label: "생년월일", value: "2003.09.25"},
    { id: "school", label: "학력", value: "한양대학교", isVerified: false },
    { id: "major", label: "학과", value: "경영학과" },
    { id: "email", label: "이메일", value: "" }, 
    { id: "phone", label: "전화번호", value: "010-9341-4533" },
  ],
  additionalDetails: [],
  tags: [
    {id:1, title:"디자인"}, 
    {id:2, title: "기획"},
  ],
  // profileImage: null, //초기화면용
  // introduction: null, //초기화면용
  // details:[{ id: "birth", label: "생년월일", value: null},
  //   { id: "school", label: "학력", value: null, isVerified: false },
  //   { id: "major", label: "학과", value: null },
  //   { id: "email", label: "이메일", value: null }, 
  //   { id: "phone", label: "전화번호", value: null },], //초기화면용
  // tags:[], //초기화면용
  // //careers: [],// 초기화면용
  // additionalDetails: [], // 초기화면용

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
  
};