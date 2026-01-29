export const getDisplayName = (fullName: string) => {
  if (!fullName) return "";

  // 지금 더미는 한글 이름이니까
  if (/^[가-힣]+$/.test(fullName) && fullName.length >= 2) {
    return fullName.slice(1); // 김주연 → 주연
  }

  // 구글 로그인 대비
  const parts = fullName.trim().split(" ");
  return parts.length > 1 ? parts[parts.length - 1] : fullName;
};