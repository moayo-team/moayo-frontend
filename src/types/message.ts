//ChatParticipants 수정 X
export type ChatParticipants = {
  id: string;
  name: string;
  role: string;
  preview: string;
  unread?: boolean;
};

//message erd v0보고 수정
export type Message = {
  id: string;
  chatRoomId: string;
  senderId: string;
  content: string;
  is_deleted: boolean;
  createdAt: Date;
};
