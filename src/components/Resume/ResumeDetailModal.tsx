import { FileText, ToggleRightIcon, X } from "lucide-react";

interface ResumeDetailModalProps {
  onClose: () => void;
  data: any; // 카드로부터 전달받은 상세 데이터
}
const ResumeDetailModal = ({ data, onClose }: ResumeDetailModalProps) => {
    // 라벨과 데이터 필드 매칭
    const infoFields = [
        { label: "활동명", value: data?.title },
        { label: "주최/기관", value: data?.organizer },
        { label: "기간", value: data?.period },
        { label: "참여형태", value: data?.participation },
        { label: "역할", value: data?.role },
        { label: "활동소개", value: data?.description},
        { label: "파일", value: data?.fileName },
        { label: "링크", value: data?.link },
    ];

    return(
        <>
        <div 
        className="fixed inset-0 bg-black/40 z-40 cursor-pointer" 
        onClick={onClose} />

      
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">        
        {/* 모달 본체 */}   
        <div
          className="flex flex-col px-[70px] py-[50px] justify-center items-center gap-[10px] 
          rounded-[30px] bg-[#F2F2F2]
          max-h-[85vh] overflow-hidden pointer-events-auto"
          onClick={(e) => e.stopPropagation()}
        >

            {/* Body - 스크롤 가능 영역*/}
            <div className="flex-1 overflow-y-auto
                [&::-webkit-scrollbar]:w-2
                [&::-webkit-scrollbar-track]:bg-transparent
                [&::-webkit-scrollbar-thumb]:bg-gray-300
                [&::-webkit-scrollbar-thumb]:rounded-full
                hover:[&::-webkit-scrollbar-thumb]:bg-gray-400"

            >
            <div className="flex flex-col w-[580px] items-start gap-[41px] self-stretch">
                <div className="flex justify-between items-center self-stretch">
                    <span className="font-pretendard text-[32px] font-semibold leading-[130%] tracking-[-0.32px]">이력관리</span>
                    <div className="flex items-center gap-[9px]">
                        <span className="font-pretendard text-[18px] font-normal leading-[150%]">이력 공개 여부</span>
                        <ToggleRightIcon size="40"/>
                    </div>
                </div>

                <div className="flex flex-col items-start gap-[30px] self-stretch">
                    {/**소개 */}
                    <div className="flex flex-col items-center gap-[20px] self-stretch">
                        {infoFields.slice(0, 5).map((item, idx) => (
                            <div key={idx} className="flex justify-center items-center gap-[10px] self-stretch">
                                <div className="flex w-[122px] h-[80px] px-[15px] py-[10px] 
                                    justify-center items-center gap-[10px]
                                    rounded-[5px] bg-[#FAFAFA]
                                    font-pretendard text-[20px] text-[#58575B] font-medium leading-[140%]">
                                {item.label}
                                </div>
                                <input 
                                    type="text"
                                    readOnly
                                    value={item.value || ""}
                                    placeholder="입력해주세요."
                                    className="flex flex-col justify-center items-start
                                    w-[432px] h-[80px] p-[20px]
                                    border rounded-[10px] bordr-[#D6D6D8]
                                    font-pretendard text-[24px] font-semibold leading-[130%] text-[#58575B]                             
                                    placeholder:text-[#969599] placeholder:font-medium placeholder:text-[24px]"
                                />
                            </div>
                        ))}
                    </div>
                    
                    <div className="flex flex-col items-start self-stretch gap-[14px]">
                        <span className="font-pretendard text-[24px] font-medium leading-[130%]">활동 소개</span>
                        <textarea
                            readOnly
                            value={data?.description || ""}
                            placeholder="입력해주세요."
                            className="flex flex-col items-start
                            w-[580px] h-[143px] p-[30px]
                            border rounded-[10px] bordr-[#D6D6D8]
                            font-pretendard text-[20px] font-semibold leading-[140%] text-[#58575B]                             
                            placeholder:text-[#969599] placeholder:font-medium placeholder:text-[24px]"
                        />
                    </div>

                    {/**첨부 */}
                    <div className="flex flex-col items-start gap-[20px] self-stretch">
                        <div className="flex flex-col items-start gap-[14px] self-stretch">
                            <span className="slef-stretch 
                                text-[24px] font-pretendard font-medium leading-[130%]">
                            파일 첨부
                            </span>
                            <div className="flex flex-col gap-[10px] self-stretch">
                                {/* 파일 데이터가 배열로 여러 개 있을 경우*/}
                                {data?.files && data.files.length > 0 || data?.fileName ? (
                                    <>
                                        {/* 배열일 경우 */}
                                        {data?.files && data.files.length > 0 ? (
                                            data.files.map((file: any, index: number) => (
                                            <div key={index} className="flex flex-col w-[580px] h-[91px] px-[40px] py-[30px] 
                                                            justify-center items-start gap-[10px] rounded-[20px] bg-[#E9FCF7]">
                                                <div className="flex justify-between items-center self-stretch flex-1 w-full">
                                                <span className="font-pretendard text-[20px] font-medium leading-[140%] text-[#343436]">
                                                    {file.name}
                                                </span>
                                                <X size="24" className="text-[#7C7B80] cursor-pointer" />
                                                </div>
                                            </div>
                                            ))
                                        ) : (
                                            /* 단일 파일명만 있을 경우 1개만 출력 */
                                            <div className="flex flex-col w-[580px] h-[91px] px-[40px] py-[30px] 
                                                            justify-center items-start gap-[10px] rounded-[20px] bg-[#E9FCF7]">
                                            <div className="flex justify-between items-center self-stretch flex-1 w-full">
                                                <span className="font-pretendard text-[20px] font-medium leading-[140%] text-[#343436]">
                                                {data.fileName}
                                                </span>
                                                <X size="24" className="text-[#7C7B80] cursor-pointer" />
                                            </div>
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    /* 파일이 없을 때 (단일 fileName만 있을 경우의 예외 처리 포함) */
                                    <div className="flex flex-col w-[580px] h-[102px] px-[159px] py-[24px] 
                                                    justify-center items-center gap-[10px] rounded-[30px] bg-white
                                                    rounded-[20px] bg-[#E9FCF7]">
                                        <div className="flex justify-center items-center gap-[10px]">
                                            <FileText size="40" className="text-[#969599]"/>
                                            <div className="flex flex-col px-[10px] py-[5px] justify-center items-center gap-[4px]">
                                                <span className="self-stretch text-center
                                                    font-pretendard text-[20px] font-medium leading-[140%] text-[#969599]">
                                                    {data?.fileName || "파일을 첨부해주세요"}
                                                </span>
                                                <span className="self-stretch text-center
                                                    font-pretendard text-[14px] font-normal leading-[150%] text-[#969599]">
                                                    (증빙서류, 포트폴리오)
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                        

                        <div className="flex flex-col items-start gap-[14px] self-stretch">
                            <span className="self-stretch font-pretendard text-[24px] font-medium leading-[130%]">
                                링크 첨부
                            </span>
                            <div className="flex flex-col gap-[10px] self-stretch">
                                {/* 링크 데이터 존재 여부 확인 (배열 혹은 단일 문자열)*/}
                                {data?.links && data.links.length > 0 || data?.link ? (
                                    <>
                                        {/* 배열일 경우 */}
                                        {data?.links && data.links.length > 0 ? (
                                            data.links.map((linkUrl: any, index: number) => (
                                            <div key={index} className="flex flex-col w-[580px] h-[91px] px-[40px] py-[30px] 
                                                            justify-center items-start gap-[10px] rounded-[20px] bg-[#E9FCF7]">
                                                <div className="flex justify-between items-center self-stretch flex-1 w-full">
                                                    <a 
                                                        href={linkUrl} 
                                                        target="_blank" 
                                                        rel="noopener noreferrer"
                                                        className="text-[#343436] font-pretendard font-semibold text-[20px] leading-[140%]
                                                        underline decoration-solid underline-offset-auto
                                                        truncate max-w-[440px] cursor-pointer transition-colors"
                                                        >
                                                        {linkUrl}
                                                    </a>
                                                    <X size="24" className="text-[#7C7B80] cursor-pointer" />
                                                </div>
                                            </div>
                                            ))
                                        ) : (
                                            /* 단일 링크(link)만 있을 경우 */
                                            <div className="flex flex-col w-[580px] h-[91px] px-[40px] py-[30px] 
                                                            justify-center items-start gap-[10px] rounded-[20px] bg-[#E9FCF7]">
                                                <div className="flex justify-between items-center self-stretch flex-1 w-full">
                                                    <a 
                                                        href={data.link} 
                                                        target="_blank" 
                                                        className="text-[#343436] font-pretendard font-semibold text-[20px] leading-[140%]
                                                        underline decoration-solid underline-offset-auto
                                                        truncate max-w-[440px] cursor-pointer transition-colors">
                                                    {data.link}
                                                    </a>
                                                    <X size="24" className="text-[#7C7B80] cursor-pointer" />                                          
                                                </div>
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    /* 링크가 없을 때  */
                                    <div className="flex flex-col w-[580px] h-[102px] px-[159px] py-[24px] 
                                                    justify-center items-center gap-[10px] rounded-[30px] bg-white
                                                    rounded-[20px] bg-[#E9FCF7]">
                                        <div className="flex justify-center items-center gap-[10px]">
                                            <FileText size="40" className="text-[#969599]"/>
                                            <div className="flex flex-col px-[10px] py-[5px] justify-center items-center gap-[4px]">
                                                <span className="self-stretch text-center
                                                    font-pretendard text-[20px] font-medium leading-[140%] text-[#969599]">
                                                    {data?.fileName || "파일을 첨부해주세요"}
                                                </span>
                                                <span className="self-stretch text-center
                                                    font-pretendard text-[14px] font-normal leading-[150%] text-[#969599]">
                                                    (증빙서류, 포트폴리오)
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
          </div> 
        </div>
      </div>

        </>
    )
}

export default ResumeDetailModal