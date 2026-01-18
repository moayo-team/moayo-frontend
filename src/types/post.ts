export interface Post {
  id: number;
  title: string;
  intro: string;
  author: string;
  category: string;
  preferred: string;
  image: string;    // 이미지 URL 또는 빈 문자열
  isLiked: boolean; // 좋아요 여부
}

