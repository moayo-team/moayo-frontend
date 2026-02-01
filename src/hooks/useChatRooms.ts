import { useEffect, useState } from "react";
import { apiClient } from "../lib/apiClient";
import type { ChatRoomSummary } from "../types/message";

type ApiEnvelope<T> = {
  isSuccess: boolean;
  code: string;
  message: string;
  timestamp: string;
  result: T;
};

export function useChatRooms() {
  const [rooms, setRooms] = useState<ChatRoomSummary[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    let cancelled = false;

    const fetchRooms = async () => {
      setLoading(true);
      setError("");

      try {
        const res = await apiClient.get<ApiEnvelope<ChatRoomSummary[]>>("/api/chat/rooms");
        if (!cancelled) setRooms(res.data.result ?? []);
      } catch (e: any) {
        if (!cancelled) setError(String(e?.message ?? e));
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchRooms();

    return () => {
      cancelled = true;
    };
  }, []);

  return { rooms, loading, error, setRooms };
}
