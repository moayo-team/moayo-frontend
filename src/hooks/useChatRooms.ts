import { useCallback, useEffect, useState } from "react";
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

  const fetchRooms = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await apiClient.get<ApiEnvelope<ChatRoomSummary[]>>("/api/v1/chat/rooms");
      setRooms(res.data.result ?? []);
    } catch (e: any) {
      setError(String(e?.message ?? e));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRooms();
  }, [fetchRooms]);

  const createRoom = useCallback(async (userBId: number, originPostId: number) => {
    const res = await apiClient.post<ApiEnvelope<{ roomId: number }>>("/api/v1/chat/rooms", {
      userBId,
      originPostId,
    });
    return res.data.result.roomId;
  }, []);

  return { rooms, loading, error, refetch: fetchRooms, createRoom };
}
