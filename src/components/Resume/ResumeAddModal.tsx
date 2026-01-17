import { Paperclip, X } from "lucide-react";
import { useRef, useState } from "react";

interface ResumeAddModalProps {
  onClose: () => void;
  onAdd: (data: any) => void;
  initialData?: any;
}

const ResumeAddModal = ({ onClose, initialData }: ResumeAddModalProps) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  //모든 입력값을 하나의 객체로 관리
    const [formData, setFormData] = useState({
    title: initialData?.title || "",
    organizer: initialData?.organizer || "",
    startDate: initialData?.startDate || new Date().toISOString().split("T")[0],
    period: initialData?.period || "",
    participation: initialData?.participation || "",
    role: initialData?.role || "",
    description: initialData?.description || "",
  });

  //입력값이 변할 때 호출
  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // 파일 처리 공통 로직
  const handleFileProcess = (files: FileList) => {
    const newFiles = Array.from(files);
    setSelectedFiles((prev) => [...prev, ...newFiles]);
  };

  //  클릭 시 파일 선택창 띄우기
  const handleBoxClick = () => {
    fileInputRef.current?.click();
  };

  // 파일 선택창에서 선택했을 때
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFileProcess(e.target.files);
    }
  };

  

  
  // 드래그 오버 핸들러 (파일을 영역 위로 올렸을 때)
  const handleDragOver = (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
  };

  

  // 드롭 핸들러 (파일을 놓았을 때)
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files) {
      handleFileProcess(e.dataTransfer.files);
    }
  };
  
  // 선택된 파일 삭제
  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // 라벨과 데이터 필드 매칭을 위한 배열
    const inputFields = [
      { label: "활동명", field: "title" },
      { label: "주최/기관", field: "organizer" },
      { label: "기간", field: "period" },
      { label: "참여형태", field: "participation" },
      { label: "역할", field: "role" },
    ];

    return (
    <>
      {/* dim */}
      <div
        className="fixed inset-0 bg-black/40 z-40"
        onClick={onClose}
      />

      {/* modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div
          className="rounded-[30px] bg-[#F2F2F2]
          px-[43px] py-[60px] inline-flex gap-[10px]
          max-h-[85vh] max-w-[700px] w-full
          overflow-hidden pointer-events-auto"
          onClick={(e) => e.stopPropagation()}// 모달 내부 클릭 시 닫히지 않게
        >
          {/* 기본 정보 */}
          <div className="flex-1 overflow-y-auto 
            /* 커스텀 스크롤바 스타일링*/
            [&::-webkit-scrollbar]:w-2
            [&::-webkit-scrollbar-track]:bg-transparent
            [&::-webkit-scrollbar-thumb]:bg-gray-300
            [&::-webkit-scrollbar-thumb]:rounded-full
            hover:[&::-webkit-scrollbar-thumb]:bg-gray-400"
          >
          <div className="flex flex-col w-[580px] items-start gap-[33px]">
            <div className="flex flex-col items-start gap-[20px] self-stretch">
                {inputFields.map((item) => (
                <div key={item.field} className="flex items-center gap-[26px] self-stretch">
                    {/**라벨 */}
                    <div className="flex items-center justify-center whitespace-nowrap w-[122px] h-[62px] px-[15px] py-[10px] 
                        rounded-[20px] bg-white 
                        text-[24px] font-pretendard font-medium">
                        {item.label}
                    </div>
                    {/**입력 */}
                    <input
                        type="text"
                        value={(formData as any)[item.field]}
                        onChange={(e) => handleChange(item.field, e.target.value)}
                        className="w-[432px] h-[62px] rounded-[10px] bg-[#D6D6D8]/20 px-[16px] font-pretendard text-black outline-none"
                    />
                </div>
              ))}
            </div>

            {/* 활동 소개 */}
            <div className="flex flex-col w-[580px] items-start gap-[19px]">
                <span className="font-pretendard text-[24px] font-medium leading-[130%]">
                활동 소개
                </span>
                <textarea
                placeholder="자유롭게 입력해주세요."
                value={formData.description}
                onChange={(e) => handleChange("description", e.target.value)}
                className="
                    flex h-[281px] items-start self-stretch gap-[10px]
                    px-[41px] py-[33px]
                    rounded-[30px] bg-white
                    outline-none resize-none
                    text-[20px] font-pretendard font-medium leading-[140%]
                    placeholder:text-[#969599] 
                "
                />
            </div>

            {/* 파일 첨부 */}
            <div className="flex flex-col items-start self-stretch gap-[19px]">
                <span className="text-[24px] font-pretendard font-medium leading-[130%]">
                파일 첨부
                </span>

                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileChange} 
                  className="hidden" 
                  multiple // 여러 개 선택 가능
                />

                <div 
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  onClick={handleBoxClick}
                  className="flex flex-col items-center justify-center items-start self-stretch
                  h-[102px] px-[159px] py-[24px]
                  rounded-[30px] bg-white cursor-pointer "
                > 
                  <div className="flex items-center gap-[10px] pointer-events-none">
                      <Paperclip size="44" className="text-[#969599]"/>
                      <div className="flex flex-col">
                          <span className={`text-[20px] font-medium font-pretendard text-[#969599]`}>
                             파일을 첨부해주세요
                          </span>
                          <span className="text-[14px] text-[#969599] font-pretendard">
                            (증빙서류, 포트폴리오, Github)
                          </span>
                      </div>
                  </div>
              </div>
            </div>
            </div>
        </div>
        </div>
      </div>
    </>
  );
};

export default ResumeAddModal;
