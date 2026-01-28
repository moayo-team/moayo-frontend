export interface Career {
  id: number;
  period: string;
  role: string;
  title: string;
  startDate: string;
  organizer: string;
  participation: string;
  intro: string;
  fileName?: string[];
  link?: string[];
  isPublic: boolean; 
}

/*********************** */
//이력 조회 응답
export interface CareerResponse {
  items: Careeritems[];
  pageInfo: {
    hasNext: boolean;
    nextCursor: string | null;
  };
};

export interface Careeritems {
  resumeId: number;
  title: string;
  organization: string;
  startDate: string;
  endDate: string | null;
  summary: string | null;
  role: string | null;
  updatedAt: string;

}


