import ThreadListItem from "./messageCard";
import type { ChatParticipants } from "../../types/message";

type Props = {
  threads: (ChatParticipants & {
    name?: string;
    role?: string;
    preview?: string;
    unread?: boolean;
  })[];
  selectedThreadId: string;            //chatRoomId
  onSelectThread: (roomId: string) => void;
};

export default function ThreadList({ threads, selectedThreadId, onSelectThread }: Props) {
  return (
    <div className="h-full min-h-0 space-y-[10px]">
      {threads.map((t) => (
        <ThreadListItem
          key={t.id}
          thread={t}
          active={t.chatRoomId === selectedThreadId}     //chatRoomId 비교
          onClick={() => onSelectThread(t.chatRoomId)}   //chatRoomId 전달
        />
      ))}
    </div>
  );
}
