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
