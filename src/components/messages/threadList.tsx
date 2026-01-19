import ThreadListItem from "./messageCard";
import type { ChatParticipants } from "../../types/message";

type Props = {
  threads: ChatParticipants[];
  selectedThreadId: string;
  onSelectThread: (id: string) => void;
};

export default function ThreadList({ threads, selectedThreadId, onSelectThread }: Props) {
  return (
    <div className="h-full min-h-0 overflow-y-auto p-4 space-y-3">
      {threads.map((t) => (
        <ThreadListItem
          key={t.id}
          thread={t}
          active={t.id === selectedThreadId}
          onClick={() => onSelectThread(t.id)}
        />
      ))}
    </div>
  );
}
