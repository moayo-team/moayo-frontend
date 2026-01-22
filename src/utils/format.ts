/** 기간 포맷팅*/
export const formatPeriod = (value: string) => {
    const nums = value.replace(/[^0-9]/g, "");
    let result = "";

    if (nums.length <= 8) {
        result = nums.replace(/(\d{4})(\d{2})?(\d{2})?/, (_, p1, p2, p3) => 
            [p1, p2, p3].filter(Boolean).join(".")
        );
    } else {
        const firstDate = nums.slice(0, 8).replace(/(\d{4})(\d{2})(\d{2})/, "$1.$2.$3");
        const secondDate = nums.slice(8, 16).replace(/(\d{4})(\d{2})?(\d{2})?/, (_, p1, p2, p3) => 
            [p1, p2, p3].filter(Boolean).join(".")
        );
        result = `${firstDate} - ${secondDate}`;
    }
    return result;
};

/** startDate구하기*/
export const getStartDateFromPeriod = (period: string): string => {
  if (!period) return "";
  
  const startPart = period.split("-")[0].trim(); 
  
  // 정렬을 위해 "YYYY-MM-DD" 형태로 변환 (날짜가 없으면 01일로 가정)
  const formatted = startPart.replace(/\./g, "-");
  
  return formatted; 
};
/**기간 유효성 검사 */
export const validatePeriod = (period: string) => {
    const regex = /^\d{4}\.\d{2}\.\d{2}\s-\s\d{4}\.\d{2}\.\d{2}$/;
    return regex.test(period);
};