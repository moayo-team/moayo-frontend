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

/** 기간 유효성 검사 */
export const validatePeriod = (period: string) => {
    // ^(19|20)\d{2}: 19XX 또는 20XX로 시작하는 연도
    // \.\d{2}\.\d{2}: .월.일 형식
    const regex = /^(19|20)\d{2}\.\d{2}\.\d{2}(\s-\s(19|20)\d{2}\.\d{2}\.\d{2})?$/;

    if (!regex.test(period)) return false;

    const dates = period.split(" - ");
    if (dates.length === 2 && dates[1].trim() !== "") {
        const start = new Date(dates[0].replace(/\./g, "-"));
        const end = new Date(dates[1].replace(/\./g, "-"));
        if (start > end) return false;
    }
    
    return true;
};

/** startDate구하기*/
export const getStartDateFromPeriod = (period: string): string => {
    if (!period) return "";

    const startPart = period.split("-")[0].trim();

    // 정렬을 위해 "YYYY-MM-DD" 형태로 변환 (날짜가 없으면 01일로 가정)
    const formatted = startPart.replace(/\./g, "-");

    return formatted;
};
/**endDate구하기 */
export const getEndDateFromPeriod = (period: string): string => {
    if (!period) return "";
    const dates = period.split(" - ");
    if (dates.length < 2) return "";
    return dates[1].replace(/\./g, "-").trim();
};

/**생일 포맷팅 */
export const formatBirthDate = (value: string) => {
    const nums = value.replace(/[^0-9]/g, ""); // 숫자만 추출
    if (nums.length <= 4) return nums;
    if (nums.length <= 6) return `${nums.slice(0, 4)}.${nums.slice(4)}`;
    return `${nums.slice(0, 4)}.${nums.slice(4, 6)}.${nums.slice(6, 8)}`;
};

/**폰 번호 */
export const formatPhoneNumber = (value: string) => {
    const nums = value.replace(/[^0-9]/g, ""); // 숫자만 남기기

    if (nums.length <= 3) {
        return nums;
    }
    if (nums.length <= 7) {
        return `${nums.slice(0, 3)}-${nums.slice(3)}`;
    }
    return `${nums.slice(0, 3)}-${nums.slice(3, 7)}-${nums.slice(7, 11)}`;
};