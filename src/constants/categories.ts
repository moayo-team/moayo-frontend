// 중앙에서 카테고리 레이블과 백엔드 enum를 관리합니다.
export const LABEL_TO_ENUM: Record<string, string> = {
  '기획': 'PLANNING',
  '마케팅': 'MARKETING',
  '디자인': 'DESIGN',
  '개발': 'DEVELOPMENT',
  '창업': 'STARTUP',
  '예체능': 'ART_SPORTS',
  '문학': 'LITERATURE',
  '기타': 'OTHERS',
};

export const ENUM_TO_LABEL: Record<string, string> = Object.fromEntries(
  Object.entries(LABEL_TO_ENUM).map(([k, v]) => [v, k])
);

export const CATEGORIES = [
  { id: 'planning', label: '기획' },
  { id: 'marketing', label: '마케팅' },
  { id: 'design', label: '디자인' },
  { id: 'development', label: '개발' },
  { id: 'startup', label: '창업' },
  { id: 'arts', label: '예체능' },
  { id: 'literature', label: '문학' },
  { id: 'other', label: '기타' },
];

export const mapLabelToEnum = (label?: string) => {
  if (!label) return undefined;
  return LABEL_TO_ENUM[label] ?? label;
};

export const mapEnumToLabel = (enumVal?: string) => {
  if (!enumVal) return undefined;
  return ENUM_TO_LABEL[enumVal] ?? enumVal;
};
