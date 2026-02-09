import ThreadListItem from "./messageCard";
import type { ChatRoomSummary } from "../../types/message";

type Props = {
  threads: ChatRoomSummary[];
  selectedRoomId: number | null;
  onSelectRoom: (roomId: number) => void;
};

export default function ThreadList({ threads, selectedRoomId, onSelectRoom }: Props) {
  return (
    <div className="h-full min-h-0 overflow-y-auto overflow-x-hidden space-y-[10px] hide-scrollbar pr-1">
      {threads.map((t) => (
        <ThreadListItem
          key={t.roomId}
          thread={t}
          active={t.roomId === selectedRoomId}
          onClick={() => onSelectRoom(t.roomId)}
        />
      ))}
    </div>
  );
}
