import { useCallback, useEffect, useState } from "react";
import { apiClient } from "../lib/apiClient";
import type { ChatRoomSummary } from "../types/message";
import { useChatThreadListSubscription } from "./useChatThreadListSubscription";

type ApiEnvelope<T> = {
   isSuccess: boolean;
   code: string;
   message: string;
   timestamp: string;
   result: T;
};

type MyProfileResult = {
   user: {
      id: number;
      name: string;
      email: string;
      phoneNumber?: string;
   };
   profile?: any;
   interestTags?: any[];
   indexItems?: any[];
   documents?: any[];
};

function sortRooms(list: ChatRoomSummary[]) {
   return [...list].sort((a, b) => {
      const at = a.lastMessageCreatedAt ? new Date(a.lastMessageCreatedAt).getTime() : 0;
      const bt = b.lastMessageCreatedAt ? new Date(b.lastMessageCreatedAt).getTime() : 0;
      if (bt !== at) return bt - at;
      return (b.roomId ?? 0) - (a.roomId ?? 0);
   });
}

export function useChatRooms(activeRoomId: number | null = null) {
   const [rooms, setRooms] = useState<ChatRoomSummary[]>([]);
   const [loading, setLoading] = useState(false);
   const [error, setError] = useState<string>("");

   const [myUserId, setMyUserId] = useState<number | null>(null);

   const fetchRooms = useCallback(async () => {
      setLoading(true);
      setError("");
      try {
         const res = await apiClient.get<ApiEnvelope<ChatRoomSummary[]>>("/api/v1/chat/rooms");
         setRooms(sortRooms(res.data.result ?? []));
      } catch (e: any) {
         setError(String(e?.message ?? e));
      } finally {
         setLoading(false);
      }
   }, []);

   useEffect(() => {
      fetchRooms();
   }, [fetchRooms]);

   useEffect(() => {
      let mounted = true;

      (async () => {
         try {
            const res = await apiClient.get<ApiEnvelope<MyProfileResult>>("/api/v1/profiles/me");
            const id = res.data.result?.user?.id;

            if (!mounted) return;

            if (typeof id === "number" && Number.isFinite(id)) {
               setMyUserId(id);
               // 있으면 저장해도 되고(선택), 없어도 상관 없음
               localStorage.setItem("userId", String(id));
            } else {
               setMyUserId(null);
            }
         } catch {
            if (!mounted) return;
            setMyUserId(null);
         }
      })();

      return () => {
         mounted = false;
      };
   }, []);

   // STOMP 구독으로 리스트 실시간 업데이트
   useChatThreadListSubscription({
      myUserId,
      activeRoomId,
      setRooms
   });

   const createRoom = useCallback(async (userBId: number, originPostId: number) => {
      const res = await apiClient.post<ApiEnvelope<{ roomId: number }>>("/api/v1/chat/rooms", {
         userBId,
         originPostId
      });
      return res.data.result.roomId;
   }, []);

   return { rooms, loading, error, refetch: fetchRooms, createRoom, setRooms, myUserId };
}

