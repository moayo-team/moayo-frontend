//ChatParticipants 수정 O
export type ChatParticipants = {
  id: string;
  chatRoomId: string;
  userId: string;
  lastReadMessageId: string;
  createdAt: Date;
};

//message erd v0보고 수정
export type Message = {
  id: string;
  chatRoomId: string;
  senderId: string;
  content: string;
  isDeleted: boolean;
  deletedAt: Date;
  createdAt: Date;
};

// 쪽지함에 쓰는 채팅방 요약
export type ChatRoomSummary = {
	roomId: number;
	opponentUserId: number;
	opponentImageUrl: string | null;
	lastMessageContent: string | null;
	lastMessageCreatedAt: string | null;
	hasUnread: boolean;
};

// 메시지 응답
export type ChatMessageResponse = {
	id: number;
	chatRoomId?: number;
	senderId: number;
	content: string;
	createdAt: string;
};

export type ChatRoomInfoProps = {
	roomId: number;
	meId: number;
};

export type ChatInputProps = {
	value: string;
	onChange: (value: string) => void;
	onSend: () => void;
};

export type ChatRoomPanelProps = {
	room: ChatRoomInfoProps;
	messages: ChatMessageResponse[];
	input: ChatInputProps;
};
