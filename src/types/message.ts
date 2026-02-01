// src/types/message.ts

/** ISO date string (ex: "2026-02-01T08:00:00.000Z") */
export type ISODateString = string;

/** 채팅 메시지 (기존 Message + ChatMessageResponse 통합본) */
export type ChatMessage = {
  id: number;                 // message id
  chatRoomId: number;         // room id (가능하면 항상 존재하도록 통일)
  senderId: number;           // sender user id
  content: string;

  // 확장(삭제/운영용). 지금 서버가 안 주면 기본값으로 처리 가능
  isDeleted?: boolean;        // default: false
  deletedAt?: ISODateString | null; // default: null

  createdAt: ISODateString;   // 서버 응답 그대로
};

/** 채팅방 참가자 (기존 ChatParticipants 통합/정리) */
export type ChatParticipant = {
  id: number;                 // participant row id
  chatRoomId: number;
  userId: number;

  // 읽음 계산 핵심(서버가 제공하거나 read API 응답에 따라 갱신)
  lastReadMessageId: number | null;

  createdAt: ISODateString;
};

/** 쪽지함(채팅 리스트)에 쓰는 채팅방 요약 (기존 ChatRoomSummary 유지 + 확장) */
export type ChatRoomSummary = {
  roomId: number;
  opponentUserId: number;
  opponentImageUrl: string | null;

  lastMessageContent: string | null;
  lastMessageCreatedAt: ISODateString | null;

  // ✅ 권장: read API/정렬/optimistic에 유리 (서버가 안 주면 null)
  lastMessageId?: number | null;

  // 빨간 점(안읽음) 표시
  hasUnread: boolean;
};

/** 채팅방 화면에서 필요한 최소 room 정보 */
export type ChatRoomInfo = {
  roomId: number;
  meId: number;
};

/** 입력창 props */
export type ChatInputProps = {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
};

/** 채팅방 패널 props */
export type ChatRoomPanelProps = {
  room: ChatRoomInfo;
  messages: ChatMessage[];
  input: ChatInputProps;
};

/* ------------------------------------------------------------------ */
/* (선택) 기존 코드와의 호환을 위해 alias 제공: 점진적 마이그레이션용 */
/* ------------------------------------------------------------------ */

// 기존 이름을 계속 import 하고 있는 곳이 많으면, 당장 깨지지 않게 alias로 붙여둘 수 있어요.
export type Message = ChatMessage; // 기존 Message -> ChatMessage로 통합
export type ChatParticipants = ChatParticipant; // 기존 ChatParticipants -> ChatParticipant

// 기존 Response 이름을 계속 쓰고 있으면 이것도 alias 가능
export type ChatMessageResponse = ChatMessage;

// 기존 Props 이름 유지가 필요하면 alias
export type ChatRoomInfoProps = ChatRoomInfo;
