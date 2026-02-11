import React from "react";
import { useNavigate } from "react-router-dom";
import loginillustration from "../../assets/login-ill.svg";

// -------------------------------------------------------------------------
// 1. 로그인 카드 컴포넌트
// -------------------------------------------------------------------------

interface LoginCardProps {
  onLogin: () => void;
}

export const LoginCard: React.FC<LoginCardProps> = ({ onLogin }) => {
  return (
    <div className="bg-[#fbfaf9] flex flex-col items-center justify-center p-[30px] rounded-[10px] w-full max-w-[450px] shadow-lg gap-8">
      {/* 헤더 텍스트 */}
      <div className="flex flex-col gap-[8px] items-center text-[#25221d] text-center">
        <h1 className="font-['Pretendard'] font-bold text-[24px] leading-tight ">로그인</h1>
        <p className="font-['Pretendard'] font-normal text-[14px]">프로필을 작성하고 팀원을 구해보세요!</p>
      </div>

      {/* 일러스트 영역 (간소화됨) */}
      <div className="relative w-[100px] h-[100px] flex items-center justify-center rounded-full">
        <img src={loginillustration} alt="Login Illustration" />
        {/* TODO: 여기에 Figma에서 추출한 SVG 코드를 넣거나,<img src={loginIllustration} /> 로 교체하세요 */}
      </div>

      {/* 로그인 버튼 영역 */}
      <div className="flex flex-col gap-[10px] items-center w-full">
        <p className="font-['Pretendard'] font-medium text-[#5f5749] text-[14px] text-center">
          SNS 로 3초 로그인하고 모아요를 더 쉽게 즐겨보세요!
        </p>
        
        <button 
          onClick={onLogin}
          className="bg-white border border-[#d9d9d9] rounded-[6px] w-full py-[18px] px-[24px] flex items-center justify-center gap-3 hover:shadow-sm hover:bg-gray-50 transition-all cursor-pointer"
        >
          {/* 구글 아이콘 (간소화) */}
          <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
             <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-full h-full" />
          </div>
          <span className="font-['Pretendard'] font-semibold text-[#25221d] text-[16px]">구글로 계속하기</span>
        </button>
      </div>
    </div>
  );
};

// -------------------------------------------------------------------------
// 2. 로그인 성공 모달 컴포넌트
// -------------------------------------------------------------------------

interface LoginSuccessModalProps {
  onClose: () => void;
}

export const LoginSuccessModal: React.FC<LoginSuccessModalProps> = ({ onClose }) => {
  const navigate = useNavigate();

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
      <div className="bg-[#fbfaf9] p-[30px] rounded-[10px] w-full max-w-[450px] shadow-2xl relative flex flex-col gap-8 items-center">
        
        {/* 닫기 버튼 */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 rounded-full hover:bg-black/5 transition-colors"
        >
          ✕
        </button>

        {/* 텍스트 */}
        <div className="flex flex-col gap-[8px] items-center text-[#25221d] text-center mt-4">
          <h2 className="font-['Pretendard'] font-bold text-[24px]">로그인이 완료되었습니다!</h2>
          <p className="font-['Pretendard'] font-normal text-[14px]">모아요의 자세한 서비스를 둘러보세요!</p>
        </div>

        {/* 일러스트 영역 */}
        <div className="relative w-[100px] h-[100px] flex items-center justify-center rounded-full">
          <img src={loginillustration} alt="Success Illustration"/>
        </div>

        {/* 버튼 그룹 */}
        <div className="flex flex-col gap-[10px] w-full">
          <ActionButton text="프로필 바로가기" onClick={() => { onClose(); navigate('/profile'); }} />
          <ActionButton text="게시판 바로가기" onClick={() => { onClose(); navigate('/board'); }} />
        </div>
      </div>
    </div>
  );
};

// 공통 버튼 컴포넌트
const ActionButton = ({ text, onClick }: { text: string; onClick: () => void }) => (
  <button 
    onClick={onClick}
    className="bg-[#6eebc7] h-[48px] w-full rounded-[10px] flex items-center justify-center hover:bg-[#5cdbb7] transition-colors cursor-pointer"
  >
    <span className="font-['Pretendard'] font-medium text-[#25221d] text-[20px]">{text}</span>
  </button>
);